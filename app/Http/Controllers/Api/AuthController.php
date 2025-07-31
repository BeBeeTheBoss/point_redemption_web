<?php

namespace App\Http\Controllers\Api;

use Hash;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request){

        $user = User::where('email',$request->email)->first();
        if(!$user){
            return sendResponse(null,404,"Please check your email");
        }

        if(!Hash::check($request->password,$user->password)){
            return sendResponse(null,401,"Please check your password");
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
