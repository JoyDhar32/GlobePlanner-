import { useForm, Link } from '@inertiajs/react';
import AuthLayout from '../Layouts/AuthLayout';

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your GlobePlanner account">
      <form onSubmit={handleSubmit} className="space-y-5">
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
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember"
            checked={data.remember}
            onChange={(e) => setData('remember', e.target.checked)}
            className="w-4 h-4 rounded text-sky-500"
          />
          <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
        </div>
        <button
          type="submit"
          disabled={processing}
          className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3.5 rounded-xl font-bold hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {processing ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing in...</> : 'Sign In'}
        </button>
        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-sky-600 font-semibold hover:underline">Create one free</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
