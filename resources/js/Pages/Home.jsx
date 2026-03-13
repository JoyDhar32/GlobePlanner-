import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import Logo from '../Components/Logo';
import DestinationSearch from '../Components/DestinationSearch';

const destinations = [
  { name: 'Sydney', country: 'Australia', seed: 'sydneyharbour', tag: 'Most Popular', desc: 'Iconic Opera House & Harbour' },
  { name: 'Melbourne', country: 'Australia', seed: 'melbournecity', tag: 'Trending', desc: 'Culture, food & vibrant laneways' },
  { name: 'Gold Coast', country: 'Australia', seed: 'goldcoastbeach', tag: 'Beach Life', desc: 'Sun, surf & theme parks' },
  { name: 'Bali', country: 'Indonesia', seed: 'balirice', tag: 'Top Getaway', desc: 'Temples, rice fields & beaches' },
  { name: 'Tokyo', country: 'Japan', seed: 'tokyocity', tag: 'Top Rated', desc: 'Tradition meets futuristic city' },
  { name: 'Singapore', country: 'Singapore', seed: 'singaporeskyline', tag: 'City Life', desc: 'Gardens by the Bay & Marina' },
];

const features = [
  {
    icon: '🤖',
    title: 'AI-Powered Itineraries',
    description: 'Smart trip plans tailored to your travel style, budget, and group size — generated in seconds.',
    color: 'from-sky-400 to-blue-500',
  },
  {
    icon: '📍',
    title: 'Real Attraction Data',
    description: 'Discover top-rated sights, hidden gems and must-see landmarks using live location data.',
    color: 'from-violet-400 to-purple-500',
  },
  {
    icon: '🏨',
    title: 'Curated Accommodations',
    description: 'Browse handpicked hotels from budget-friendly stays to five-star luxury retreats.',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    icon: '📅',
    title: 'Day-by-Day Plans',
    description: 'Detailed daily schedules so you never miss a moment of your perfect trip.',
    color: 'from-orange-400 to-amber-500',
  },
  {
    icon: '💰',
    title: 'Budget Flexibility',
    description: 'Plan for any budget — from backpacker adventures to luxury escapes worldwide.',
    color: 'from-rose-400 to-pink-500',
  },
  {
    icon: '❤️',
    title: 'Save & Revisit',
    description: 'Wishlist your favourite trips and revisit past searches from your personal dashboard.',
    color: 'from-cyan-400 to-sky-500',
  },
];

const steps = [
  { num: '01', title: 'Choose Your Destination', desc: 'Search any city or let our smart autocomplete guide you to your dream location.', icon: '🌏' },
  { num: '02', title: 'Set Your Preferences', desc: 'Tell us your travel dates, group size, category, and budget — we handle the rest.', icon: '⚙️' },
  { num: '03', title: 'Get Your Itinerary', desc: 'Receive a full day-by-day plan with real attractions, hotels, and local experiences.', icon: '✈️' },
  { num: '04', title: 'Save & Explore', desc: 'Save trips to your dashboard, wishlist favourites, and share with your travel crew.', icon: '🗺️' },
];

const stats = [
  { value: '500+', label: 'Destinations' },
  { value: '10K+', label: 'Trips Planned' },
  { value: '4.9★', label: 'User Rating' },
  { value: '100%', label: 'Free to Use' },
];

