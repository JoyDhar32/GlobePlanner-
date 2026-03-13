<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'destination', 'destination_place_id',
        'travelers', 'duration_days', 'category', 'budget',
        'wishlisted', 'notes', 'share_token',
        'attractions', 'hotels', 'itinerary',
    ];

    protected $casts = [
        'attractions' => 'array',
        'hotels'      => 'array',
        'itinerary'   => 'array',
        'wishlisted'  => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
