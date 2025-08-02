<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    public function loginPage(Request $request)
    {

        if (Auth::check()) {
            return redirect()->route('historiesPage');
        }

        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return back()->withErrors('Please check your email');
        }

        if (!Hash::check($request->password, $user->password)) {
            return back()->withErrors('Please check your password');
        }

        Auth::loginUsingId($user->id);

        return redirect()->route('historiesPage');
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('loginPage');
    }

}
