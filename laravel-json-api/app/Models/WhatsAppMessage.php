<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WhatsAppMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'to',
        'from',
        'body',
        'status',
        'response',
        'error_message',
    ];

    protected $casts = [
        'response' => 'array',
    ];
}
