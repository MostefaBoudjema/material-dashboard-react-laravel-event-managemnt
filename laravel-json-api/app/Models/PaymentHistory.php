<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'stripe_payment_intent_id',
        'amount',
        'currency',
        'status',
        'client_secret',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];
}
