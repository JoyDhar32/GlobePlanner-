<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GooglePlacesService
{
    protected string $apiKey;
    protected string $baseUrl = 'https://maps.googleapis.com/maps/api/place';

    public function __construct()
    {
        $this->apiKey = config('services.google.places_api_key', '');
    }

    public function autocomplete(string $input, string $sessionToken = ''): array
    {
        if (empty($this->apiKey)) {
            return $this->getMockSuggestions($input);
        }
        try {
            $response = Http::get("{$this->baseUrl}/autocomplete/json", [
                'input' => $input,
                'types' => '(cities)',
                'key' => $this->apiKey,
                'sessiontoken' => $sessionToken,
            ]);
            if ($response->successful()) {
                $data = $response->json();
                return array_map(fn($p) => [
                    'place_id' => $p['place_id'],
                    'description' => $p['description'],
                    'main_text' => $p['structured_formatting']['main_text'] ?? $p['description'],
                    'secondary_text' => $p['structured_formatting']['secondary_text'] ?? '',
                ], $data['predictions'] ?? []);
            }
        } catch (\Exception $e) {
            \Log::error('Google Places API error: ' . $e->getMessage());
        }
        return $this->getMockSuggestions($input);
    }

    public function getPlaceDetails(string $placeId): array
    {
        if (empty($this->apiKey)) {
            return $this->getMockPlaceDetails($placeId);
        }
        try {
            $response = Http::get("{$this->baseUrl}/details/json", [
                'place_id' => $placeId,
                'fields' => 'name,formatted_address,geometry,photos,rating,editorial_summary',
                'key' => $this->apiKey,
            ]);
            if ($response->successful()) {
                return $response->json()['result'] ?? [];
            }
        } catch (\Exception $e) {
            \Log::error('Google Places details error: ' . $e->getMessage());
        }
        return $this->getMockPlaceDetails($placeId);
    }

    private function getMockSuggestions(string $input): array
    {
        $destinations = [
            ['place_id' => 'paris_fr', 'description' => 'Paris, France', 'main_text' => 'Paris', 'secondary_text' => 'France'],
            ['place_id' => 'tokyo_jp', 'description' => 'Tokyo, Japan', 'main_text' => 'Tokyo', 'secondary_text' => 'Japan'],
            ['place_id' => 'nyc_us', 'description' => 'New York City, NY, USA', 'main_text' => 'New York City', 'secondary_text' => 'NY, USA'],
            ['place_id' => 'london_uk', 'description' => 'London, United Kingdom', 'main_text' => 'London', 'secondary_text' => 'United Kingdom'],
            ['place_id' => 'bali_id', 'description' => 'Bali, Indonesia', 'main_text' => 'Bali', 'secondary_text' => 'Indonesia'],
            ['place_id' => 'rome_it', 'description' => 'Rome, Italy', 'main_text' => 'Rome', 'secondary_text' => 'Italy'],
            ['place_id' => 'barcelona_es', 'description' => 'Barcelona, Spain', 'main_text' => 'Barcelona', 'secondary_text' => 'Spain'],
            ['place_id' => 'dubai_ae', 'description' => 'Dubai, UAE', 'main_text' => 'Dubai', 'secondary_text' => 'UAE'],
            ['place_id' => 'sydney_au', 'description' => 'Sydney, Australia', 'main_text' => 'Sydney', 'secondary_text' => 'Australia'],
            ['place_id' => 'amsterdam_nl', 'description' => 'Amsterdam, Netherlands', 'main_text' => 'Amsterdam', 'secondary_text' => 'Netherlands'],
            ['place_id' => 'singapore_sg', 'description' => 'Singapore', 'main_text' => 'Singapore', 'secondary_text' => 'Singapore'],
            ['place_id' => 'istanbul_tr', 'description' => 'Istanbul, Turkey', 'main_text' => 'Istanbul', 'secondary_text' => 'Turkey'],
        ];
        $filtered = array_filter($destinations, fn($d) =>
            stripos($d['description'], $input) !== false ||
            stripos($d['main_text'], $input) !== false
        );
        return array_values($filtered) ?: array_slice($destinations, 0, 5);
    }

    private function getMockPlaceDetails(string $placeId): array
    {
        return [
            'name' => 'Beautiful Destination',
            'formatted_address' => 'A wonderful city',
            'editorial_summary' => ['overview' => 'A magnificent destination waiting to be explored.'],
        ];
    }
}
