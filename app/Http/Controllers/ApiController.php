<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\ProjectService;
use App\Services\TaskService;
use App\Services\TicketService;
use App\Services\UserService;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    protected $ProjectService;
    protected $UserService;
    protected $TaskService;
    protected $TicketService;

    public function __construct(
        TaskService $TaskService,
        UserService $UserService,
        ProjectService $ProjectService,
        TicketService $TicketService,
    ) {
        $this->TaskService = $TaskService;
        $this->UserService = $UserService;
        $this->ProjectService = $ProjectService;
        $this->TicketService = $TicketService;
    }

    public function user_profile(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'status' => 'Success',
            'message'=> 'User Profile Retrieved',
            'data' => [
                'user' => [
                    'id' => $user->user_id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
            ],
        ]);
    }

    public function projects(Request $request)
    {
        $response = $this->UserService->projectsUser($request);

        if (!$response) {
            return response()->json([
                'status' => 'Error',
                'message' => 'User not found',
                'data' => []
            ], 404);
        }

        $projects = collect($response->task)->pluck('project')->filter()->unique('project_id')->values();

        return response()->json([
            'status'  => 'Success',
            'message' => 'Projects Retrieved',
            'data'    => $response,
        ]);
    }

    public function tickets($id)
    {
        $response = $this->UserService->TicketUser($id);

        if (!$response) {
            return response()->json([
                'status' => 'Error',
                'message' => 'User not found',
                'data' => []
            ], 404);
        }

        $projects = collect($response->task)->pluck('project')->filter()->values();
        $tickets = $projects->pluck('ticket')->flatten(1)->unique('ticket_id')->values();

        return response()->json([
            'status' => 'Success',
            'message'=> 'Tickets Retrieved',
            'data' => $tickets,
        ]);
    }

    public function start_track(Request $request){
        $result = $this->TicketService->start_ticket($request);
        
        if ($result[0] === 'Success') {
            return response()->json([
                'status' => 'Success',
                'message'=> $result[1],
            ]);
        }

        return response()->json([
            'status' => 'Failed',
            'message'=> $result[1],
        ]);
    }

    public function stop_track(Request $request){
        $result = $this->TicketService->stop_ticket($request);
        
        if ($result[0] === 'Success') {
            return response()->json([
                'status' => 'Success',
                'message'=> $result[1],
            ]);
        }

        return response()->json([
            'status' => 'Failed',
            'message'=> $result[1],
        ]);
    }

    public function track_log(Request $request){

    }
}
