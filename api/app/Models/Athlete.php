<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Athlete extends Model
{
    protected $fillable = ['user_id', 'name', 'email', 'phone', 'category', 'ranking', 'bio', 'stats'];

    protected $casts = [
        'stats' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function matches()
    {
        return $this->belongsToMany(Game::class, 'match_players', 'athlete_id', 'match_id')
            ->withPivot('team')
            ->withTimestamps();
    }
}
