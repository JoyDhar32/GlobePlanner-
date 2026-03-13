import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import MainLayout from '../Layouts/MainLayout';
import AttractionCard from '../Components/AttractionCard';
import HotelCard from '../Components/HotelCard';
import ItineraryTimeline from '../Components/ItineraryTimeline';

export default function TripResults({ trip, tripData, formData }) {
  const { auth } = usePage().props;
  const [savedItinerary, setSavedItinerary] = useState(false);
  const [wishlisted, setWishlisted] = useState(trip?.wishlisted || false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const handleSaveItinerary = () => {
    setSavedItinerary(true);
    setTimeout(() => setSavedItinerary(false), 3000);
  };

  const handleWishlist = async () => {
    if (!trip || wishlistLoading) return;
    setWishlistLoading(true);
    try {
      const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
      const { data } = await axios.post(`/trips/${trip.id}/wishlist`, {}, {
        headers: { 'X-CSRF-TOKEN': csrf },
      });
      setWishlisted(data.wishlisted);
    } catch (e) {
      console.error(e);
    } finally {
      setWishlistLoading(false);
    }
  };

  if (!tripData) return null;

  return (
    <MainLayout>
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={tripData.image_url}
          alt={tripData.destination}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="bg-sky-500 text-white text-sm font-semibold px-3 py-1 rounded-full capitalize">{formData.category}</span>
              <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">{formData.duration_days} days</span>
              <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">{formData.travelers} traveler{formData.travelers > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white">{tripData.destination}</h1>
                <p className="text-gray-300 mt-2">{tripData.overview?.country} &bull; {tripData.overview?.continent}</p>
              </div>
              {auth?.user && trip && (
                <button
                  onClick={handleWishlist}
                  disabled={wishlistLoading}
                  title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all shadow-md ${
                    wishlisted
                      ? 'bg-rose-500 text-white hover:bg-rose-600'
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                  }`}
                >
                  <svg className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {tripData.destination}</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{tripData.overview?.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                {[
                  { label: 'Language', value: tripData.overview?.language, icon: '🗣️' },
                  { label: 'Currency', value: tripData.overview?.currency, icon: '💰' },
                  { label: 'Timezone', value: tripData.overview?.timezone, icon: '🕐' },
                ].map((info, i) => (
                  <div key={i} className="bg-gray-50 rounded-2xl p-4">
                    <span className="text-2xl">{info.icon}</span>
                    <p className="text-xs text-gray-500 mt-1 font-semibold uppercase">{info.label}</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{info.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Attractions */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Top Places to Visit</h2>
                <span className="text-sm text-gray-500">{(tripData.attractions || []).length} attractions</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {(tripData.attractions || []).map((attraction) => (
                  <AttractionCard
                    key={attraction.id}
                    attraction={attraction}
                    destination={formData.destination}
                  />
                ))}
              </div>
            </section>

            {/* Hotels */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recommended Hotels</h2>
                <span className="text-sm text-gray-500">{(tripData.hotels || []).length} options</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {(tripData.hotels || []).map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    destination={formData.destination}
                  />
                ))}
              </div>
            </section>

            {/* Itinerary */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Suggested Itinerary</h2>
                <button
                  onClick={handleSaveItinerary}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    savedItinerary
                      ? 'bg-green-100 text-green-700'
                      : 'bg-sky-50 text-sky-600 hover:bg-sky-100'
                  }`}
                >
                  {savedItinerary ? '✓ Saved!' : '💾 Save Itinerary'}
                </button>
              </div>
              <ItineraryTimeline itinerary={tripData.itinerary || []} />
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Best Time */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <span>🌤️</span> Best Time to Visit
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Best months</span>
                  <span className="font-semibold text-gray-700 text-right text-xs">{tripData.best_time?.best_months}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Peak season</span>
                  <span className="font-semibold text-gray-700">{tripData.best_time?.peak_season}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Off season</span>
                  <span className="font-semibold text-gray-700">{tripData.best_time?.off_season}</span>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-sm text-gray-600">{tripData.best_time?.weather_overview}</p>
                </div>
                <div className="space-y-2">
                  {(tripData.best_time?.tips || []).map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-500">
                      <span className="text-sky-400 mt-0.5">&bull;</span>
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trip Summary */}
            <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl p-6 text-white">
              <h3 className="font-bold text-lg mb-4">Trip Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-sky-100">Destination</span>
                  <span className="font-semibold">{formData.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sky-100">Duration</span>
                  <span className="font-semibold">{formData.duration_days} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sky-100">Travelers</span>
                  <span className="font-semibold">{formData.travelers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sky-100">Style</span>
                  <span className="font-semibold capitalize">{formData.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sky-100">Budget</span>
                  <span className="font-semibold capitalize">{formData.budget}</span>
                </div>
              </div>
              <Link href="/planner" className="mt-6 block w-full bg-white text-sky-600 py-3 rounded-xl font-bold text-center hover:bg-sky-50 transition-colors text-sm">
                Plan Another Trip
              </Link>
            </div>
          </div>
        </div>
      </div>

    </MainLayout>
  );
}
