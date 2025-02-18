<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = ['name', 'date_time', 'duration', 'location', 'capacity', 'waitlist_capacity', 'status'];

    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}

