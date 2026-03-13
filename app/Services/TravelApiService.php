<?php

namespace App\Services;

class TravelApiService
{
    public function __construct(private GeoapifyService $geoapify) {}

    public function buildTripDataFromSaved(\App\Models\Trip $trip): array
    {
        return [
            'destination' => $trip->destination,
            'overview'    => $this->getDestinationOverview($trip->destination),
            'attractions' => $trip->attractions ?? [],
            'hotels'      => $trip->hotels ?? [],
            'itinerary'   => $trip->itinerary ?? [],
            'best_time'   => $this->getBestTimeToVisit($trip->destination),
            'image_url'   => $this->getDestinationImage($trip->destination),
        ];
    }

    public function generateTripPlan(
        string $destination,
        int $travelers,
        int $days,
        string $category,
        string $budget,
        ?float $lat = null,
        ?float $lon = null,
    ): array {
        // If coordinates not supplied, try to geocode the destination
        if (!$lat || !$lon) {
            $geo = $this->geoapify->geocode($destination);
            $lat = $geo['lat'] ?? null;
            $lon = $geo['lon'] ?? null;
        }

        $attractions = ($lat && $lon)
            ? $this->getRealAttractions($lat, $lon, $category)
            : $this->getAttractions($destination, $category);

        $hotels = ($lat && $lon)
            ? $this->getRealHotels($lat, $lon, $category, $budget)
            : $this->getHotels($destination, $category, $budget);

        return [
            'destination' => $destination,
            'overview'    => $this->getDestinationOverview($destination),
            'attractions' => $attractions,
            'hotels'      => $hotels,
            'itinerary'   => $this->generateItinerary($destination, $days, $category, $attractions),
            'best_time'   => $this->getBestTimeToVisit($destination),
            'image_url'   => $this->getDestinationImage($destination),
        ];
    }

    private function getRealAttractions(float $lat, float $lon, string $category): array
    {
        $features = $this->geoapify->getNearbyPlaces($lat, $lon, 'tourism.attraction,tourism.sights,entertainment', 8);

        if (empty($features)) {
            return [];
        }

        return array_values(array_map(function ($feature, $index) {
            $p      = $feature['properties'];
            $name   = $p['name'] ?? 'Attraction';
            $cats   = $p['categories'] ?? [];
            $type   = $this->formatCategory($cats);
            $rating = round(3.8 + ($index % 12) * 0.1, 1);
            $seed   = urlencode(strtolower(preg_replace('/[^a-z0-9]/i', '', $name)) ?: "place{$index}");

            return [
                'id'          => $index + 1,
                'name'        => $name,
                'description' => "Discover {$name}, one of the must-visit spots in this destination. A wonderful place to explore and experience local culture.",
                'rating'      => $rating,
                'type'        => $type,
                'duration'    => '1-3 hours',
                'price'       => $index % 3 === 0 ? 'Free' : '$5-20',
                'image_url'   => "https://picsum.photos/seed/{$seed}/800/600",
                'address'     => $p['formatted'] ?? $p['city'] ?? '',
            ];
        }, $features, array_keys($features)));
    }

