export default function ItineraryTimeline({ itinerary }) {
  const colors = ['sky', 'violet', 'emerald', 'amber', 'rose', 'indigo', 'teal'];

  return (
    <div className="space-y-4">
      {itinerary.map((day, index) => {
        const color = colors[index % colors.length];
        return (
          <div key={day.day} className="flex gap-4 group">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full bg-${color}-100 border-2 border-${color}-400 flex items-center justify-center flex-shrink-0 font-bold text-${color}-600 text-sm shadow-sm`}>
                {day.day}
              </div>
              {index < itinerary.length - 1 && <div className="w-0.5 bg-gray-200 flex-1 mt-1 min-h-6" />}
            </div>
            <div className={`flex-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow mb-4`}>
              <h4 className="font-bold text-gray-800 text-base mb-3">{day.title}</h4>
              <ul className="space-y-2">
                {day.activities.map((activity, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className={`w-1.5 h-1.5 rounded-full bg-${color}-400 mt-1.5 flex-shrink-0`} />
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
