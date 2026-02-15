<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Apparel extends Model
{
    protected $fillable = ['shirt_id', 'athlete_id'];

    public function athlete()
    {
        return $this->belongsTo(Athlete::class);
    }
}
