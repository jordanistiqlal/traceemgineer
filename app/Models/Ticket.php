<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class Ticket extends Model
{
    protected $guarded  = ['id','ticket_id'];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ticket_id = str_replace("-","",Uuid::uuid4()->toString());
        });
    }
}
