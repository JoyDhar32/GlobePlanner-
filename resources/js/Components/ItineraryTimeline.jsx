import { useState } from 'react';

export default function ItineraryTimeline({ itinerary }) {
  const colors = ['sky', 'violet', 'emerald', 'amber', 'rose', 'indigo', 'teal'];

  return (
    <div className="space-y-4">
      {itinerary.map((day, index) => {
        const color = colors[index % colors.length];
        return (
          <DayCard key={day.day} day={day} index={index} color={color} isLast={index === itinerary.length - 1} />
        );
      })}
    </div>
  );
}

function DayCard({ day, index, color, isLast }) {
  const [imgError, setImgError] = useState(false);

  const colorMap = {
    sky:     { dot: 'bg-sky-400',     ring: 'border-sky-400',     text: 'text-sky-600',     badge: 'bg-sky-100 text-sky-700' },
    violet:  { dot: 'bg-violet-400',  ring: 'border-violet-400',  text: 'text-violet-600',  badge: 'bg-violet-100 text-violet-700' },
    emerald: { dot: 'bg-emerald-400', ring: 'border-emerald-400', text: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
    amber:   { dot: 'bg-amber-400',   ring: 'border-amber-400',   text: 'text-amber-600',   badge: 'bg-amber-100 text-amber-700' },
    rose:    { dot: 'bg-rose-400',    ring: 'border-rose-400',    text: 'text-rose-600',    badge: 'bg-rose-100 text-rose-700' },
    indigo:  { dot: 'bg-indigo-400',  ring: 'border-indigo-400',  text: 'text-indigo-600',  badge: 'bg-indigo-100 text-indigo-700' },
    teal:    { dot: 'bg-teal-400',    ring: 'border-teal-400',    text: 'text-teal-600',    badge: 'bg-teal-100 text-teal-700' },
  };
  const c = colorMap[color];

  return (
    <div className="flex gap-4 group">
      {/* Timeline stem */}
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full bg-white border-2 ${c.ring} flex items-center justify-center flex-shrink-0 font-bold ${c.text} text-sm shadow-sm`}>
          {day.day}
        </div>
        {!isLast && <div className="w-0.5 bg-gray-200 flex-1 mt-1 min-h-6" />}
      </div>

      {/* Card */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow mb-4 overflow-hidden flex">
        {/* Left: content */}
        <div className="flex-1 p-5">
          <div className="flex items-start gap-2 mb-3">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${c.badge}`}>
              Day {day.day}
            </span>
          </div>
          <h4 className="font-bold text-gray-800 text-base mb-3 leading-snug">
            {day.title.replace(/^Day \d+ – /, '')}
          </h4>
          <ul className="space-y-2">
            {day.activities.map((activity, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className={`w-1.5 h-1.5 rounded-full ${c.dot} mt-1.5 flex-shrink-0`} />
                {activity}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: image */}
        {day.image_url && !imgError ? (
          <div className="w-36 sm:w-48 flex-shrink-0 relative overflow-hidden">
            <img
              src={day.image_url}
              alt={`Day ${day.day}`}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/10" />
          </div>
        ) : (
          <div className={`w-36 sm:w-48 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}>
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
