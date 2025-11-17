<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthController extends Controller
{
    protected $authService;

    
    public function __construct(AuthService $service)
    {
        $this->authService = $service;
    }

    public function login_index(){
        return Inertia::render('Login');
    }

    public function login(Request $request)
    {
        $result = $this->authService->login($request);

        if ($result[0] === 'Success') {
            return redirect()->route('dashboard');
        }
        
        return back()->withErrors($result[1]);
    }

    public function logout(Request $request)
    {
        $result = $this->authService->logout($request);

        if ($result[0] === 'Success') {
            return redirect()->route('login');
        }
        
        return back()->withErrors($result[1]);
    }

    public function jwt_login(Request $request)
    {
        return $this->authService->api_login($request);
    }

    public function refresh_token(Request $request)
    {
        return $this->authService->refresh_token($request);
    }

    public function logout_api(Request $request)
    {
        return $this->authService->api_logout($request);
    }
}
