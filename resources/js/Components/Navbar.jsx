import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Logo from './Logo';

export default function Navbar() {
  const { auth } = usePage().props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo size="md" />
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-sky-600 font-medium transition-colors">Home</Link>
            <Link href="/planner" className="text-gray-600 hover:text-sky-600 font-medium transition-colors">Plan Trip</Link>
            {auth?.user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-sky-600 font-medium transition-colors">Dashboard</Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-sky-600 font-medium transition-colors"
                >
                  Logout
                </button>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{auth.user.name}</span>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-sky-600 font-medium transition-colors">Login</Link>
                <Link href="/register" className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-full font-semibold transition-all shadow-md hover:shadow-lg">
                  Get Started
                </Link>
              </>
            )}
          </div>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-2">
            <Link href="/" className="block px-4 py-2 text-gray-600 hover:bg-sky-50 hover:text-sky-600 rounded-lg font-medium" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/planner" className="block px-4 py-2 text-gray-600 hover:bg-sky-50 hover:text-sky-600 rounded-lg font-medium" onClick={() => setMobileOpen(false)}>Plan Trip</Link>
            {auth?.user ? (
              <>
                <Link href="/dashboard" className="block px-4 py-2 text-gray-600 hover:bg-sky-50 hover:text-sky-600 rounded-lg font-medium" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-sky-50 hover:text-sky-600 rounded-lg font-medium">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-2 text-gray-600 hover:bg-sky-50 hover:text-sky-600 rounded-lg font-medium" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link href="/register" className="block px-4 py-2 bg-sky-500 text-white rounded-lg font-semibold text-center" onClick={() => setMobileOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
