import Logo from '../Components/Logo';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          {title && <h1 className="text-2xl font-bold text-gray-800">{title}</h1>}
          {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
