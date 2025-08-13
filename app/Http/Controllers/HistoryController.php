<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\History;
use App\Models\Business;
use Illuminate\Http\Request;
use App\Http\Resources\HistoryDetailResource;

class HistoryController extends Controller
{
    public function __construct(protected History $model){}

    public function historiesPage(){

        $histories = History::orderBy('id', 'desc')->get();
        $pos_db = getPosDBConnectionByBranchCode('MM-101');

        $promotions_count = $pos_db->table('gold_exchange.point_exchange_promotion')
            ->whereRaw('? BETWEEN point_exchange_promotion_datestart AND point_exchange_promotion_dateend', [now()])
            ->count();

        return Inertia::render('Histories/Index',[
            'histories' => HistoryDetailResource::collection($histories),
            'promotions_count' => $promotions_count,
            'business_count' => Business::count()
        ]);
    }

}
