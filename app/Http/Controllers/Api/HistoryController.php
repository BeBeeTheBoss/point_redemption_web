<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\HistoryResource;
use App\Models\History;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class HistoryController extends Controller
{
    public function __construct(protected History $model){}

    public function index(){

        $histories = $this->model->orderBy('id','desc')->get();

        return sendResponse(HistoryResource::collection($histories), 200);
    }

}
