import { Link } from '@inertiajs/react';

export default function Logo({ size = 'md', withText = true, className = '' }) {
  const sizes = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-xl' },
    lg: { icon: 48, text: 'text-3xl' },
  };
  const s = sizes[size] || sizes.md;
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative" style={{ width: s.icon, height: s.icon }}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width={s.icon} height={s.icon}>
          <circle cx="20" cy="20" r="18" fill="url(#globeGradient)" />
          <ellipse cx="20" cy="20" rx="8" ry="18" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
          <line x1="2" y1="20" x2="38" y2="20" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
          <line x1="20" y1="2" x2="20" y2="38" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <ellipse cx="20" cy="20" rx="14" ry="18" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
          <path d="M28 12 L24 16 L26 22 L20 26 L14 22 L16 16 L12 12" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="28" cy="12" r="3" fill="#f97316" />
          <circle cx="28" cy="12" r="1.5" fill="#fff" />
          <defs>
            <linearGradient id="globeGradient" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#075985" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {withText && (
        <span className={`font-bold ${s.text} bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent`}>
          GlobePlanner
        </span>
      )}
    </Link>
  );
}
