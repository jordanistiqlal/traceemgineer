<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\ProjectService;
use App\Services\TaskService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    protected $TaskService;
    protected $UserService;
    protected $ProjectService;

    public function __construct(
        TaskService $TaskService,
        UserService $UserService,
        ProjectService $ProjectService,
    ) {
        $this->TaskService = $TaskService;
        $this->UserService = $UserService;
        $this->ProjectService = $ProjectService;
    }
    public function index(Request $request): Response
    {
        $response = $this->TaskService->index($request);
        
        $user = $this->UserService->index((clone $request)->merge(['role' => 'ENGINEER']));
        $engineers = $user->map(function ($item) {
            return ['value' => $item->user_id, 'label' => $item->username];
        });

        $project = $this->ProjectService->index($request);
        $projects = $project->map(function ($item) {
            return ['value' => $item->project_id, 'label' => $item->project_name, 'type'=> $item->project_type];
        });

        return Inertia::render('Master/Task', [
            'response' => [
                'data' => $response,
                'engineers' => $engineers,
                'projects' => $projects,
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
        $result = $this->TaskService->store($request);
        
        if ($result[0] === 'Success') {
            return back()->with('success', $result[1]);
        }
        return back()->withErrors($result[1]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $response = $this->TaskService->show($id);
        return response()->json($response);
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
        $result = $this->TaskService->update($request, $id);
        
        if ($result[0] === 'Success') {
            return back()->with('success', $result[1]);
        } 

        return back()->withErrors($result[1]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $result = $this->TaskService->destroy($id);
        
        if ($result[0] === 'Success') {
            return back()->with('success', $result[1]);
        }

        return back()->withErrors($result[1]);
    }
}
