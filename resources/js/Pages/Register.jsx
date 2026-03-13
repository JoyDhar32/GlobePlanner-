import { useForm, Link } from '@inertiajs/react';
import AuthLayout from '../Layouts/AuthLayout';

export default function Register() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/register');
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join GlobePlanner and start exploring the world">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
            placeholder="Your name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
            placeholder="your@email.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
          <input
            type="password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
            placeholder="Min 8 characters"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
          <input
            type="password"
            value={data.password_confirmation}
            onChange={(e) => setData('password_confirmation', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={processing}
          className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3.5 rounded-xl font-bold hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {processing ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating...</> : 'Create Account'}
        </button>
        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-sky-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
