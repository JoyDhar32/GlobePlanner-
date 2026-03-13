import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import DestinationSearch from './DestinationSearch';

export default function TripPlannerForm({ initialDestination = '', initialPlaceId = '' }) {
  const { data, setData, post, processing, errors } = useForm({
    destination: initialDestination,
    destination_place_id: initialPlaceId,
    lat: null,
    lon: null,
    travelers: 2,
    duration_days: 7,
    category: 'standard',
    budget: 'medium',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/planner/generate');
  };

  const categories = [
    { value: 'standard', label: 'Standard', icon: '⭐', desc: 'Great value' },
    { value: 'premium', label: 'Premium', icon: '⭐⭐', desc: 'Enhanced comfort' },
    { value: 'luxury', label: 'Luxury', icon: '⭐⭐⭐', desc: 'Premium experience' },
  ];

  const budgets = [
    { value: 'low', label: 'Budget', range: '$50-100/day' },
    { value: 'medium', label: 'Moderate', range: '$100-250/day' },
    { value: 'high', label: 'High-end', range: '$250+/day' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Destination */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Where are you going?</label>
        <DestinationSearch
          value={data.destination}
          onChange={(val) => setData('destination', val)}
          onSelect={(s) => {
            setData(prev => ({
              ...prev,
              destination: s.description,
              destination_place_id: s.place_id,
              lat: s.lat ?? null,
              lon: s.lon ?? null,
            }));
          }}
          placeholder="Search destinations..."
        />
        {errors.destination && <p className="text-red-500 text-sm">{errors.destination}</p>}
      </div>

      {/* Travelers & Duration */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Travelers</label>
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button type="button" onClick={() => setData('travelers', Math.max(1, data.travelers - 1))}
              className="px-4 py-3 bg-gray-50 hover:bg-gray-100 font-bold text-gray-600 transition-colors">-</button>
            <span className="flex-1 text-center font-semibold text-gray-800">{data.travelers}</span>
            <button type="button" onClick={() => setData('travelers', Math.min(20, data.travelers + 1))}
              className="px-4 py-3 bg-gray-50 hover:bg-gray-100 font-bold text-gray-600 transition-colors">+</button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Duration (days)</label>
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button type="button" onClick={() => setData('duration_days', Math.max(1, data.duration_days - 1))}
              className="px-4 py-3 bg-gray-50 hover:bg-gray-100 font-bold text-gray-600 transition-colors">-</button>
            <span className="flex-1 text-center font-semibold text-gray-800">{data.duration_days}</span>
            <button type="button" onClick={() => setData('duration_days', Math.min(30, data.duration_days + 1))}
              className="px-4 py-3 bg-gray-50 hover:bg-gray-100 font-bold text-gray-600 transition-colors">+</button>
          </div>
        </div>
      </div>

      {/* Trip Category */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">Trip Style</label>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setData('category', c.value)}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                data.category === c.value
                  ? 'border-sky-500 bg-sky-50 text-sky-700'
                  : 'border-gray-200 hover:border-sky-200 text-gray-600'
              }`}
            >
              <div className="text-xl mb-1">{c.icon}</div>
              <div className="font-semibold text-sm">{c.label}</div>
              <div className="text-xs text-gray-500">{c.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">Budget Range</label>
        <div className="grid grid-cols-3 gap-3">
          {budgets.map((b) => (
            <button
              key={b.value}
              type="button"
              onClick={() => setData('budget', b.value)}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                data.budget === b.value
                  ? 'border-sky-500 bg-sky-50 text-sky-700'
                  : 'border-gray-200 hover:border-sky-200 text-gray-600'
              }`}
            >
              <div className="font-semibold text-sm">{b.label}</div>
              <div className="text-xs text-gray-500">{b.range}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={processing || !data.destination}
        className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {processing ? (
          <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
        ) : (
          <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Generate Trip Plan</>
        )}
      </button>
    </form>
  );
}