    private function getRealHotels(float $lat, float $lon, string $category, string $budget): array
    {
        $features = $this->geoapify->getNearbyHotels($lat, $lon, 6);

        if (empty($features)) {
            return $this->getHotels('', $category, $budget);
        }

        $priceMultiplier = match($budget) {
            'low'  => 0.6,
            'high' => 1.8,
            default => 1.0,
        };

        $basePrices = [220, 150, 110, 80, 180, 95];
        $starCounts = [5, 4, 4, 3, 5, 3];
        $amenitySets = [
            ['Pool', 'Spa', 'Gym', 'Restaurant', 'Bar'],
            ['Restaurant', 'Bar', 'Free WiFi', 'Concierge'],
            ['Pool', 'Gym', 'Free WiFi', 'Business Center'],
            ['Free WiFi', 'Breakfast', 'Lounge'],
            ['Spa', 'Pool', 'Restaurant', 'Rooftop Bar'],
            ['Free WiFi', 'Breakfast', '24h Reception'],
        ];

        return array_values(array_map(function ($feature, $index) use ($priceMultiplier, $basePrices, $starCounts, $amenitySets) {
            $p    = $feature['properties'];
            $name = $p['name'] ?? 'Hotel';
            // Unique seed per hotel so images don't repeat
            $seed = strtolower(preg_replace('/[^a-z0-9]/i', '', $name)) . 'hotel';

            return [
                'id'             => $index + 1,
                'name'           => $name,
                'description'    => "Enjoy a comfortable stay at {$name}. Centrally located with excellent amenities and warm hospitality.",
                'rating'         => round(3.9 + ($index % 10) * 0.1, 1),
                'stars'          => $starCounts[$index % count($starCounts)],
                'price_per_night'=> round($basePrices[$index % count($basePrices)] * $priceMultiplier),
                'amenities'      => $amenitySets[$index % count($amenitySets)],
                'image_url'      => "https://picsum.photos/seed/{$seed}/800/600",
                'address'        => $p['formatted'] ?? $p['city'] ?? '',
            ];
        }, $features, array_keys($features)));
    }

    private function formatCategory(array $cats): string
    {
        foreach ($cats as $cat) {
            if (str_contains($cat, 'museum'))     return 'Museum';
            if (str_contains($cat, 'monument'))   return 'Monument';
            if (str_contains($cat, 'park'))        return 'Park';
            if (str_contains($cat, 'beach'))       return 'Beach';
            if (str_contains($cat, 'temple'))      return 'Temple';
            if (str_contains($cat, 'church'))      return 'Church';
            if (str_contains($cat, 'castle'))      return 'Castle';
            if (str_contains($cat, 'gallery'))     return 'Art Gallery';
            if (str_contains($cat, 'entertainment'))return 'Entertainment';
        }
        return 'Attraction';
    }

    private function getDestinationOverview(string $destination): array
    {
        $overviews = [
            'paris' => [
                'description' => 'Paris, the City of Light, enchants visitors with its iconic landmarks, world-class cuisine, and vibrant culture. From the Eiffel Tower to the Louvre, every corner tells a story.',
                'country' => 'France',
                'continent' => 'Europe',
                'language' => 'French',
                'currency' => 'Euro (EUR)',
                'timezone' => 'CET (UTC+1)',
            ],
            'tokyo' => [
                'description' => 'Tokyo seamlessly blends ultramodern and traditional elements, from neon-lit skyscrapers to historic temples. Japan\'s capital is a mesmerizing metropolis unlike any other.',
                'country' => 'Japan',
                'continent' => 'Asia',
                'language' => 'Japanese',
                'currency' => 'Japanese Yen (JPY)',
                'timezone' => 'JST (UTC+9)',
            ],
            'bali' => [
                'description' => 'Bali is a living postcard, an incredibly beautiful destination with iconic rice paddies, volcanic mountains, lush rainforest and verdant terraces.',
                'country' => 'Indonesia',
                'continent' => 'Asia',
                'language' => 'Balinese, Indonesian',
                'currency' => 'Indonesian Rupiah (IDR)',
                'timezone' => 'WITA (UTC+8)',
            ],
        ];

        $key = strtolower(explode(',', $destination)[0]);
        foreach ($overviews as $city => $overview) {
            if (str_contains($key, $city)) {
                return $overview;
            }
        }

        return [
            'description' => "Discover the wonders of {$destination}, a destination filled with incredible experiences, rich culture, and unforgettable memories waiting to be made.",
            'country' => 'International',
            'continent' => 'World',
            'language' => 'Local Language',
            'currency' => 'Local Currency',
            'timezone' => 'Local Time',
        ];
    }

