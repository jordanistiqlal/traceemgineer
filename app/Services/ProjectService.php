<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Task;
use App\Models\Ticket;
use App\Models\Track_log;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Class ProjectService.
 */
class ProjectService
{
    public function index($request)
    {
        $query = Project::query();
        
        if ($request->has('project_name') && !empty($request->project_name)) {
            $query->where('project_name', $request->project_name);
        }
        
        if ($request->has('project_type') && !empty($request->project_type)) {
            $query->where('project_type', 'like', '%' . $request->project_type . '%');
        }
        
        if ($request->has('sort_by')) {
            $query->orderBy($request->sort_by, $request->get('sort_dir', 'asc'));
        }
        
        return $query->get();
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {
            $request->validate([
                'nama_project' => ['required','string','max:128'],
                'tipe' => ['required','string','max:64'],
                // 'engineer' => ['required','string'],
                // 'task' => ['required','string'],
                // 'ticket' => ['required','string'],
            ]);

            $data = [
                'project_name' => $request->nama_project,
                'project_type' => $request->tipe,
                // 'user_id' => $request->engineer,
                // 'task_id' => $request->task,
                // 'ticket_id' => $request->ticket,
            ];

            Project::create($data);
            DB::commit();

            return ['Success', 'Project created successfully'];

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
                'nama_project' => ['required','string','max:128'],
                'tipe' => ['required','string','max:64'],
                // 'user_id' => ['required','string'],
                // 'task_id' => ['required','string'],
                // 'ticket_id' => ['required','string'],
            ]);
    
            $update = [
                'project_name' => $request->nama_project,
                'project_type' => $request->tipe,
                // 'user_id' => $request->user_id,
                // 'task_id' => $request->task_id,
                // 'ticket_id' => $request->ticket_id,
            ];
    
            Project::where('project_id',$id)->update($update); 
            DB::commit();
    
            return ['Success', 'Project Updated'];
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
            Project::where('project_id', $id)->delete();
            DB::commit();
            return ['Success', 'Project Deleted'];
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
            $message = '';

            $update_time = [
                'start_time' => $now
            ];

            if($request->ticket_id){
                $message = "Ticket";
                Ticket::where('ticket_id',$request->ticket_id)->update($update_time);
            }
            
            if($request->task_id){
                $message = "Task";
                Task::where('task_id',$request->task_id)->update($update_time);
            }

            $this->location_track($request);

            DB::commit();
            return ['Success', $message.' Start'];
        } catch (ValidationException $e) {
            DB::rollBack();
            return ['Validation Error', $e->errors()];
        } catch (Exception $error) {
            DB::rollBack();
            return ['Failed', $error->getMessage()];
        }
    }

    public function stop_ticket($request){
        DB::beginTransaction();
        try {
            // update start colom di ticket
            $now = Carbon::now();
            $message = '';

            $update_time = [
                'end_time' => $now
            ];

            if($request->ticket_id){
                $message = "Ticket";
                $ticket = Ticket::where('ticket_id',$request->ticket_id);
                $ticketGet = $ticket->first();

                if(!$ticketGet->start_time){
                    return ['Error','Ticket not started yet'];
                }

                $ticket->update($update_time);
            }
            
            if($request->task_id){
                $message = "Task";
                $task = Task::where('task_id',$request->task_id);
                $taskGet = $task->first();
                if(!$taskGet->start_time){
                    return ['Error','Task not started yet'];
                }

                $task->update($update_time);
            }

            $this->location_track($request);

            DB::commit();
            return ['Success', $message.' End'];
        } catch (ValidationException $e) {
            DB::rollBack();
            return ['Validation Error', $e->errors()];
        } catch (Exception $error) {
            DB::rollBack();
            return ['Failed', $error->getMessage()];
        }
    }

    public function track_log($request){
        DB::beginTransaction();
        try {
            $this->location_track($request);
            DB::commit();
            return ['Success', 'Log Location Recorded'];
        } catch (ValidationException $e) {
            DB::rollBack();
            return ['Validation Error', $e->errors()];
        } catch (Exception $error) {
            DB::rollBack();
            return ['Failed', $error->getMessage()];
        }
    }

    private function location_track($request){
        $now = Carbon::now();

        if($request->location){
            $localtion = explode(", ",$request->location);
            $latitude = $localtion[0];
            $longitude = $localtion[1];
        }

        $data_track = [
            "latitude" => $latitude,
            "longitude" => $longitude,
            "is_mock" => $request->is_mock,
            "timestamp" => $now,
            "user_id" => auth('api')->id()
        ];

        if($request->ticket_id){
            $ticket = Ticket::where('ticket_id',$request->ticket_id);
            $ticket = $ticket->first();

            $project = Project::where('project_id', $ticket->project_id)->first();
            $data_track['ticket_id'] = $request->ticket_id;
        }
        
        if($request->task_id){
            $task = Task::where('task_id',$request->task_id);
            $task = $task->first();
            
            $project = Project::where('project_id', $task->project_id)->first();
            $data_track['task_id'] = $request->task_id;
        }

        $data_track['type'] = $project->project_type;

        Track_log::create($data_track);

        return true;
    }
}
