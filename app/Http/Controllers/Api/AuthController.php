<?php

namespace App\Http\Controllers\Api;

use App\Models\Business;
use Hash;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{

    public function getUser(Request $request){{
        $user = User::find($request->userId);
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

        Auth::loginUsingId($user->id);
        $token = $user->createToken(env('APP_NAME').'_Token')->plainTextToken;

        $user['token'] = $token;

        return sendResponse($user,200,"Login successfully");

    }

    public function logout(Request $request){

        $request->user()->currentAccessToken()->delete();
        info("Logged out");
        return sendResponse(null,200,"Logout successfully");
    }

}