    private function getAttractions(string $destination, string $category): array
    {
        $baseAttractions = [
            [
                'id' => 1,
                'name' => 'Historic City Center',
                'description' => 'Explore the heart of the city with its stunning architecture, vibrant markets, and rich history spanning centuries.',
                'rating' => 4.8,
                'type' => 'Landmark',
                'duration' => '2-3 hours',
                'price' => 'Free',
                'image_url' => 'https://picsum.photos/seed/landmark/800/600',
            ],
            [
                'id' => 2,
                'name' => 'National Museum',
                'description' => 'Immerse yourself in the local culture and heritage through fascinating exhibits and world-class collections.',
                'rating' => 4.6,
                'type' => 'Museum',
                'duration' => '3-4 hours',
                'price' => '$15-20',
                'image_url' => 'https://picsum.photos/seed/museum/800/600',
            ],
            [
                'id' => 3,
                'name' => 'Scenic Viewpoint',
                'description' => 'Breathtaking panoramic views of the city skyline and surrounding landscape, perfect for photography.',
                'rating' => 4.9,
                'type' => 'Scenic',
                'duration' => '1-2 hours',
                'price' => 'Free',
                'image_url' => 'https://picsum.photos/seed/viewpoint/800/600',
            ],
            [
                'id' => 4,
                'name' => 'Local Food Market',
                'description' => 'Taste authentic local cuisine at this vibrant street food market featuring dozens of food stalls and local delicacies.',
                'rating' => 4.7,
                'type' => 'Food & Culture',
                'duration' => '2 hours',
                'price' => '$10-30',
                'image_url' => 'https://picsum.photos/seed/market/800/600',
            ],
            [
                'id' => 5,
                'name' => 'Botanical Gardens',
                'description' => 'Stroll through magnificent gardens featuring thousands of plant species from around the world in a serene setting.',
                'rating' => 4.5,
                'type' => 'Nature',
                'duration' => '2-3 hours',
                'price' => '$8-12',
                'image_url' => 'https://picsum.photos/seed/gardens/800/600',
            ],
            [
                'id' => 6,
                'name' => 'Art District',
                'description' => 'Explore galleries, street art, and creative studios in the city\'s thriving arts district with local and international artists.',
                'rating' => 4.4,
                'type' => 'Arts & Culture',
                'duration' => '3 hours',
                'price' => 'Free - $20',
                'image_url' => 'https://picsum.photos/seed/artdistrict/800/600',
            ],
        ];

        if ($category === 'luxury' || $category === 'premium') {
            $baseAttractions[] = [
                'id' => 7,
                'name' => 'Private City Tour',
                'description' => 'Exclusive private guided tour with a knowledgeable local expert, customized to your interests.',
                'rating' => 5.0,
                'type' => 'Exclusive Experience',
                'duration' => '6 hours',
                'price' => '$150-300',
                'image_url' => 'https://picsum.photos/seed/citytour/800/600',
            ];
        }

        return $baseAttractions;
    }

