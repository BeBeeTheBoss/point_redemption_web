<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\History;
use Illuminate\Http\Request;

class HistoryController extends Controller
{
    public function __construct(protected History $model){}

    public function historiesPage(){

        // $histories = History::with('business','branch')->all();
        return Inertia::render('Histories/Index');
    }

}
