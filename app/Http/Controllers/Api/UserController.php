<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\UserResource;
use App\Models\Business;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
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

        info(Hash::check("12345678",$user->password)?"true":"false");

        if (!Hash::check($request->oldPassword, $user->password)) {
            return sendResponse(null, 401, "Please check your old password");
        }

        $user->password = Hash::make($request->newPassword);
        $user->save();
        return sendResponse($user, 200, "Password changed successfully");

    }

    public function setPushNotiToken(Request $request)
    {
        $user = $this->model->find(Auth::user()->id);
        $user->push_noti_token = $request->token;
        $user->save();
        return sendResponse($user, 200, "Token set successfully");
    }

}
