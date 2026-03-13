import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import MainLayout from '../Layouts/MainLayout';

const categoryColors = {
  standard: 'bg-sky-100 text-sky-700',
  premium:  'bg-violet-100 text-violet-700',
  luxury:   'bg-amber-100 text-amber-700',
};

const budgetLabels = { low: 'Budget', medium: 'Moderate', high: 'High-end' };

function TripCard({ trip, onWishlistToggle, onDelete }) {
  const [wishlisted, setWishlisted] = useState(trip.wishlisted);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const csrf = () => document.querySelector('meta[name="csrf-token"]')?.content;

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (toggling) return;
    setToggling(true);
    try {
      const { data } = await axios.post(`/trips/${trip.id}/wishlist`, {}, { headers: { 'X-CSRF-TOKEN': csrf() } });
      setWishlisted(data.wishlisted);
      onWishlistToggle && onWishlistToggle(trip.id, data.wishlisted);
    } catch (e) { console.error(e); }
    finally { setToggling(false); }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    try {
      await axios.delete(`/trips/${trip.id}`, { headers: { 'X-CSRF-TOKEN': csrf() } });
      onDelete && onDelete(trip.id);
    } catch (e) { console.error(e); setDeleting(false); }
  };

  const handleView = () => router.visit(`/trips/${trip.id}`);
  const seed = trip.destination.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12) || 'travel';

  return (
    <div
      onClick={handleView}
      onMouseLeave={() => setConfirmDelete(false)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
    >
      <div className="relative h-36 overflow-hidden">
        <img
          src={`https://picsum.photos/seed/${seed}/600/300`}
          alt={trip.destination}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex gap-1.5" onClick={e => e.stopPropagation()}>
          <button
            onClick={handleWishlist}
            disabled={toggling}
            title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-md ${
              wishlisted ? 'bg-rose-500 text-white' : 'bg-white/90 text-gray-400 hover:text-rose-500'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            title={confirmDelete ? 'Click again to confirm' : 'Remove trip'}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-md ${
              confirmDelete ? 'bg-red-500 text-white animate-pulse' : 'bg-white/90 text-gray-400 hover:text-red-500'
            }`}
          >
            {deleting
              ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
              : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            }
          </button>
        </div>
        <div className="absolute bottom-3 left-3 right-20">
          <h3 className="font-bold text-white text-sm leading-tight truncate">{trip.destination}</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${categoryColors[trip.category] || 'bg-gray-100 text-gray-600'}`}>
            {trip.category}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{trip.duration_days}d</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{trip.travelers} pax</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{budgetLabels[trip.budget]}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {new Date(trip.created_at).toLocaleDateString('en-AU', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="text-xs font-semibold text-sky-600 flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
            View
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ trips: initialTrips = [] }) {
  const [trips, setTrips] = useState(initialTrips);
  const [activeTab, setActiveTab] = useState('history');
  const [search, setSearch] = useState('');

  const wishlistTrips = trips.filter(t => t.wishlisted);

  const filterTrips = (list) => {
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(t =>
      t.destination.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      (budgetLabels[t.budget] || '').toLowerCase().includes(q)
    );
  };

  const displayed = filterTrips(activeTab === 'wishlist' ? wishlistTrips : trips);

  const handleWishlistToggle = (tripId, wishlisted) => {
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, wishlisted } : t));
  };

  const handleDelete = (tripId) => {
    setTrips(prev => prev.filter(t => t.id !== tripId));
  };

  const stats = [
    { label: 'Trips Planned',  value: trips.length,                                                    icon: '🗺️', color: 'from-sky-400 to-blue-500' },
    { label: 'Destinations',   value: [...new Set(trips.map(t => t.destination.split(',')[0]))].length, icon: '📍', color: 'from-violet-400 to-purple-500' },
    { label: 'Total Days',     value: trips.reduce((s, t) => s + (t.duration_days || 0), 0),           icon: '📅', color: 'from-emerald-400 to-teal-500' },
    { label: 'Wishlisted',     value: wishlistTrips.length,                                             icon: '❤️', color: 'from-rose-400 to-pink-500' },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">My Travel Dashboard</h1>
              <p className="text-gray-500 mt-1">Your trips, history, and wishlist in one place</p>
            </div>
            <Link
              href="/planner"
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-md self-start sm:self-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Plan New Trip
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl shadow-sm flex-shrink-0`}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs + Content */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-gray-100">
              {[
                { id: 'history',  label: 'Search History', count: trips.length,          icon: 'clock' },
                { id: 'wishlist', label: 'Wishlist',        count: wishlistTrips.length,  icon: 'heart' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? 'border-sky-500 text-sky-600 bg-sky-50/40'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon === 'heart' ? (
                    <svg className="w-4 h-4" fill={activeTab === tab.id ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {tab.label}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    activeTab === tab.id ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>{tab.count}</span>
                </button>
              ))}
            </div>

            {/* Search bar */}
            <div className="px-6 pt-5 pb-0">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search trips by destination, category..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-gray-50"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {displayed.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">{search ? '🔍' : activeTab === 'wishlist' ? '❤️' : '🌍'}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {search ? `No results for "${search}"` : activeTab === 'wishlist' ? 'No wishlist items yet' : 'No trips planned yet'}
                  </h3>
                  <p className="text-gray-500 mb-6 text-sm">
                    {search
                      ? 'Try a different search term'
                      : activeTab === 'wishlist'
                      ? 'Click the ❤️ heart on any trip result to save it to your wishlist'
                      : 'Start planning your first adventure!'}
                  </p>
                  {!search && (
                    <Link href="/planner" className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors text-sm">
                      Plan a Trip
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-400 mb-5">
                    {displayed.length} {activeTab === 'wishlist' ? 'wishlisted' : 'planned'} trip{displayed.length !== 1 ? 's' : ''}
                    {activeTab === 'history' && ' — click any card to view saved results'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {displayed.map(trip => (
                      <TripCard key={trip.id} trip={trip} onWishlistToggle={handleWishlistToggle} onDelete={handleDelete} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
