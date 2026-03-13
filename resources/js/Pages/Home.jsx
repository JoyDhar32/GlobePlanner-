import { useState } from 'react';
import { router } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import Logo from '../Components/Logo';
import DestinationSearch from '../Components/DestinationSearch';

const destinations = [
  { name: 'Sydney', country: 'Australia', image: 'https://picsum.photos/seed/sydney/600/400', tag: 'Most Popular' },
  { name: 'Melbourne', country: 'Australia', image: 'https://picsum.photos/seed/melbourne/600/400', tag: 'Trending' },
  { name: 'Bali', country: 'Indonesia', image: 'https://picsum.photos/seed/bali/600/400', tag: 'Top Getaway' },
  { name: 'Tokyo', country: 'Japan', image: 'https://picsum.photos/seed/tokyo/600/400', tag: 'Top Rated' },
  { name: 'Gold Coast', country: 'Australia', image: 'https://picsum.photos/seed/goldcoast/600/400', tag: 'Beach Life' },
  { name: 'Singapore', country: 'Singapore', image: 'https://picsum.photos/seed/singapore/600/400', tag: 'City Life' },
];

const features = [
  { icon: '🗺️', title: 'Smart Trip Planning', description: 'AI-powered itineraries tailored to your preferences, budget, and travel style.' },
  { icon: '🏛️', title: 'Discover Top Destinations', description: 'Explore handpicked attractions, hidden gems, and must-see landmarks worldwide.' },
  { icon: '🏨', title: 'Find Hotels & Experiences', description: 'Browse curated accommodations and unique experiences at every price point.' },
  { icon: '📅', title: 'Day-by-Day Itineraries', description: 'Get detailed daily plans so you never miss a moment of your perfect trip.' },
  { icon: '💰', title: 'Budget Friendly Options', description: 'Plan trips that fit any budget from backpacker adventures to luxury escapes.' },
  { icon: '🔖', title: 'Save & Share Plans', description: 'Save your favorite trips and share itineraries with your travel companions.' },
];

export default function Home() {
  const [destination, setDestination] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handleSearch = () => {
    if (!destination) return;
    router.visit('/planner', {
      data: { destination, place_id: selectedPlace?.place_id || '' },
    });
  };

  const handleDestinationClick = (dest) => {
    router.visit('/planner', {
      data: { destination: dest.name + ', ' + dest.country },
    });
  };

  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/seed/worldtravel/1920/1080"
            alt="World travel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sky-900/70 via-blue-900/60 to-gray-900/80" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <Logo size="lg" withText={false} />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Plan Your Perfect Trip with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-200">
              GlobePlanner
            </span>
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover amazing destinations, generate smart itineraries, and find the best hotels &mdash; all in one place.
          </p>
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-2 max-w-2xl mx-auto shadow-2xl border border-white/20">
            <div className="flex gap-2">
              <div className="flex-1">
                <DestinationSearch
                  value={destination}
                  onChange={setDestination}
                  onSelect={setSelectedPlace}
                  placeholder="Where do you want to go?"
                  className="w-full"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={!destination}
                className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Start Planning
              </button>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {['Sydney', 'Melbourne', 'Gold Coast', 'Bali', 'Tokyo', 'Singapore'].map((city) => (
              <button
                key={city}
                onClick={() => { setDestination(city); handleSearch(); }}
                className="bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm border border-white/30 transition-all"
              >
                📍 {city}
              </button>
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Everything You Need to Travel Better</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">From discovery to booking, GlobePlanner handles every step of your journey.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-50 to-sky-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group border border-gray-100">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-sky-600 transition-colors">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Popular Destinations</h2>
            <p className="text-xl text-gray-500">Explore the world's most beloved travel destinations</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest, i) => (
              <div
                key={i}
                onClick={() => handleDestinationClick(dest)}
                className="relative h-72 rounded-3xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full">{dest.tag}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white">{dest.name}</h3>
                  <p className="text-gray-300 text-sm">{dest.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-sky-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-6">Ready to Explore the World?</h2>
          <p className="text-xl text-sky-100 mb-10">Join thousands of travelers who plan better trips with GlobePlanner.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/planner" className="bg-white text-sky-600 hover:bg-sky-50 px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl">
              Start Planning Free
            </a>
            <a href="/register" className="bg-sky-500 border-2 border-white/40 text-white hover:bg-sky-400 px-10 py-4 rounded-full font-bold text-lg transition-all">
              Create Account
            </a>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
