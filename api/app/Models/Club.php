<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Club extends Model
{
    protected $fillable = ['name', 'logo', 'address', 'state', 'instagram', 'email', 'phone'];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function tournaments()
    {
        return $this->hasMany(Tournament::class);
    }

    public function matches()
    {
        return $this->hasMany(Game::class);
    }
}
