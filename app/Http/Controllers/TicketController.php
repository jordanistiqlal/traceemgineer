<?php

namespace App\Http\Controllers;

use App\Services\ProjectService;
use App\Services\TicketService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    protected $TicketService;
    protected $ProjectService;

    public function __construct(
        TicketService $TicketService,
        ProjectService $ProjectService,
    ) {
        $this->TicketService = $TicketService;
                $this->ProjectService = $ProjectService;
    }

    public function index(Request $request): Response
    {
        $response = $this->TicketService->index($request);

        $request['project_type'] = 'MAINTENANCE';
        $project = $this->ProjectService->index($request);
        $projects = $project->map(function ($item) {
            return ['value' => $item->project_id, 'label' => $item->project_name];
        });

        return Inertia::render('Master/Ticket', [
            'response' => [
                'data' => $response,
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
        $result = $this->TicketService->store($request);
        
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
        $response = $this->TicketService->show($id);
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
        $result = $this->TicketService->update($request, $id);
        
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
        $result = $this->TicketService->destroy($id);
        
        if ($result[0] === 'Success') {
            return back()->with('success', $result[1]);
        }

        return back()->withErrors($result[1]);
    }
}
