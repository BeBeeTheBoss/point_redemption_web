<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function __construct(protected User $model){}

    public function store(Request $request){

        $request->validate([
            'name' => 'required',
            'email' => 'required',
            'password' => 'required',
        ]);

        $this->model->create($request->all());

        return redirect()->route('businessesPage')->with('success', 'User added');
    }

    public function destroy(Request $request){

        $user = $this->model->find($request->id);
        $user->delete();

        return redirect()->route('businessesPage')->with('success', 'User deleted');
    }

    public function update(Request $request){

        $request->validate([
            'name' => 'required',
            'email' => 'required'
        ]);

        $user = $this->model->find($request->id);
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = $request->password ? Hash::make($request->password) : $user->password;
        $user->save();

        return redirect()->route('businessesPage')->with('success', 'User updated');

    }

}
