<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Business;
use Illuminate\Http\Request;

class BusinessController extends Controller
{
    public function __construct(protected Business $model){}

    public function businessesPage(){
        return Inertia::render('Businesses/Index');
    }

}
