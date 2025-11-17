<?php

namespace App\Services;

use App\Models\Project;
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
                'engineer' => ['required','string'],
                'task' => ['required','string'],
                'ticket' => ['required','string'],
            ]);

            $data = [
                'project_name' => $request->nama_project,
                'project_type' => $request->tipe,
                'user_id' => $request->engineer,
                'task_id' => $request->task,
                'ticket_id' => $request->ticket,
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
                'project_name' => ['required','string','max:128'],
                'project_type' => ['required','string','max:64'],
                'user_id' => ['required','string'],
                'task_id' => ['required','string'],
                'ticket_id' => ['required','string'],
            ]);
    
            $update = [
                'project_name' => $request->project_name,
                'project_type' => $request->project_type,
                'user_id' => $request->user_id,
                'task_id' => $request->task_id,
                'ticket_id' => $request->ticket_id,
            ];
    
            Project::where('project_id',$id)->update($update); 
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
            Project::where('project_id', $id)->delete();
            DB::commit();
            return ['Success', 'Project Deleted'];
        } 
        catch (Exception $error) {
            DB::rollBack();
            return ['Failed', $error->getMessage()];
        }
    }
}
