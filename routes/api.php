<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\HistoryController;
use App\Http\Controllers\Api\NotificationController;

Route::post('/login',[AuthController::class,'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',[AuthController::class,'logout'])->name('logout');

    Route::group(['prefix' => 'users', 'controller' => UserController::class],function(){
        Route::get('/{id?}', 'index');
        Route::post('/update', 'update');
        Route::post('/change-password', 'changePassword');
        Route::post('/set-push-noti-token', 'setPushNotiToken');
    });

    Route::post('/redeem-points', [UserController::class, 'redeemPoints']);

    Route::group(['prefix' => 'notifications', 'controller' => NotificationController::class],function(){
        Route::get('/{id?}', 'index');
        Route::post('/', 'store');
        Route::post('/update', 'update');
        Route::delete('/', 'destroy');
        Route::post('/mark-as-read', 'markAsRead');
        Route::post('/mark-all-as-read', 'markAllAsRead');
    });

    Route::group(['prefix' => 'histories','controller' => HistoryController::class],function(){
        Route::get('/', 'index');
        Route::get('/{id?}', 'show');
    });

});
