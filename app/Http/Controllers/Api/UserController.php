<?php

namespace App\Http\Controllers\Api;

use App\Models\BusinessPromotion;
use App\Models\LoginDevice;
use DateTime;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Branch;
use App\Models\History;
use App\Models\Business;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function __construct(protected User $model)
    {
    }

    public function index($id = null)
    {

        if ($id) {
            $user = $this->model->find($id);
            info($user->toArray());
            $user['token'] = $user->createToken(env('APP_NAME') . '_Token')->plainTextToken;
            return sendResponse(new UserResource($user), 200);
        } else {
            return sendResponse($this->model->all(), 200);
        }

    }

    public function update(Request $request)
    {

        $user = $this->model->find(Auth::user()->id);
        $user->name = $request->name;
        $user->save();

        $business = Business::find($user->business_id);
        $business->name = $request->business_name;
        $business->save();

        return sendResponse($user, 200, "Updated successfully");

    }

    public function changePassword(Request $request)
    {

        $user = $this->model->find(Auth::user()->id);

        info(Hash::check("12345678", $user->password) ? "true" : "false");

        if (!Hash::check($request->oldPassword, $user->password)) {
            return sendResponse(null, 401, "Please check your old password");
        }

        $request->validate([
            'newPassword' => [
                'required',
                'string',
                'min:8',             // must be at least 8 characters
                'regex:/[a-z]/i',  // must contain at least one lowercase letter
                'regex:/[A-Z]/i',  // must contain at least one uppercase letter
                'regex:/[0-9]/i',  // must contain at least one number
                'regex:/[^A-Za-z0-9]/i',  // must contain at least one special character
            ],
        ]);

        $user->password = Hash::make($request->newPassword);
        $user->save();
        return sendResponse($user, 200, "Password changed successfully");

    }

    public function setPushNotiToken(Request $request)
    {
        $user = $this->model->find(Auth::user()->id);

        LoginDevice::where('user_id',$user->id)->where('device_id',operator: $request->deviceId)->update(['push_noti_token' => $request->token]);

        return sendResponse($user, 200, "Token set successfully");
    }

    public function redeemPoints(Request $request)
    {

        info($request->all());

        if ($request->missing(['idcard', 'points'])) {
            return sendResponse(null, 400, "Invalid QR code");
        }

        $cloud_db = DB::connection('Cloud');
        $member_info = $cloud_db->table('public.gbh_customer')
            ->where('identification_card', $request->idcard)
            ->first();

        if (!$member_info) {
            return sendResponse(null, 404, "Member not found");
        }

        $ts = $request->timeStamp;
        
        if (strlen((string) $ts) === 10) {
            $ts = $ts * 1000;
        }

        $timestamp = Carbon::createFromTimestampMs((int) $ts);
        $expired_time = $timestamp->addMinutes(5);
        
        if (Carbon::now()->gt($expired_time)) {
            return sendResponse(null, 405, "QR code expired");
        }


        $pos_db = getPosDBConnectionByBranchCode($member_info->branch_code);


        DB::beginTransaction();
        $cloud_db->beginTransaction();
        $pos_db->beginTransaction();
        try {

            $promotion_info = $pos_db->table('gold_exchange.point_exchange_promotion_item')
                ->where('point_exchange_promotion_no', $request->promotion_code)
                ->first();

            if (!$promotion_info) {
                return sendResponse(null, 404, "Promotion not found");
            }

            $valid_promotions = BusinessPromotion::where('business_id', Auth::user()->branch->business->id)->pluck('promotion_code')->toArray();

            if (!in_array($request->promotion_code, $valid_promotions)) {
                return sendResponse(null, 404, "Not allowed to redeem this promotion");
            }


            History::create([
                'member_idcard' => $request->idcard,
                'member_name' => $member_info->fullname,
                'promotion_code' => $request->promotion_code,
                'promotion_name' => $promotion_info->point_exchange_promotion_item_goodname,
                'qty' => $request->qty,
                'redeemed_points' => $request->points,
                'redeemed_date' => now(),
                'business_id' => Auth::user()->branch->business->id,
                'branch_id' => Auth::user()->branch->id
            ]);

            info($member_info->branch_code);

            $recent_doc_no = $pos_db->table('gold_exchange.point_exchange_doc')->where('point_exchange_doc_branch', $member_info->branch_code)->orderByRaw("point_exchange_doc_id DESC")->value('point_exchange_doc_no');

            info($recent_doc_no);

            $dateString = explode('-', $recent_doc_no)[2];
            $formattedDate = DateTime::createFromFormat('ymd', $dateString)->format('Y-m-d');

            $today = Carbon::now()->format('Y-m-d');

            $branch_info = Branch::where('branch_code', $member_info->branch_code)->first();
            $branch_short_name = $branch_info->branch_short_name;

            if ($formattedDate != $today) {
                $docuno = $this->generateNewDocNo($branch_short_name);
                info($docuno);
            } else {
                $number = explode('-', $recent_doc_no)[3];
                $number++;
                $number = str_pad($number, 4, '0', STR_PAD_LEFT);
                $docuno = implode('-', array_slice(explode('-', $recent_doc_no), 0, -1));
                $docuno = "$docuno-$number";
            }

            $idcard = $request->idcard;
            $points = $request->points;

            $remaining = $points;

            $scores = $cloud_db->table('imember.imember_score')
                ->where('idcard', $idcard)
                ->where('score_balance', '>', 0)
                ->orderBy('date_now', 'asc')
                ->get();

            foreach ($scores as $score) {
                if ($remaining <= 0)
                    break;

                $deduct = min($score->score_balance, $remaining);

                $cloud_db->table('imember.imember_score')
                    ->where('imember_score_id', $score->imember_score_id)
                    ->update([
                        'score_balance' => DB::raw("score_balance - $deduct")
                    ]);

                $remaining -= $deduct;
            }

            if ($remaining > 0) {
                DB::rollBack();
                $cloud_db->rollBack();
                $pos_db->rollBack();
                return sendResponse(null, 500, "Something went wrong, Try again");
            }

            $balance_points = $scores->sum('score_balance');

            $supplier_code = '002-000181';

            for ($i = 1; $i <= $request->qty; $i++) {

                $coupon_barcode = $this->generateCouponBarcode($branch_short_name);

                if ($i != 1) {
                    $number = explode('-', $docuno)[3];
                    $number++;
                    $number = str_pad($number, 4, '0', STR_PAD_LEFT);
                    $docuno = implode('-', array_slice(explode('-', $docuno), 0, -1));
                    $docuno = "$docuno-$number";
                }

                info($docuno);

                $pos_db->table('gold_exchange.point_exchange_doc')->insert([
                    // 'point_exchange_doc_id' => $pos_db->table('gold_exchange.point_exchange_doc')->max('point_exchange_doc_id') + 1,
                    'point_exchange_doc_no' => $docuno,
                    'point_exchange_doc_empcode' => $supplier_code,
                    'point_exchange_doc_branch' => $member_info->branch_code,
                    'point_exchange_doc_idcard' => $member_info->identification_card,
                    'point_exchange_doc_customer_code' => $member_info->customer_barcode,
                    'point_exchange_doc_customer_fullname' => $member_info->fullname,
                    'point_exchange_doc_promotion_id' => $promotion_info->point_exchange_promotion_id,
                    'point_exchange_doc_pointwant' => $points / $request->qty,
                    'point_exchange_doc_less_points' => $points / $request->qty,
                    'point_exchange_doc_money_pro' => 1,
                    'point_exchange_doc_moneyreceive' => 0,
                    'point_exchange_doc_cashchange' => 0,
                    'point_exchange_doc_money_total' => 0,
                    'point_exchange_doc_before_point' => $balance_points,
                    'point_exchange_doc_after_point' => $balance_points - $points, 
                    'point_exchange_doc_barcode' => $promotion_info->point_exchange_promotion_item_barcode,
                    'point_exchange_doc_productname' => $promotion_info->point_exchange_promotion_item_goodname,
                    'point_exchange_doc_promotion_item_id' => $promotion_info->point_exchange_promotion_item_id,
                    'copon_barcode' => $coupon_barcode,
                    'point_exchange_doc_pdf_active' => false,
                    'point_exchange_doc_pdf_part' => '',
                    'point_exchange_doc_trycus' => '',
                    'app_name' => '1.0.0.122'
                ]);

                $cloud_db->table('imember_pay.imember_score_pay')->insert([
                    // 'imember_score_pay_id' => $cloud_db->table('imember_pay.imember_score_pay')->max('imember_score_pay_id') + 1,
                    'identification' => $member_info->identification_card,
                    'cuscode' => $member_info->customer_barcode,
                    'score_pay' => $points / $request->qty,
                    'pay_active' => true,
                    'exc_rate' => 100,
                    'empl_code' => $supplier_code,
                    "cus_name" => $member_info->fullname,
                    "date_now" => now(),
                    "emp_name" => Auth::user()->name,
                    "fix_sale_code" => $branch_short_name . rand(10, 99),
                    'ip_address' => request()->ip(),
                    'member_extra' => false,
                    'appversion' => '3.0.0.342',
                    'branchcode' => $member_info->branch_code,
                    'branchname' => $branch_info->branch_name,
                    'promotion_no' => $promotion_info->point_exchange_promotion_no,
                    'promotion_name' => $promotion_info->point_exchange_promotion_item_goodname,
                ]);

                $balance_points -= $points;

            }

            DB::commit();
            $cloud_db->commit();
            $pos_db->commit();

            return sendResponse(null, 200, "Points redeemed successfully");

        } catch (\Exception $e) {

            DB::rollBack();
            $cloud_db->rollBack();
            $pos_db->rollBack();

            info($e->getMessage());

            return sendResponse(null, 400, 'Something went wrong!, please try again');
        }

    }

    private function generateNewDocNo($branch_short_name)
    {

        return "$branch_short_name-POINTEX-" . Carbon::now()->format('ymd') . "-0001";

    }

    private function generateCouponBarcode($branch_short_name)
    {
        $randomNumber = rand(10000000, 99999999);
        $randomCapitalChar = chr(rand(65, 90));
        $randomNumber2 = rand(10000, 99999);

        return "B" . $branch_short_name . $randomNumber . $randomCapitalChar . $randomNumber2;
    }

}
