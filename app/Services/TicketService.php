<?php

namespace App\Services;

use App\Models\Ticket;

/**
 * Class TicketService.
 */
class TicketService
{
    public function index($request)
    {
        $query = Ticket::query();
        
        if ($request->has('ticket_site') && !empty($request->ticket_site)) {
            $query->where('ticket_site', $request->ticket_site);
        }
        
        if ($request->has('ticket_problem') && !empty($request->ticket_problem)) {
            $query->where('ticket_problem', 'like', '%' . $request->ticket_problem . '%');
        }
        
        if ($request->has('ticket_jam') && !empty($request->ticket_jam)) {
            $query->where('ticket_jam', 'like', '%' . $request->ticket_jam . '%');
        }

        if ($request->has('ticket_from') && !empty($request->ticket_from)) {
            $query->where('ticket_from', 'like', '%' . $request->ticket_from . '%');
        }
 
        if ($request->has('bodyraw') && !empty($request->bodyraw)) {
            $query->where('bodyraw', 'like', '%' . $request->bodyraw . '%');
        }       
 
        if ($request->has('bodyraw') && !empty($request->bodyraw)) {
            $query->where('bodyraw', 'like', '%' . $request->bodyraw . '%');
        }
        
        if ($request->has('sort_by')) {
            $query->orderBy($request->sort_by, $request->get('sort_dir', 'asc'));
        }
        
        return $query->get();
    }
}
