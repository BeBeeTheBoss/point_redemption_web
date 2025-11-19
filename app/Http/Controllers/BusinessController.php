<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Business;
use Illuminate\Http\Request;
use App\Models\BusinessBranch;
use App\Models\UserNotification;
use App\Models\BusinessPromotion;

class BusinessController extends Controller
{
    public function __construct(protected Business $model)
    {
    }

    public function businessesPage()
    {

        $businesses = Business::with('admins')->with('branches', function ($query) {
            $query->with('users', function ($query) {
                $query->orderBy('id', 'asc');
            })->orderBy('id', 'asc');
        })->orderBy('id', 'desc')->get();

        return Inertia::render('Businesses/Index', [
            'businesses' => $businesses
        ]);
    }

    public function createPage()
    {

        $pos_db = getPosDBConnectionByBranchCode('MM-101');
        $promotions = $pos_db->table('gold_exchange.point_exchange_promotion')
            ->whereRaw('? BETWEEN point_exchange_promotion_datestart AND point_exchange_promotion_dateend', [now()])
            ->get();

        return Inertia::render('Businesses/Create', [
            'promotions' => $promotions
        ]);
    }

    public function store(Request $request)
    {

        $request->validate([
            'name' => 'required',
            'campaign_start_date' => 'required',
            'campaign_end_date' => 'required'
        ]);

        $business = new Business();
        $business->name = $request->name;
        $business->short_name = $request->short_name;
        $business->campaign_start_date = Carbon::parse($request->campaign_start_date)->addDay();
        $business->campaign_end_date = Carbon::parse($request->campaign_end_date)->addDay();
        $business->save();

        if (isset($request->promotions) && count($request->promotions) > 0) {
            foreach ($request->promotions as $promotion) {
                BusinessPromotion::create([
                    'business_id' => $business->id,
                    'promotion_code' => $promotion
                ]);
            }
        }

        return redirect()->route('businessesPage')->with('success', 'Business created successfully');

    }

    public function editPage($id)
    {

        $pos_db = getPosDBConnectionByBranchCode('MM-101');
        $promotions = $pos_db->table('gold_exchange.point_exchange_promotion')
            ->whereRaw('? BETWEEN point_exchange_promotion_datestart AND point_exchange_promotion_dateend', [now()])
            ->get();
        info($id);
        $business = Business::find($id);
        $business_promotions = BusinessPromotion::where('business_id', $business->id)->pluck('promotion_code');
        $business->promotions = $business_promotions;
        return Inertia::render('Businesses/Edit', [
            'business' => $business,
            'promotions' => $promotions
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required',
            'name' => 'required',
            'campaign_start_date' => 'required',
            'campaign_end_date' => 'required'
        ]);

        $business = $this->model->find($request->id);
        $business->name = $request->name;
        $business->short_name = $request->short_name;
        $business->campaign_start_date = Carbon::parse($request->campaign_start_date)->addDay();
        $business->campaign_end_date = Carbon::parse($request->campaign_end_date)->addDay();
        $business->save();

        BusinessPromotion::where('business_id', $business->id)->delete();

        if (isset($request->promotions) && count($request->promotions) > 0) {
            foreach ($request->promotions as $promotion) {
                BusinessPromotion::create([
                    'business_id' => $business->id,
                    'promotion_code' => $promotion
                ]);
            }
        }

        return redirect()->route('businessesPage')->with('success', 'Business updated successfully');
    }

    public function toggleBusiness(Request $request)
    {
        $business = $this->model->find($request->id);

        $business->is_active = !$business->is_active;
        $business->save();

        return back();

    }

    public function destroy(Request $request)
    {

        $business = Business::find($request->id);
        $branches = BusinessBranch::where('business_id', $business->id)->get();
        BusinessPromotion::where('business_id', $business->id)->delete();
        foreach ($branches as $branch) {
            $users = User::where('branch_id', $branch->id)->get();
            foreach ($users as $user) {
                UserNotification::where('user_id', $user->id)->delete();
                $user->delete();
            }
            $branch->delete();
        }
        $business->delete();

        return back()->with('success', 'Business deleted successfully');
    }

}
