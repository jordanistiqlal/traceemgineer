<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\ProjectService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Request as FacadesRequest;
use Inertia\Response;
use Inertia\Inertia;

class InstalasiController extends Controller
{
    protected $ProjectService;

    public function __construct(
        ProjectService $ProjectService,
    ) {
        $this->ProjectService = $ProjectService;
    }

    public function index(FacadesRequest $request): Response
    {
        return Inertia::render('Project/Instalasi', [
            'response' => [
                'projects' => $this->ProjectService->index(new Request(['status' => 'INSTALASI'])),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
