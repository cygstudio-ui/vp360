<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TournamentRegistration extends Model
{
    protected $fillable = ['tournament_id', 'athlete_id', 'status'];

    public function tournament()
    {
        return $this->belongsTo(Tournament::class);
    }

    public function athlete()
    {
        return $this->belongsTo(Athlete::class);
    }
}
