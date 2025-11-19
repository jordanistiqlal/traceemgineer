<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class Project extends Model
{
    protected $guarded  = ['id','project_id'];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->project_id = str_replace("-","",Uuid::uuid4()->toString());
        });
    }

    public function task(){
        return $this->hasMany(Task::class, 'project_id', 'project_id');
    }
}
