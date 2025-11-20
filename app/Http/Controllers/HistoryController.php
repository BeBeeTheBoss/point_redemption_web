<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\History;
use App\Models\Business;
use Illuminate\Http\Request;
use App\Http\Resources\HistoryDetailResource;

class HistoryController extends Controller
{
    public function __construct(protected History $model) {}

    public function historiesPage(Request $request)
    {

        $histories = History::when($request->month, function ($query) use ($request) {
            $query->whereMonth('created_at', $request->month)->whereYear('created_at', $request->year);
        })->orderBy('id', 'desc')->get();
        $pos_db = getPosDBConnectionByBranchCode('MM-101');

        $promotions_count = $pos_db->table('gold_exchange.point_exchange_promotion')
            ->whereRaw('? BETWEEN point_exchange_promotion_datestart AND point_exchange_promotion_dateend', [now()])
            ->count();

        return Inertia::render('Histories/Index', [
            'histories' => HistoryDetailResource::collection($histories),
            'promotions_count' => $promotions_count,
            'businesses' => Business::all(),
        ]);
    }

    public function filterHistories(Request $request)
    {
        $histories = History::when($request->month, function ($query) use ($request) {
            $query->whereMonth('created_at', $request->month)->whereYear('created_at', $request->year);
        })
        ->when($request->business != "null", function ($query) use ($request) {
            $query->where('business_id', $request->business);
        })
        ->orderBy('id', 'desc')->get();

        return sendResponse(HistoryDetailResource::collection($histories), 200);

    }

}
