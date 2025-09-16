<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function __construct(protected User $model)
    {
    }

    public function store(Request $request)
    {

        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                'string',
                'min:8',             // must be at least 8 characters
                'regex:/[a-z]/i',  // must contain at least one lowercase letter
                'regex:/[A-Z]/i',  // must contain at least one uppercase letter
                'regex:/[0-9]/i',  // must contain at least one number
                'regex:/[^A-Za-z0-9]/i',  // must contain at least one special character
            ],
        ]);

        $this->model->create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'business_id' => $request->business_id ?? null,
            'branch_id' => $request->branch_id ?? null,
            'role' => $request->branch_id == null ? 'admin' : 'user'
        ]);

        return redirect()->route('businessesPage')->with('success', 'User added');
    }

    public function destroy(Request $request)
    {

        $user = $this->model->find($request->id);
        UserNotification::where('user_id', $user->id)->delete();
        $user->delete();

        return redirect()->route('businessesPage')->with('success', 'User deleted');
    }

    public function update(Request $request)
    {

        $request->validate([
            'name' => 'required',
            'email' => 'required',
            'password' => [
                Rule::when($request->password != null, [
                    'string',
                    'min:8',           // must be at least 8 characters
                    'regex:/[a-z]/i',  // must contain at least one lowercase letter
                    'regex:/[A-Z]/i',  // must contain at least one uppercase letter
                    'regex:/[0-9]/i',  // must contain at least one number
                    'regex:/[^A-Za-z0-9]/i',  // must contain at least one special character
                ])
            ],
        ]);

        $user = $this->model->find($request->id);
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = $request->password ? Hash::make($request->password) : $user->password;
        $user->save();

        return redirect()->route('businessesPage')->with('success', 'User updated');

    }

}
