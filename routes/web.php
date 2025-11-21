<?php

use App\Http\Controllers\ApiController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EngineerController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InstalasiController;
use App\Http\Controllers\MaintananceController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\UserController;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'login_index'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');
});

// middleware
// Route::middleware('auth:sanctum','verified')->prefix('')->group(function () {
Route::middleware('auth')->prefix('')->group(function () {
    Route::get('/', [HomeController::class, 'dashboard'])->name('dashboard');
    Route::get('/track', function () {return Inertia::render('Track');});
    
    // Project
    Route::prefix('project')->group(function () {
        Route::resource('/instalasi', InstalasiController::class);
        Route::resource('/maintanance', MaintananceController::class);
    });

    Route::resource('/engineer', EngineerController::class);
    
    // Master Data
    Route::prefix('masterdata')->group(function () {
        Route::resource('/user', UserController::class);
        Route::resource('/project', ProjectController::class);
        Route::resource('/ticket', TicketController::class);
        Route::resource('/task', TaskController::class);
    });

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

// API Routes
Route::prefix('api')->group(function () {
    Route::post('/login', [AuthController::class, 'jwt_login']);
    Route::post('/refresh-token', [AuthController::class, 'refresh_token']);

    Route::middleware('auth:api')->group(function () {
        Route::get('/user-profile', [ApiController::class, 'user_profile']);
        Route::get('/projects', [ApiController::class, 'projects']);
        // Route::get('/tickets/{id}', [ApiController::class, 'tickets']);

        Route::post('/start-tracking', [ApiController::class, 'start_track']);
        Route::post('/stop-tracking', [ApiController::class, 'stop_track']);

        Route::post('/location', [ApiController::class, 'track_log']);

        Route::post('/logout', [AuthController::class, 'logout_api']);
    });
});