<?php

namespace App\Http\Controllers;

use App\Services\ProjectService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    protected $ProjectService;
    protected $UserService;
    protected $TaskService;
    protected $TicketService;

    public function __construct(
        ProjectService $ProjectService, 
        UserService $UserService, 
    ) {
        $this->ProjectService = $ProjectService;
        $this->UserService = $UserService;
    }

    public function index(Request $request): Response
    {
        $response = $this->ProjectService->index($request);
        $user = $this->UserService->index((clone $request)->merge(['role' => 'ENGINEER']));
        $engineers = $user->map(function ($item) {
            return ['value' => $item->user_id, 'label' => $item->username];
        });
        

        return Inertia::render('Master/Project', [
            'response' => [
                'data' => $response,
                'engineers' => $engineers,
                'tasks' => [],
                'tickets' => [],
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $result = $this->ProjectService->store($request);
        
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
        $response = $this->ProjectService->show($id);
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
        $result = $this->ProjectService->update($request, $id);
        
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
        $result = $this->ProjectService->destroy($id);
        
        if ($result[0] === 'Success') {
            return back()->with('success', $result[1]);
        }

        return back()->withErrors($result[1]);
    }
}
