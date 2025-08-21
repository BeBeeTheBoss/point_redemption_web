<?php

namespace App\Http\Controllers\Api;

use App\Models\Business;
use App\Models\LoginDevice;
use Hash;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{

    public function getUser(Request $request){{
        info($request->toArray());
        $user = User::find($request->user_id);
        if(!$user){
            return sendResponse(null,404,"User not found");
        }

        $business_id = $user->role == 'admin' ? $user->business->id : $user->branch->business->id;

        $business = Business::find($business_id);

        if(!$business->is_active){
            return sendResponse(null,405,"Business is not active");
        }

        return sendResponse($user,200,"User found");

    }}

    public function login(Request $request){

        $user = User::where('email',$request->email)->first();
        if(!$user){
            return sendResponse(null,404,"Please check your email");
        }

        if(!Hash::check($request->password,$user->password)){
            return sendResponse(null,401,"Please check your password");
        }

        $business = $user->role == 'admin' ? $user->business : $user->branch->business;
        if(!$business->is_active){
            return sendResponse(null,405,"Campaign period is over");
        }

        if(!LoginDevice::where('user_id',$user->id)->where('device_id',$request->deviceId)->first()){
            $loginDevice = new LoginDevice();
            $loginDevice->user_id = $user->id;
            $loginDevice->device_id = $request->deviceId;
            $loginDevice->device_name = $request->deviceName;
            $loginDevice->save();
        }

        Auth::loginUsingId($user->id);
        $token = $user->createToken(env('APP_NAME').'_Token')->plainTextToken;

        $user['token'] = $token;

        return sendResponse($user,200,"Login successfully");

    }

    public function logout(Request $request){

        LoginDevice::where('user_id',Auth::user()->id)->where('device_id',$request->deviceId)->delete();

        $request->user()->currentAccessToken()->delete();
        info("Logged out");
        return sendResponse(null,200,"Logout successfully");
    }

}
