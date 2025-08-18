<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\History;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\HistoryResource;
use App\Http\Resources\HistoryDetailResource;

class HistoryController extends Controller
{
    public function __construct(protected History $model)
    {
    }

    public function index(Request $request)
    {

        if ($request->from == 'search' && $request->searchKey == null) {
            return sendResponse([], 200);
        }

        $searchKey = $request->searchKey;
        $filterBy = $request->filterBy;
        $auth_user_business_id = Auth::user()->role == 'admin' ? Auth::user()->business->id : Auth::user()->branch->business->id;

        $histories = $this->model->where('business_id', $auth_user_business_id)->orderBy('id', 'desc')->when($searchKey, function ($query) use ($searchKey) {
            $query->where(function ($query) use ($searchKey) {
                $query->whereRaw('LOWER(member_name) LIKE ?', ['%' . strtolower($searchKey) . '%'])
                    ->orWhereRaw('LOWER(promotion_name) LIKE ?', ['%' . strtolower($searchKey) . '%']);
            });
        })
        ->when($filterBy,function($query) use($filterBy){
            if($filterBy == 'This month'){
                $query->whereMonth('created_at', Carbon::now()->month);
            }else if($filterBy == 'This day'){
                $query->whereDay('created_at', Carbon::now()->day);
            }
        })
        ->get();

        return sendResponse(HistoryResource::collection($histories), 200);
    }

    public function show($id)
    {
        $history = $this->model->find($id);

        return sendResponse(new HistoryDetailResource($history), 200);

    }

}
