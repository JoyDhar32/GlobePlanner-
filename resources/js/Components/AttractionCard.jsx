import { useState } from 'react';

export default function AttractionCard({ attraction, destination }) {
  const [imgError, setImgError] = useState(false);

  const handleSearch = () => {
    const query = encodeURIComponent(`${attraction.name} ${destination || ''} tickets`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank', 'noopener');
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-48 overflow-hidden">
        {!imgError ? (
          <img
            src={attraction.image_url}
            alt={attraction.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center">
            <svg className="w-16 h-16 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-sky-600 text-xs font-semibold px-3 py-1 rounded-full">
            {attraction.type}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <svg className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs font-bold text-gray-700">{attraction.rating}</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-800 text-lg mb-1">{attraction.name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{attraction.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {attraction.duration}
          </span>
          <span className="font-semibold text-sky-600">{attraction.price}</span>
        </div>
        <button
          onClick={handleSearch}
          className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all bg-sky-50 hover:bg-sky-500 text-sky-600 hover:text-white flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"/>
          </svg>
          Search on Google
        </button>
      </div>
    </div>
  );
}
