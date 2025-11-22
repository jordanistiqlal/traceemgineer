<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\ProjectService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaintananceController extends Controller
{
    protected $ProjectService;

    public function __construct(
        ProjectService $ProjectService,
    ) {
        $this->ProjectService = $ProjectService;
    }
    
    public function index(Request $request): Response
    {
        $request['project_type'] = 'MAINTENANCE';
        $project = $this->ProjectService->index($request);
        $projects = $project->map(function ($item) {
            return ['value' => $item->project_id, 'label' => $item->project_name];
        });

        return Inertia::render('Project/Maintanance', [
            'response' => [
                'projects' => $project,
                'selection' => [
                    'projects' => $projects,
                ],
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
