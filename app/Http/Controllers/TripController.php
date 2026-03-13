<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use App\Services\GeoapifyService;
use App\Services\TravelApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TripController extends Controller
{
    public function __construct(
        private GeoapifyService $placesService,
        private TravelApiService $travelService,
    ) {}

    public function index()
    {
        return Inertia::render('Planner');
    }

    public function autocomplete(Request $request)
    {
        $request->validate(['input' => 'required|string|min:2']);
        $suggestions = $this->placesService->autocomplete($request->input('input'));
        return response()->json($suggestions);
    }

    public function generate(Request $request)
    {
        $validated = $request->validate([
            'destination'          => 'required|string|max:255',
            'destination_place_id' => 'nullable|string',
            'lat'                  => 'nullable|numeric',
            'lon'                  => 'nullable|numeric',
            'travelers'            => 'required|integer|min:1|max:20',
            'duration_days'        => 'required|integer|min:1|max:30',
            'category'             => 'required|in:standard,premium,luxury',
            'budget'               => 'required|in:low,medium,high',
        ]);

        $tripData = $this->travelService->generateTripPlan(
            $validated['destination'],
            $validated['travelers'],
            $validated['duration_days'],
            $validated['category'],
            $validated['budget'],
            isset($validated['lat']) ? (float) $validated['lat'] : null,
            isset($validated['lon']) ? (float) $validated['lon'] : null,
        );

        $trip = null;
        if (auth()->check()) {
            $trip = Trip::create([
                'user_id'              => auth()->id(),
                'destination'          => $validated['destination'],
                'destination_place_id' => $validated['destination_place_id'] ?? null,
                'travelers'            => $validated['travelers'],
                'duration_days'        => $validated['duration_days'],
                'category'             => $validated['category'],
                'budget'               => $validated['budget'],
                'attractions'          => $tripData['attractions'],
                'hotels'               => $tripData['hotels'],
                'itinerary'            => $tripData['itinerary'],
            ]);
        }

        return Inertia::render('TripResults', [
            'trip'     => $trip,
            'tripData' => $tripData,
            'formData' => $validated,
        ]);
    }

    public function show(Trip $trip)
    {
        abort_unless(auth()->id() === $trip->user_id, 403);

        $tripData = $this->travelService->buildTripDataFromSaved($trip);

        return Inertia::render('TripResults', [
            'trip'     => $trip,
            'tripData' => $tripData,
            'formData' => [
                'destination'   => $trip->destination,
                'travelers'     => $trip->travelers,
                'duration_days' => $trip->duration_days,
                'category'      => $trip->category,
                'budget'        => $trip->budget,
            ],
        ]);
    }

    public function destroy(Trip $trip)
    {
        abort_unless(auth()->id() === $trip->user_id, 403);
        $trip->delete();
        return response()->json(['success' => true]);
    }

    public function toggleWishlist(Trip $trip)
    {
        abort_unless(auth()->id() === $trip->user_id, 403);
        $trip->update(['wishlisted' => !$trip->wishlisted]);
        return response()->json(['wishlisted' => $trip->wishlisted]);
    }

    public function generateShareLink(Trip $trip)
    {
        abort_unless(auth()->id() === $trip->user_id, 403);

        if (!$trip->share_token) {
            $trip->update(['share_token' => Str::random(48)]);
        }

        return response()->json([
            'url' => url("/shared/{$trip->share_token}"),
        ]);
    }

    public function showShared(string $token)
    {
        $trip = Trip::where('share_token', $token)->firstOrFail();

        $tripData = $this->travelService->buildTripDataFromSaved($trip);

        return Inertia::render('TripResults', [
            'trip'     => null,   // read-only — no wishlist/delete controls for viewer
            'tripData' => $tripData,
            'formData' => [
                'destination'   => $trip->destination,
                'travelers'     => $trip->travelers,
                'duration_days' => $trip->duration_days,
                'category'      => $trip->category,
                'budget'        => $trip->budget,
            ],
            'isSharedView' => true,
        ]);
    }

    public function dashboard()
    {
        $trips = auth()->check()
            ? Trip::where('user_id', auth()->id())->with('bookings')->latest()->get()
            : collect([]);

        return Inertia::render('Dashboard', ['trips' => $trips]);
    }
}
