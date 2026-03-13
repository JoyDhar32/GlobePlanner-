import { useState } from 'react';
import axios from 'axios';

export default function BookingModal({ isOpen, onClose, item, type, tripId }) {
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [bookingRef, setBookingRef] = useState('');

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setStatus('loading');
    try {
      if (tripId) {
        const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
        await axios.post('/bookings', {
          trip_id: tripId,
          type,
          item_name: item?.name || item?.title || 'Booking',
          estimated_price: item?.price_per_night || null,
          details: item,
        }, { headers: { 'X-CSRF-TOKEN': csrf } });
      }
      const ref = 'GP-' + Math.random().toString(36).substr(2, 8).toUpperCase();
      setBookingRef(ref);
      setStatus('success');
    } catch (e) {
      setStatus('error');
    }
  };

  const handleClose = () => {
    setStatus('idle');
    setBookingRef('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
        {status === 'success' ? (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
            <p className="text-gray-500 mb-4">Your {type} has been successfully reserved.</p>
            <div className="bg-sky-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-500">Booking Reference</p>
              <p className="text-2xl font-bold text-sky-600">{bookingRef}</p>
            </div>
            <button onClick={handleClose} className="w-full bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600 transition-colors">
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Confirm Booking</h3>
              <button onClick={handleClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">{type}</p>
              <p className="font-bold text-gray-800 text-lg">{item?.name || item?.title}</p>
              {item?.price_per_night && <p className="text-sky-600 font-semibold mt-1">${item.price_per_night}/night</p>}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-sm text-amber-700">
              This is a simulated booking for trip planning purposes only. No actual payment will be processed.
            </div>
            {status === 'error' && <p className="text-red-500 text-sm mb-4">Something went wrong. Please try again.</p>}
            <div className="flex gap-3">
              <button onClick={handleClose} className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleConfirm} disabled={status === 'loading'}
                className="flex-1 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {status === 'loading' ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</> : 'Confirm Booking'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
