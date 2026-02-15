<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    protected $table = 'matches';

    protected $fillable = [
        'tournament_id',
        'club_id',
        'status',
        'score',
        'current_points',
        'start_time'
    ];

    public function tournament()
    {
        return $this->belongsTo(Tournament::class);
    }

    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    public function athletes()
    {
        return $this->belongsToMany(Athlete::class, 'match_players', 'match_id', 'athlete_id')
            ->withPivot('team')
            ->withTimestamps();
    }
}
