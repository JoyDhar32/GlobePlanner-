<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeoapifyService
{
    protected string $apiKey;
    protected string $baseUrl = 'https://api.geoapify.com';

    public function __construct()
    {
        $this->apiKey = config('services.geoapify.api_key', '');
    }

    public function autocomplete(string $input): array
    {
        if (empty($this->apiKey)) {
            return $this->getMockSuggestions($input);
        }

        try {
            $response = Http::get("{$this->baseUrl}/v1/geocode/autocomplete", [
                'text'   => $input,
                'limit'  => 8,
                'apiKey' => $this->apiKey,
            ]);

            if ($response->successful()) {
                $features = $response->json()['features'] ?? [];

                if (empty($features)) {
                    return $this->getMockSuggestions($input);
                }

                return array_values(array_map(function ($feature) {
                    $p = $feature['properties'];
                    $city    = $p['city'] ?? $p['name'] ?? $p['formatted'] ?? '';
                    $country = $p['country'] ?? '';
                    $state   = $p['state'] ?? '';

                    $secondary = array_filter([$state ?: null, $country ?: null]);

                    return [
                        'place_id'       => $p['place_id'] ?? md5($p['formatted'] ?? $city),
                        'description'    => $p['formatted'] ?? trim("{$city}, {$country}", ', '),
                        'main_text'      => $city,
                        'secondary_text' => implode(', ', $secondary),
                        'lat'            => $p['lat'] ?? null,
                        'lon'            => $p['lon'] ?? null,
                    ];
                }, $features));
            }
        } catch (\Exception $e) {
            Log::error('Geoapify autocomplete error: ' . $e->getMessage());
        }

        return $this->getMockSuggestions($input);
    }

    public function geocode(string $location): ?array
    {
        if (empty($this->apiKey)) {
            return null;
        }

        try {
            $response = Http::get("{$this->baseUrl}/v1/geocode/search", [
                'text'   => $location,
                'limit'  => 1,
                'apiKey' => $this->apiKey,
            ]);

            if ($response->successful()) {
                $features = $response->json()['features'] ?? [];
                if (!empty($features)) {
                    $p = $features[0]['properties'];
                    return [
                        'lat'       => $p['lat'],
                        'lon'       => $p['lon'],
                        'formatted' => $p['formatted'] ?? $location,
                    ];
                }
            }
        } catch (\Exception $e) {
            Log::error('Geoapify geocode error: ' . $e->getMessage());
        }

        return null;
    }

    public function getNearbyPlaces(float $lat, float $lon, string $categories = 'tourism.attraction,tourism.sights', int $limit = 8): array
    {
        if (empty($this->apiKey)) {
            return [];
        }

        try {
            $response = Http::get("{$this->baseUrl}/v2/places", [
                'categories' => $categories,
                'filter'     => "circle:{$lon},{$lat},10000",
                'limit'      => $limit,
                'apiKey'     => $this->apiKey,
            ]);

            if ($response->successful()) {
                return $response->json()['features'] ?? [];
            }
        } catch (\Exception $e) {
            Log::error('Geoapify places error: ' . $e->getMessage());
        }

        return [];
    }

    public function getNearbyHotels(float $lat, float $lon, int $limit = 6): array
    {
        return $this->getNearbyPlaces($lat, $lon, 'accommodation.hotel,accommodation', $limit);
    }

    private function getMockSuggestions(string $input): array
    {
        $destinations = [
            // Australia first
            ['place_id' => 'sydney_au',        'description' => 'Sydney, New South Wales, Australia',  'main_text' => 'Sydney',        'secondary_text' => 'NSW, Australia',       'lat' => -33.8688, 'lon' => 151.2093],
            ['place_id' => 'melbourne_au',     'description' => 'Melbourne, Victoria, Australia',      'main_text' => 'Melbourne',     'secondary_text' => 'VIC, Australia',       'lat' => -37.8136, 'lon' => 144.9631],
            ['place_id' => 'brisbane_au',      'description' => 'Brisbane, Queensland, Australia',     'main_text' => 'Brisbane',      'secondary_text' => 'QLD, Australia',       'lat' => -27.4698, 'lon' => 153.0251],
            ['place_id' => 'goldcoast_au',     'description' => 'Gold Coast, Queensland, Australia',   'main_text' => 'Gold Coast',    'secondary_text' => 'QLD, Australia',       'lat' => -28.0167, 'lon' => 153.4000],
            ['place_id' => 'perth_au',         'description' => 'Perth, Western Australia, Australia', 'main_text' => 'Perth',         'secondary_text' => 'WA, Australia',        'lat' => -31.9505, 'lon' => 115.8605],
            ['place_id' => 'adelaide_au',      'description' => 'Adelaide, South Australia, Australia','main_text' => 'Adelaide',      'secondary_text' => 'SA, Australia',        'lat' => -34.9285, 'lon' => 138.6007],
            ['place_id' => 'cairns_au',        'description' => 'Cairns, Queensland, Australia',       'main_text' => 'Cairns',        'secondary_text' => 'QLD, Australia',       'lat' => -16.9186, 'lon' => 145.7781],
            ['place_id' => 'darwin_au',        'description' => 'Darwin, Northern Territory, Australia','main_text' => 'Darwin',       'secondary_text' => 'NT, Australia',        'lat' => -12.4634, 'lon' => 130.8456],
            ['place_id' => 'hobart_au',        'description' => 'Hobart, Tasmania, Australia',         'main_text' => 'Hobart',        'secondary_text' => 'TAS, Australia',       'lat' => -42.8821, 'lon' => 147.3272],
            // Asia-Pacific popular from Australia
            ['place_id' => 'bali_id',          'description' => 'Bali, Indonesia',                     'main_text' => 'Bali',          'secondary_text' => 'Indonesia',            'lat' => -8.4095,  'lon' => 115.1889],
            ['place_id' => 'singapore_sg',     'description' => 'Singapore',                           'main_text' => 'Singapore',     'secondary_text' => 'Singapore',            'lat' => 1.3521,   'lon' => 103.8198],
            ['place_id' => 'tokyo_jp',         'description' => 'Tokyo, Japan',                        'main_text' => 'Tokyo',         'secondary_text' => 'Japan',                'lat' => 35.6762,  'lon' => 139.6503],
            ['place_id' => 'kyoto_jp',         'description' => 'Kyoto, Japan',                        'main_text' => 'Kyoto',         'secondary_text' => 'Japan',                'lat' => 35.0116,  'lon' => 135.7681],
            ['place_id' => 'bangkok_th',       'description' => 'Bangkok, Thailand',                   'main_text' => 'Bangkok',       'secondary_text' => 'Thailand',             'lat' => 13.7563,  'lon' => 100.5018],
            ['place_id' => 'phuket_th',        'description' => 'Phuket, Thailand',                    'main_text' => 'Phuket',        'secondary_text' => 'Thailand',             'lat' => 7.8804,   'lon' => 98.3923],
            ['place_id' => 'auckland_nz',      'description' => 'Auckland, New Zealand',               'main_text' => 'Auckland',      'secondary_text' => 'New Zealand',          'lat' => -36.8485, 'lon' => 174.7633],
            ['place_id' => 'dubai_ae',         'description' => 'Dubai, UAE',                          'main_text' => 'Dubai',         'secondary_text' => 'UAE',                  'lat' => 25.2048,  'lon' => 55.2708],
            // International
            ['place_id' => 'paris_fr',         'description' => 'Paris, France',                       'main_text' => 'Paris',         'secondary_text' => 'France',               'lat' => 48.8566,  'lon' => 2.3522],
            ['place_id' => 'london_uk',        'description' => 'London, United Kingdom',              'main_text' => 'London',        'secondary_text' => 'United Kingdom',       'lat' => 51.5074,  'lon' => -0.1278],
            ['place_id' => 'nyc_us',           'description' => 'New York City, USA',                  'main_text' => 'New York City', 'secondary_text' => 'USA',                  'lat' => 40.7128,  'lon' => -74.0060],
            ['place_id' => 'rome_it',          'description' => 'Rome, Italy',                         'main_text' => 'Rome',          'secondary_text' => 'Italy',                'lat' => 41.9028,  'lon' => 12.4964],
            ['place_id' => 'amsterdam_nl',     'description' => 'Amsterdam, Netherlands',              'main_text' => 'Amsterdam',     'secondary_text' => 'Netherlands',          'lat' => 52.3676,  'lon' => 4.9041],
        ];

        $filtered = array_filter($destinations, fn($d) =>
            stripos($d['description'], $input) !== false ||
            stripos($d['main_text'], $input) !== false
        );

        return array_values($filtered) ?: array_slice($destinations, 0, 5);
    }
}
