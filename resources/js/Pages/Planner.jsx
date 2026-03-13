import { useEffect, useState } from 'react';
import MainLayout from '../Layouts/MainLayout';
import TripPlannerForm from '../Components/TripPlannerForm';

export default function Planner() {
  const [initialDestination, setInitialDestination] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dest = params.get('destination');
    if (dest) setInitialDestination(dest);
  }, []);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Trip Planner
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Plan Your Dream Trip</h1>
            <p className="text-gray-500 text-lg">Tell us about your trip and we'll create a personalized travel plan just for you.</p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <TripPlannerForm initialDestination={initialDestination} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
