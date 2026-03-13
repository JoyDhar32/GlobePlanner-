<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'trip_id' => 'required|exists:trips,id',
            'type' => 'required|in:hotel,attraction,itinerary',
            'item_name' => 'required|string|max:255',
            'estimated_price' => 'nullable|numeric|min:0',
            'details' => 'nullable|array',
        ]);

        $booking = Booking::create([
            ...$validated,
            'user_id' => auth()->id(),
            'status' => 'confirmed',
        ]);

        return response()->json([
            'success' => true,
            'booking' => $booking,
            'message' => 'Booking confirmed successfully!',
        ]);
    }
}
