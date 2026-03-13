import Navbar from '../Components/Navbar';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
      <footer className="bg-gray-900 text-gray-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 40 40" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="url(#fg1)" />
                <ellipse cx="20" cy="20" rx="8" ry="18" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
                <line x1="2" y1="20" x2="38" y2="20" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
                <defs><linearGradient id="fg1" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#0ea5e9" /><stop offset="100%" stopColor="#075985" /></linearGradient></defs>
              </svg>
              <span className="font-bold text-white text-lg">GlobePlanner</span>
            </div>
            <p className="text-sm">&copy; 2025 GlobePlanner. Your travel companion.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
