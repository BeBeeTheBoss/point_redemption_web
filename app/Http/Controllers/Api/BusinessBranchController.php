<?php

namespace App\Http\Controllers\Api;

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

}
