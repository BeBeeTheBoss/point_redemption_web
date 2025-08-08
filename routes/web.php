<?php

use App\Http\Controllers\Api\BusinessBranchController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\BusinessController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\NotificationController;

Route::redirect('/', '/login');

Route::get('/login',[AuthController::class,'loginPage'])->name('loginPage');
Route::post('/login',[AuthController::class,'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout',[AuthController::class,'logout'])->name('logout');

    Route::group(['prefix' => 'histories', 'controller' => HistoryController::class],function(){
        Route::get('/','historiesPage')->name('historiesPage');
    });

    Route::group(['prefix' => 'users', 'controller' => UserController::class],function(){
        Route::post('/','store')->name('create');
        Route::delete('/','destroy')->name('delete');
        Route::post('/update','update')->name('update');
    });

    Route::group(['prefix' => 'notifications', 'controller' => NotificationController::class],function(){
        Route::get('/','notificationsPage')->name('notificationsPage');
        Route::get('/create','createPage')->name('createPage');
        Route::post('/create','store')->name('store');
        Route::get('/edit/{id?}','editPage')->name('editPage');
        Route::post('/update', 'update')->name('update');
        Route::delete('/','destroy')->name('delete');
    });

    Route::group(['prefix' => 'businesses', 'controller' => BusinessController::class],function(){
        Route::get('/','businessesPage')->name('businessesPage');
        Route::get('/create','createPage')->name('createPage');
        Route::post('/','store')->name('create');
        Route::get('/edit/{id?}','editPage')->name('editPage');
        Route::post('/toggle', 'toggleBusiness')->name('toggleBusiness');
        Route::post('/update','update')->name('update');
        Route::delete('/','destroy')->name('delete');
    });

    Route::group(['prefix' => 'branches', 'controller' => BusinessBranchController::class],function(){
        Route::post('/','store')->name('createBranch');
    });

});