    private function getHotels(string $destination, string $category, string $budget): array
    {
        $priceMultiplier = match($budget) {
            'low' => 0.6,
            'high' => 1.8,
            default => 1.0,
        };

        $hotels = [
            [
                'id' => 1,
                'name' => 'The Grand Palace Hotel',
                'description' => 'A magnificent 5-star hotel offering unparalleled luxury with stunning city views, world-class amenities, and exceptional service.',
                'rating' => 4.9,
                'stars' => 5,
                'price_per_night' => round(350 * $priceMultiplier),
                'amenities' => ['Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Concierge'],
                'image_url' => 'https://picsum.photos/seed/grandpalacehotel/800/600',
                'type' => 'luxury',
            ],
            [
                'id' => 2,
                'name' => 'Boutique Heritage Inn',
                'description' => 'Charming boutique hotel housed in a historic building, blending classic architecture with modern comforts in the city center.',
                'rating' => 4.7,
                'stars' => 4,
                'price_per_night' => round(180 * $priceMultiplier),
                'amenities' => ['Restaurant', 'Bar', 'Rooftop Terrace', 'Free WiFi'],
                'image_url' => 'https://picsum.photos/seed/boutiqueheritagehotel/800/600',
                'type' => 'boutique',
            ],
            [
                'id' => 3,
                'name' => 'City View Comfort Hotel',
                'description' => 'Modern and comfortable hotel with panoramic city views, excellent facilities, and convenient location near major attractions.',
                'rating' => 4.5,
                'stars' => 4,
                'price_per_night' => round(120 * $priceMultiplier),
                'amenities' => ['Pool', 'Gym', 'Restaurant', 'Business Center', 'Free WiFi'],
                'image_url' => 'https://picsum.photos/seed/cityviewcomforthotel/800/600',
                'type' => 'comfort',
            ],
            [
                'id' => 4,
                'name' => 'Travelers Budget Stay',
                'description' => 'Clean, comfortable, and affordable accommodation perfect for budget-conscious travelers who want to make the most of their trip.',
                'rating' => 4.2,
                'stars' => 3,
                'price_per_night' => round(65 * $priceMultiplier),
                'amenities' => ['Free WiFi', 'Breakfast', 'Lounge', '24/7 Reception'],
                'image_url' => 'https://picsum.photos/seed/travelersbudgetstay/800/600',
                'type' => 'budget',
            ],
        ];

        if ($category === 'luxury') {
            return array_values(array_filter($hotels, fn($h) => $h['stars'] >= 4));
        } elseif ($category === 'standard' && $budget === 'low') {
            return array_values(array_filter($hotels, fn($h) => $h['stars'] <= 3));
        }

        return $hotels;
    }

    private function generateItinerary(string $destination, int $days, string $category, array $attractions = []): array
    {
        $city = trim(explode(',', $destination)[0]);
        $placeNames = array_column($attractions, 'name');

        // Build day-by-day plan using real place names where available
        $templates = $this->buildDayTemplates($city, $placeNames, $category);

        $daySeeds = ['arrival', 'cityexplore', 'culture', 'nature', 'hiddengems', 'shopping', 'daytrip', 'adventure', 'food', 'relax'];

        $itinerary = [];
        for ($day = 1; $day <= $days; $day++) {
            $template = $templates[($day - 1) % count($templates)];
            $activities = $template['activities'];
            if ($category === 'luxury') {
                $activities[] = 'Private chauffeur transfer and VIP access arrangements';
            }
            $citySeed = strtolower(preg_replace('/[^a-z0-9]/i', '', $city));
            $daySeed  = $daySeeds[($day - 1) % count($daySeeds)];
            $itinerary[] = [
                'day'        => $day,
                'title'      => "Day {$day} – {$template['title']}",
                'activities' => $activities,
                'image_url'  => "https://picsum.photos/seed/{$citySeed}{$daySeed}/600/400",
            ];
        }

        return $itinerary;
    }

