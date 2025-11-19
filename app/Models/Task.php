<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class Task extends Model
{
    protected $guarded  = ['id','task_id'];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->task_id = str_replace("-","",Uuid::uuid4()->toString());
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id', 'project_id');
    }
}
