<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserNotification;
use Illuminate\Http\Request;
use App\Models\BusinessBranch;
use App\Http\Controllers\Controller;

class BusinessBranchController extends Controller
{
    public function __construct(protected BusinessBranch $model){}

    public function store(Request $request){

        $request->validate([
            'name' => 'required',
            'address' => 'required',
        ]);

        $this->model->create($request->all());

        return redirect()->route('businessesPage')->with('success', 'Branch created successfully');
    }

    public function update(Request $request){

        $request->validate([
            'name' => 'required',
            'address' => 'required',
        ]);

        $branch = $this->model->find($request->id);
        $branch->name = $request->name;
        $branch->address = $request->address;
        $branch->save();

        return redirect()->route('businessesPage')->with('success', 'Branch updated');

    }

    public function destroy(Request $request){

        $branch = BusinessBranch::find($request->id);

        if (!$branch) {
            return back()->withErrors('Branch already deleted');
        }

        $users = User::where('branch_id', $branch->id)->get();
        foreach($users as $user){
            UserNotification::where('user_id', $user->id)->delete();
            $user->delete();
        }

        $branch->delete();
    }

}
