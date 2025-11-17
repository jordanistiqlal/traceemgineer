<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class Track_log extends Model
{
    protected $guarded  = ['id','track_log_id'];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->track_log_id = str_replace("-","",Uuid::uuid4()->toString());
        });
    }
}
