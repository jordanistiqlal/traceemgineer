<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\ProjectService;
use App\Services\TaskService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EngineerController extends Controller
{
    protected $UserService;
    protected $TaskService;
    protected $TicketService;
    protected $ProjectService;

    public function __construct(
        UserService $UserService, 
        TaskService $TaskService,
        ProjectService $ProjectService,
    ) {
        $this->UserService = $UserService;
        $this->TaskService = $TaskService;
        $this->ProjectService = $ProjectService;
        // $this->TicketService = $TicketService;
    }

    public function index(Request $request)
    {
        // $userrequest = clone $request;
        // $taskrequest = clone $request;

        // $userrequest['role'] = 'ENGINEER';
        // $taskrequest['status'] = 'Active';

        // $users = $this->UserService->index($userrequest);
        $users = $this->UserService->index((clone $request)->merge(['role' => 'ENGINEER']));
        $tasks = $this->TaskService->index($request);

        $engineers = $users->map(function ($item) {
            return ['value' => $item->user_id, 'label' => $item->username];
        });

        $project = $this->ProjectService->index($request);
        $projects = $project->map(function ($item) {
            return ['value' => $item->project_id, 'label' => $item->project_name];
        });

        return Inertia::render('Engineer', [
            'response' => [
                'engineers' => $users,
                'tasks' => $tasks,
                'selection' => [
                    'engineers' => $engineers,
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
