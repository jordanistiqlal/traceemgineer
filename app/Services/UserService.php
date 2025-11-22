<?php

namespace App\Services;

use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Class UserService.
 */
class UserService
{
    public function index($request)
    {
        $query = User::query();
        
        if ($request->has('role') && !empty($request->role)) {
            $query->where('role', $request->role);
        }
        
        if ($request->has('name') && !empty($request->name)) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }
        
        if ($request->has('email') && !empty($request->email)) {
            $query->where('email', 'like', '%' . $request->email . '%');
        }
        
        if ($request->has('from') && $request->has('to')) {
            $query->whereBetween('created_at', [$request->from, $request->to]);
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
                'name'      => ['required','string','max:128'],
                'nohp'      => ['required','string','max:128','unique:users'],
                'email'     => ['required','string','email','max:64','unique:users'],
                'password'  => ['required','string'],
                'role'      => ['required','string'],
            ]);
            $users = User::where('name', '=', $request->input('name'))->first();

            if (!$users){
                $data = [
                    'name'      => $request->name,
                    'username'  => Str::slug($request->username ?? $request->name),
                    'nohp'      => $request->nohp,
                    'email'     => $request->email,
                    'role'      => $request->role,
                    'password'  => Hash::make($request->password),
                ];

                User::create($data); 

                DB::commit();
                return ['Success', 'User Registered'];
            }

            return throw new \Exception('User Already Exists');
            
        }
        catch (ValidationException $e) {
            DB::rollBack();
            return ['Validation Error', $e->errors()];
        }
        catch(Exception $error)
        {
            DB::rollBack();
            return ['Error', $error->getMessage()];
        }
    }

    public function update($request,$id)
    {
        DB::beginTransaction();
        try {
            $request->validate([
                'name'      => ['required','string','max:128'],
                'username'  => ['required','string','max:128'],
                'nohp'      => ['required','string','max:128'],
                'email'     => ['required','string','email','max:64'],
            ]);

            $update = [
                'name'      => $request->name,
                'username'  => $request->username,
                'nohp'      => $request->nohp,
                'email'     => $request->email,
                // 'role'      => $request->role,
                // 'password'  => Hash::make($request->password),
            ];

            if(isset($request->password) && $request->password != ""){
                $update['password'] = Hash::make($request->password);
            }

            if(isset($request->role) && $request->role != ""){
                $update['role'] = $request->role;
            }

            User::where('user_id',$id)->update($update); 
            DB::commit();

            return ['Success', 'User Updated'];
        } 
        catch (ValidationException $e) {
            DB::rollBack();
            return ['Validation Error', $e->errors()];
        }
        catch (Exception $error) {
            DB::rollBack();
            return ['Failed', $error->getMessage()];
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            User::where('user_id', $id)->delete();
            DB::commit();
            return ['Success', 'User Deleted'];
        } 
        catch (Exception $error) {
            DB::rollBack();
            return ['Failed', $error->getMessage()];
        }
    }

    public function projectsUser($id){
        $user = User::with([
            'task' => function($query){
                $query->select('task_id','task_name','project_id','user_id','start_time','end_time')
                ->where('end_time', null);
            },
            'task.project:project_id,project_name,project_type',
            'task.project.ticket' => function ($query) {
                $query->select('ticket_id','project_id','ticket_site','ticket_tanggal','ticket_jam','ticket_from','ticket_problem','bodyraw','start_time','end_time')
                ->where('end_time', null);
            },
        ])
        ->select('user_id', 'name')
        ->where('user_id', $id)->first();

        if (!$user) {
            return null;
        }

        return $this->transformProjectsByType($user);
    }

    private function transformProjectsByType($user){
        $groupedProjects = [];
        $projectMap = [];

        foreach($user->task as $task){
            if (!$task->project) continue;

            $project = $task->project;
            $projectId = $project->project_id;
            $projectType = $project->project_type;

            // Inisiasi Project berdasarkan tipe, jika belum ada
            if(!isset($projectMap[$projectType])){
                $projectMap[$projectType] = [];
            }

            // Inisisasi project berdasarkan tipe berdasarkan tipe, jika sudah ada
            if(!isset($projectMap[$projectType][$projectId])){
                $projectMap[$projectType][$projectId] = [
                    'project_id' => $project->project_id,
                    'project_name' => $project->project_name
                ];

                // penambahan task/ticket ke project MAINTENANCE
                if($projectType === "MAINTENANCE"){
                    // $projectMap[$projectType][$projectId]['ticket'] = $project->ticket ?? [];
                    
                    $tickets = $project->ticket ?? [];
                    if($tickets){
                        foreach($tickets as $ticket){
                            $projectMap[$projectType][$projectId]['ticket'][] = [
                                'ticket_id' => $ticket->ticket_id,
                                'project_id' => $ticket->project_id,
                                'ticket_site' => $ticket->ticket_site,
                                'ticket_tanggal' => $ticket->ticket_tanggal,
                                'ticket_problem' => $ticket->ticket_problem,
                                'bodyraw' => $ticket->bodyraw,
                                'is_work' => $ticket->start_time ? true : false
                            ];
                        }
                    }else{
                        $projectMap[$projectType][$projectId]['ticket'] = [];
                    }

                }else{
                    $projectMap[$projectType][$projectId]['task'] = [];
                }
            }

            // penambahan task non-MAINTENANCE ke dalam project
            // if($projectType !== "MAINTENANCE"){} // jika; instalasi yang memiliki task
            $projectMap[$projectType][$projectId]['task'][] = [
                'task_id' => $task->task_id,
                'project_id' => $task->project_id,
                'task_name' => $task->task_name,
                'is_work' => $task->start_time ? true : false,
                // 'start_time' => $task->start_time,
                // 'end_time' => $task->end_time,
            ] ?? [];
        }

        // penyesuaian struktur
        foreach($projectMap as $type => $projects){
            $groupedProjects[] = [
                'type' => $type,
                'projects' => array_values($projects),
            ];
        }

        return $groupedProjects;
    }
}
