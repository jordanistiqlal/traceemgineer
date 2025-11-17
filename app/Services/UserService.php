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
                'role'      => $request->role,
                'password'  => Hash::make($request->password),
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
}
