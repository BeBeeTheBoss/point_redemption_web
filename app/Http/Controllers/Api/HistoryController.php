<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\History;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\HistoryResource;
use App\Http\Resources\HistoryDetailResource;

class HistoryController extends Controller
{
    public function __construct(protected History $model){}

    public function index(Request $request){

        if($request->from == 'search' && $request->searchKey == null){
            return sendResponse([], 200);
        }

        $searchKey = $request->searchKey;

        $histories = $this->model->orderBy('id','desc')->when($searchKey,function($query) use ($searchKey){
            $query->where(function ($query) use ($searchKey) {
                $query->whereRaw('LOWER(member_name) LIKE ?', ['%' . strtolower($searchKey) . '%'])
                      ->orWhereRaw('LOWER(promotion_name) LIKE ?', ['%' . strtolower($searchKey) . '%']);
            });
        })->get();

        return sendResponse(HistoryResource::collection($histories), 200);
    }

    public function show($id){
        $history = $this->model->find($id);

        return sendResponse(new HistoryDetailResource($history), 200);

    }

}
