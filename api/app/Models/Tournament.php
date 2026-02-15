<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tournament extends Model
{
    protected $fillable = ['name', 'club_id', 'date'];

    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    public function matches()
    {
        return $this->hasMany(Game::class);
    }

    public function registrations()
    {
        return $this->hasMany(TournamentRegistration::class);
    }
}
