import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import MainLayout from '../Layouts/MainLayout';
import AttractionCard from '../Components/AttractionCard';
import HotelCard from '../Components/HotelCard';
import ItineraryTimeline from '../Components/ItineraryTimeline';

export default function TripResults({ trip, tripData, formData, isSharedView = false }) {
  const { auth } = usePage().props;
  const [savedItinerary, setSavedItinerary] = useState(false);
  const [wishlisted, setWishlisted] = useState(trip?.wishlisted || false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shareLoading, setShareLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSaveItinerary = () => {
    setSavedItinerary(true);
    setTimeout(() => setSavedItinerary(false), 3000);
  };

  const handleShare = async () => {
    if (!trip) return;
    setShareLoading(true);
    try {
      const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
      const { data } = await axios.post(`/trips/${trip.id}/share`, {}, {
        headers: { 'X-CSRF-TOKEN': csrf },
      });
      setShareUrl(data.url);
      setShareModal(true);
    } catch (e) {
      console.error(e);
    } finally {
      setShareLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
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
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Share button — visible when trip is saved */}
                {auth?.user && trip && (
                  <button
                    onClick={handleShare}
                    disabled={shareLoading}
                    title="Share this trip"
                    className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-all shadow-md"
                  >
                    {shareLoading
                      ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                      : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    }
                    Share
                  </button>
                )}
                {/* Wishlist button */}
                {auth?.user && trip && (
                  <button
                    onClick={handleWishlist}
                    disabled={wishlistLoading}
                    title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all shadow-md ${
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

      {/* Share Modal */}
      {shareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShareModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-[fadeIn_0.2s_ease]">
            {/* Close */}
            <button
              onClick={() => setShareModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Share This Trip</h3>
                <p className="text-sm text-gray-500">Anyone with the link can view this plan</p>
              </div>
            </div>

            {/* Trip info pill */}
            <div className="bg-gray-50 rounded-2xl px-4 py-3 mb-5 flex items-center gap-3">
              <span className="text-2xl">✈️</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{formData.destination}</p>
                <p className="text-xs text-gray-400">{formData.duration_days} days · {formData.travelers} traveller{formData.travelers > 1 ? 's' : ''} · {formData.category}</p>
              </div>
            </div>

            {/* URL box */}
            <div className="flex gap-2 mb-5">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 font-mono focus:outline-none select-all"
                onClick={e => e.target.select()}
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-sky-500 hover:bg-sky-600 text-white'
                }`}
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>

            {/* Share via */}
            <div>
              <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wide">Share via</p>
              {/* Row 1 */}
              <div className="flex gap-2 mb-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent('Check out my trip plan for ' + formData.destination + ': ' + shareUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 font-semibold text-xs py-2.5 rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs py-2.5 rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent('My trip plan: ' + formData.destination)}&body=${encodeURIComponent('Check out my trip plan on GlobePlanner:\n\n' + shareUrl)}`}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-xs py-2.5 rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Planning a trip to ' + formData.destination + '!')}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-xs py-2.5 rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  X
                </a>
              </div>
              {/* Row 2 — Instagram & TikTok (no web share URL, copy link) */}
              <div className="flex gap-2">
                <button
                  onClick={() => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2500); }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-pink-700 font-semibold text-xs py-2.5 rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Copy for Instagram
                </button>
                <button
                  onClick={() => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2500); }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-800 font-semibold text-xs py-2.5 rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
                  </svg>
                  Copy for TikTok
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">Instagram & TikTok: paste the copied link in your bio or story</p>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
