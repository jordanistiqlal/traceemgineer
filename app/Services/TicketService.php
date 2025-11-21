<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Ticket;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Class TicketService.
 */
class TicketService
{
    public function index($request)
    {
        $query = Ticket::with(['project']);
        
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

    public function show($id)
    {
        return Project::with([
            'ticket' => function ($q) {
                $q->select('ticket_id', 'project_id', 'ticket_site', 'ticket_tanggal', 'ticket_jam', 'ticket_from', 'ticket_problem', 'bodyraw');
            }, 
            'ticket.user'=> function ($q) {
                $q->select('user_id', 'name', 'nohp', 'email');
            }
        ])
        ->where('project_id', $id)->first();
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {
            $request->validate([
                'site' => ['required','string','max:128'],
                'tanggal' => ['required','string','max:64'],
                'jam' => ['required','string'],
                'created' => ['required','string'],
                'problem' => ['required','string'],
                'project' => ['required','string'],
                'bodyraw' => ['required','string'],
            ]);

            $data = [
                'ticket_site' => $request->site,
                'ticket_tanggal' => $request->tanggal,
                'ticket_jam' => $request->jam,
                'ticket_from' => $request->created,
                'ticket_problem' => $request->problem,
                'bodyraw' => $request->bodyraw,
                'project_id' => $request->project,
            ];

            Ticket::create($data);
            DB::commit();

            return ['Success', 'Ticket created successfully'];

        } catch (ValidationException $e) {
            DB::rollBack();
            return ['Validation Error', $e->errors()];
        } catch (Exception $error) {
            DB::rollBack();
            return ['Error', $error->getMessage()];
        }
    }
    public function update($request, $id)
    {
        DB::beginTransaction();
        try {
            $request->validate([
                'site' => ['required','string','max:128'],
                'tanggal' => ['required','string','max:64'],
                'jam' => ['required','string'],
                'created' => ['required','string'],
                'problem' => ['required','string'],
                'project' => ['required','string'],
                'bodyraw' => ['required','string'],
            ]);
    
            $update = [
                'ticket_site' => $request->site,
                'ticket_tanggal' => $request->tanggal,
                'ticket_problem' => $request->problem,
                'ticket_jam' => $request->jam,
                'ticket_from' => $request->created,
                'bodyraw' => $request->bodyraw,
                'project_id' => $request->project,
            ];
    
            Ticket::where('ticket_id',$id)->update($update); 
            DB::commit();
    
            return ['Success', 'User Updated'];
        } catch (ValidationException $e) {
            DB::rollBack();
            return ['Validation Error', $e->errors()];
        } catch (Exception $error) {
            DB::rollBack();
            return ['Failed', $error->getMessage()];
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            Ticket::where('ticket_id', $id)->delete();
            DB::commit();
            return ['Success', 'Ticket Deleted'];
        } 
        catch (Exception $error) {
            DB::rollBack();
            return ['Failed', $error->getMessage()];
        }
    }

    public function start_ticket($request){
        DB::beginTransaction();
        try {
            // update start colom di ticket
            $now = Carbon::now();

            $update_time = [
                'start_time' => $now
            ];

            Ticket::where('ticket_id',$request->ticket_id)->update($update_time);

            // mulai new data track (kyknya data track dipisah aja karena ntar ada api yg di tembak 5 menit sekali ke track)

            DB::commit();
            return ['Success', 'Tickets Start'];
        } catch (ValidationException $e) {
            DB::rollBack();
            return ['Validation Error', $e->errors()];
        } catch (Exception $error) {
            DB::rollBack();
            return ['Failed', $error->getMessage()];
        }
    }

    public function stop_ticket($request){
        
    }
}
