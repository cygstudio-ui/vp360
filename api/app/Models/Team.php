<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $fillable = ['tournament_id', 'athlete1_id', 'athlete2_id', 'category', 'status'];

    public function tournament()
    {
        return $this->belongsTo(Tournament::class);
    }

    public function athlete1()
    {
        return $this->belongsTo(Athlete::class, 'athlete1_id');
    }

    public function athlete2()
    {
        return $this->belongsTo(Athlete::class, 'athlete2_id');
    }
}
