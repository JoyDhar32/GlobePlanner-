import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function DestinationSearch({ value, onChange, onSelect, placeholder = 'Search destinations...', className = '' }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (input) => {
    if (input.length < 2) { setSuggestions([]); setOpen(false); return; }
    setLoading(true);
    try {
      const { data } = await axios.get('/api/places/autocomplete', { params: { input } });
      setSuggestions(data);
      setOpen(data.length > 0);
    } catch (e) {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const handleSelect = (suggestion) => {
    onChange(suggestion.description);
    setOpen(false);
    setSuggestions([]);
    onSelect && onSelect(suggestion);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent shadow-sm text-lg transition-all"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden">
          {suggestions.map((s, i) => (
            <button
              key={s.place_id || i}
              type="button"
              onClick={() => handleSelect(s)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-sky-50 transition-colors text-left group"
            >
              <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-sky-200 transition-colors">
                <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-800 text-sm">{s.main_text}</div>
                <div className="text-xs text-gray-500">{s.secondary_text}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