export default function Home() {
  const [destination, setDestination] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [heroLoaded, setHeroLoaded] = useState(false);

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

  const handleQuickCity = (city) => {
    router.visit('/planner', { data: { destination: city } });
  };

  return (
    <MainLayout>
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image — Sydney Opera House via picsum stable seed */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/seed/sydneyoperahouse/1920/1080"
            alt="Sydney Harbour"
            onLoad={() => setHeroLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-1000 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          {/* Multi-layer gradient for drama */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-900/80 via-blue-900/60 to-indigo-900/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent" />
        </div>

        {/* Floating orbs for depth */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-32 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo size="lg" withText={false} />
          </div>

          {/* Headline */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-sky-200 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse inline-block" />
              Australia's #1 Travel Planner
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Plan Your Perfect<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-200 to-cyan-300">
              Australian Adventure
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200/90 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            From the Sydney Harbour to the Great Barrier Reef — discover, plan, and book your dream trip in minutes.
          </p>

          {/* Search box */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-2.5 max-w-2xl mx-auto shadow-2xl border border-white/25 mb-6">
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
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white px-7 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-sky-500/40 hover:shadow-xl disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Start Planning
              </button>
            </div>
          </div>

          {/* Quick picks */}
          <div className="flex flex-wrap justify-center gap-2 mb-16">
            {['Sydney', 'Melbourne', 'Gold Coast', 'Bali', 'Tokyo', 'Singapore'].map((city) => (
              <button
                key={city}
                onClick={() => handleQuickCity(city)}
                className="bg-white/15 hover:bg-white/25 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm border border-white/25 transition-all hover:scale-105 hover:border-white/40"
              >
                📍 {city}
              </button>
            ))}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
                <div className="text-2xl font-extrabold text-white">{s.value}</div>
                <div className="text-xs text-sky-200 font-medium mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-1 text-white/50">
            <span className="text-xs">Scroll</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-gray-950 to-gray-950 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sky-400 text-sm font-bold uppercase tracking-widest">Simple Process</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-3 mb-4">How GlobePlanner Works</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Four easy steps to your perfect trip — from idea to itinerary in under a minute.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative group">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(100%_-_12px)] w-6 h-0.5 bg-gradient-to-r from-sky-500/50 to-transparent z-10" />
                )}
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-7 hover:border-sky-500/40 hover:bg-gray-800/80 transition-all duration-300 group-hover:-translate-y-1 h-full">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-3xl">{step.icon}</span>
                    <span className="text-sky-400 font-black text-sm tracking-widest">{step.num}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sky-500 text-sm font-bold uppercase tracking-widest">Why GlobePlanner</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">We handle the hard stuff so you can focus on making memories.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-3xl p-8 border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-default"
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-sky-600 transition-colors">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── POPULAR DESTINATIONS ─── */}
      <section className="py-24 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sky-500 text-sm font-bold uppercase tracking-widest">Explore the World</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-4">Popular Destinations</h2>
            <p className="text-xl text-gray-500">From Australia's iconic landmarks to global hotspots — start your journey here.</p>
          </div>

          {/* Featured hero + 5 grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Large featured card */}
            <div
              onClick={() => handleDestinationClick(destinations[0])}
              className="lg:col-span-2 relative h-96 lg:h-auto min-h-[280px] rounded-3xl overflow-hidden cursor-pointer group shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={`https://picsum.photos/seed/${destinations[0].seed}/900/600`}
                alt={destinations[0].name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute top-5 left-5">
                <span className="bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">{destinations[0].tag}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <p className="text-sky-300 text-sm font-semibold mb-1">{destinations[0].country}</p>
                <h3 className="text-3xl font-extrabold text-white mb-1">{destinations[0].name}</h3>
                <p className="text-gray-300 text-sm">{destinations[0].desc}</p>
                <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-xl border border-white/30 group-hover:bg-white/30 transition-colors">
                  Plan this trip
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right column 2-stack */}
            <div className="flex flex-col gap-5">
              {destinations.slice(1, 3).map((dest, i) => (
                <div
                  key={i}
                  onClick={() => handleDestinationClick(dest)}
                  className="relative h-44 rounded-3xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-xl transition-all duration-300 flex-1"
                >
                  <img
                    src={`https://picsum.photos/seed/${dest.seed}/600/300`}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/30">{dest.tag}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white">{dest.name}</h3>
                    <p className="text-gray-300 text-xs">{dest.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom row 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
            {destinations.slice(3).map((dest, i) => (
              <div
                key={i}
                onClick={() => handleDestinationClick(dest)}
                className="relative h-56 rounded-3xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={`https://picsum.photos/seed/${dest.seed}/600/350`}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-sky-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">{dest.tag}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-xl font-bold text-white">{dest.name}</h3>
                  <p className="text-gray-300 text-xs mt-0.5">{dest.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AUSTRALIA HIGHLIGHT BANNER ─── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/seed/greatbarrierreef/1920/600"
            alt="Great Barrier Reef"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-blue-900/80 to-sky-900/70" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="text-teal-300 text-sm font-bold uppercase tracking-widest">Featured</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-4 mb-6">Explore Australia First</h2>
          <p className="text-xl text-teal-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            From the Great Barrier Reef to the Red Centre, the Whitsundays to the Daintree — Australia's wonders are right at your doorstep.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {['Sydney', 'Melbourne', 'Gold Coast', 'Cairns', 'Perth', 'Hobart'].map(city => (
              <button
                key={city}
                onClick={() => handleQuickCity(city)}
                className="bg-white/15 hover:bg-white/25 text-white text-sm font-semibold px-5 py-2.5 rounded-full backdrop-blur-sm border border-white/25 transition-all hover:scale-105"
              >
                {city}
              </button>
            ))}
          </div>
          <button
            onClick={() => router.visit('/planner')}
            className="inline-flex items-center gap-2 bg-white text-teal-700 hover:bg-teal-50 font-bold px-8 py-4 rounded-2xl shadow-xl transition-all hover:shadow-2xl hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Plan an Australian Trip
          </button>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sky-500 text-sm font-bold uppercase tracking-widest">Traveller Stories</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-4">Loved by Adventurers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah M.', city: 'Brisbane, QLD', quote: 'Planned my entire Bali trip in under 5 minutes. The day-by-day itinerary was spot-on and saved me hours of research.', stars: 5, avatar: 'sarah' },
              { name: 'James K.', city: 'Sydney, NSW', quote: 'The hotel recommendations were fantastic. Found a place I never would have discovered otherwise. Highly recommend!', stars: 5, avatar: 'james' },
              { name: 'Emma L.', city: 'Melbourne, VIC', quote: 'Used it for our Gold Coast family trip. The wishlist feature is brilliant — bookmarked 3 trips and came back to all of them!', stars: 5, avatar: 'emma' },
            ].map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <svg key={j} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={`https://picsum.photos/seed/${t.avatar}/48/48`}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-28 overflow-hidden bg-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-900/40 via-gray-950 to-gray-950 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">✈️</div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Your Next Adventure<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-300">Starts Here</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of Australians planning better trips with GlobePlanner — completely free, no credit card needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/planner"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl hover:shadow-sky-500/30 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Start Planning Free
            </a>
            <a
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all backdrop-blur-sm"
            >
              Create Free Account
            </a>
          </div>
          <p className="text-gray-600 text-sm mt-8">No sign-up required to start planning · Save trips by creating a free account</p>
        </div>
      </section>
    </MainLayout>
  );
}
