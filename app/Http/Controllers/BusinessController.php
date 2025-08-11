<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Business;
use Illuminate\Http\Request;

class BusinessController extends Controller
{
    public function __construct(protected Business $model){}

    public function businessesPage(){

        $businesses = Business::with('admins')->with('branches',function($query){
            $query->with('users',function($query){
                $query->orderBy('id', 'asc');
            })->orderBy('id', 'asc');
        })->orderBy('id', 'desc')->get();

        return Inertia::render('Businesses/Index',[
            'businesses' => $businesses
        ]);
    }

    public function createPage(){

        return Inertia::render('Businesses/Create');
    }

    public function store(Request $request){

        $request->validate([
            'name' => 'required',
            'campaign_start_date' => 'required',
            'short_name' => 'required',
            'campaign_end_date' => 'required'
        ]);

        $business = new Business();
        $business->name = $request->name;
        $business->short_name = $request->short_name;
        $business->campaign_start_date = Carbon::parse($request->campaign_start_date)->addDay();
        $business->campaign_end_date = Carbon::parse($request->campaign_end_date)->addDay();
        $business->save();

        return redirect()->route('businessesPage')->with('success', 'Business created successfully');

    }

    public function editPage($id){

        $business = Business::find($id);
        return Inertia::render('Businesses/Edit', [
            'business' => $business
        ]);
    }

    public function update(Request $request){
        $request->validate([
            'id' => 'required',
            'name' => 'required',
            'short_name' => 'required',
            'campaign_start_date' => 'required',
            'campaign_end_date' => 'required'
        ]);

        $business = $this->model->find($request->id);
        $business->name = $request->name;
        $business->short_name = $request->short_name;
        $business->campaign_start_date = Carbon::parse($request->campaign_start_date)->addDay();
        $business->campaign_end_date = Carbon::parse($request->campaign_end_date)->addDay();
        $business->save();

        return redirect()->route('businessesPage')->with('success', 'Business updated successfully');
    }

    public function toggleBusiness(Request $request){
        $business = $this->model->find($request->id);

        $business->is_active = !$business->is_active;
        $business->save();

        return back();

    }

    public function destroy(Request $request){

        $business = Business::find($request->id);
        User::where('business_id', $business->id)->delete();
        $business->delete();

        return back()->with('success', 'Business deleted successfully');
    }

}