    private function buildDayTemplates(string $city, array $placeNames, string $category): array
    {
        // Spread real places across days — 2 per day roughly
        $chunks = array_chunk($placeNames, 2);

        $templates = [];

        // Day 1 always: Arrival
        $templates[] = [
            'title' => "Arrival & First Impressions of {$city}",
            'activities' => array_filter([
                "Arrive in {$city} and check in to your hotel",
                "Take a relaxed orientation walk through the city center",
                !empty($placeNames[0]) ? "Evening visit to {$placeNames[0]}" : "Explore the local neighborhood",
                "Dinner at a popular local restaurant to experience authentic cuisine",
            ]),
        ];

        // Day 2: First big attractions
        if (!empty($chunks[0])) {
            $places = $chunks[0];
            $templates[] = [
                'title' => "Exploring {$city}'s Top Highlights",
                'activities' => array_filter([
                    "Morning visit to " . implode(' and ', $places),
                    "Guided tour and photo opportunities at each site",
                    "Lunch at a café near the attractions",
                    "Afternoon stroll through nearby streets and local markets",
                    $category === 'luxury' ? "Sunset drinks at a rooftop bar with city views" : "Evening street food walk",
                ]),
            ];
        }

        // Day 3: Culture & more places
        if (!empty($chunks[1])) {
            $places = $chunks[1];
            $templates[] = [
                'title' => "Culture & Local Life in {$city}",
                'activities' => array_filter([
                    "Morning: visit " . implode(' and ', $places),
                    "Immerse yourself in local traditions and cultural history",
                    "Try a hands-on local cooking or craft class",
                    "Afternoon at the local art district or craft market",
                    "Evening cultural show or live performance",
                ]),
            ];
        }

        // Day 4: Nature & Adventure
        if (!empty($chunks[2])) {
            $places = $chunks[2];
            $templates[] = [
                'title' => "Nature & Adventure around {$city}",
                'activities' => array_filter([
                    "Early morning: head to " . implode(' and ', $places),
                    "Outdoor activities: hiking, cycling, or boat tour",
                    "Picnic lunch surrounded by natural scenery",
                    "Afternoon: explore a park or scenic viewpoint",
                    "Relaxed evening back in the city",
                ]),
            ];
        } else {
            $templates[] = [
                'title' => "Nature & Adventure around {$city}",
                'activities' => [
                    "Early morning hike or nature walk on the outskirts of {$city}",
                    "Visit a scenic viewpoint or national park nearby",
                    "Picnic lunch in a green setting",
                    "Afternoon boat trip or cycling tour",
                    "Evening sunset experience at a recommended spot",
                ],
            ];
        }

        // Day 5+: Remaining places and relaxation
        if (!empty($chunks[3])) {
            $places = $chunks[3];
            $templates[] = [
                'title' => "Hidden Gems & Local Secrets",
                'activities' => array_filter([
                    "Morning visit to " . implode(' and ', $places),
                    "Explore off-the-beaten-path neighborhoods",
                    "Local street food tour and market hopping",
                    "Visit artisan workshops and boutique shops",
                    "Evening live music or cultural event",
                ]),
            ];
        }

        // Always add: Shopping & Relaxation
        $templates[] = [
            'title' => "Shopping & Relaxation Day",
            'activities' => [
                $category === 'luxury' ? "Morning spa and wellness treatment" : "Morning yoga or leisurely breakfast",
                "Browse local boutiques, markets, and souvenir shops",
                "Lunch at a rooftop or terrace restaurant",
                "Afternoon at leisure — pool, beach, or city park",
                "Farewell dinner at {$city}'s best restaurant",
            ],
        ];

        // Day trip template
        $templates[] = [
            'title' => "Day Trip from {$city}",
            'activities' => [
                "Early departure for a full-day excursion outside {$city}",
                "Visit a nearby town, village, or natural landmark",
                "Lunch at a local countryside eatery",
                "Explore the surroundings at your own pace",
                "Return to {$city} for a relaxing evening",
            ],
        ];

        return $templates;
    }

    private function getBestTimeToVisit(string $destination): array
    {
        return [
            'best_months' => 'March to May, September to November',
            'peak_season' => 'June to August',
            'off_season' => 'December to February',
            'weather_overview' => 'Enjoy mild temperatures during spring and autumn. Summers can be warm and busy, while winters offer quieter experiences at lower prices.',
            'tips' => [
                'Book accommodations 2-3 months in advance for peak season',
                'Shoulder season offers the best balance of weather and crowds',
                'Pack layers as temperatures can vary throughout the day',
            ],
        ];
    }

    private function getDestinationImage(string $destination): string
    {
        $seed = urlencode(strtolower(preg_replace('/[^a-z0-9]/i', '', explode(',', $destination)[0])));
        return "https://picsum.photos/seed/{$seed}/1200/800";
    }
}
