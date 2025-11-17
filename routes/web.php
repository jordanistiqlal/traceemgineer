<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EngineerController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\UserController;
use App\Models\Project;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;




Route::get('/login', [AuthController::class, 'login_index'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');


// middleware
Route::middleware('auth:sanctum','verified')->prefix('')->group(function () {
    Route::get('/', function () {return Inertia::render('Home');})->name('dashboard');
    Route::get('/track', function () {return Inertia::render('Track');});
    
    Route::resource('/engineer', EngineerController::class);
    
    Route::resource('/user', UserController::class);
    
    // Project
    Route::prefix('project')->group(function () {
        Route::get('/instalasi', function () {return Inertia::render('Project/Instalasi');});
        Route::get('/maintanance', function () {return Inertia::render('Project/Maintanance');});
    });
    
    // Master Data
    Route::prefix('masterdata')->group(function () {
        Route::resource('/user', UserController::class);
        Route::resource('/project', ProjectController::class);
        Route::get('/ticket', function () {return Inertia::render('Master/Ticket');});
        Route::get('/task', function () {return Inertia::render('Master/Task');});
    });
});


Route::prefix('api')->group(function () {
    Route::post('/login', [AuthController::class, 'jwt_login']);
    Route::post('/refresh-token', [AuthController::class, 'refresh_token']);
    Route::post('/logout', [AuthController::class, 'logout_api']);
});

