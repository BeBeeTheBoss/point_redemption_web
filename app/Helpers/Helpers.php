<?php

if(!function_exists('sendResponse')) {
    function sendResponse($data, $status,$message = "No message") {
        return response()->json([
            'data' => $data,
            'status' => $status,
            'message' => $message
        ]);
    }
}
