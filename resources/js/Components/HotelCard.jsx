import { useState } from 'react';

export default function HotelCard({ hotel, destination }) {
  const [imgError, setImgError] = useState(false);

  const handleBook = () => {
    const query = encodeURIComponent(`book ${hotel.name} ${destination || ''} hotel`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank', 'noopener');
  };

  const stars = Array.from({ length: hotel.stars || 0 }, (_, i) => i);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-52 overflow-hidden">
        {!imgError ? (
          <img
            src={hotel.image_url}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
            <svg className="w-16 h-16 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <svg className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          <span className="text-xs font-bold text-gray-700">{hotel.rating}</span>
        </div>
        <div className="absolute bottom-3 left-3">
          <div className="flex gap-0.5">
            {stars.map((_, i) => (
              <svg key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            ))}
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-800 text-lg mb-1">{hotel.name}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{hotel.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(hotel.amenities || []).slice(0, 4).map((a, i) => (
            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{a}</span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-sky-600">${hotel.price_per_night}</span>
            <span className="text-gray-400 text-sm">/night</span>
          </div>
          <button
            onClick={handleBook}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all bg-sky-500 hover:bg-sky-600 text-white shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"/>
            </svg>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
