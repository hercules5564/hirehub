import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../redux/slices/authSlice';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineBriefcase } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated, user } = useSelector((s) => s.auth);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated && user) {
      const dest = user.role === 'admin' ? '/admin/dashboard' : user.role === 'recruiter' ? '/recruiter/dashboard' : '/dashboard';
      navigate(from !== '/' ? from : dest, { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    dispatch(login(form));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-8 animate-pulse-glow">
            <HiOutlineBriefcase className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Welcome Back!</h2>
          <p className="text-lg text-gray-300 max-w-md">Sign in to access your dashboard, track applications, and discover new opportunities.</p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-dark-900">
        <div className="w-full max-w-md animate-fade-in">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <HiOutlineBriefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">HireHub</span>
          </Link>

          <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-2">Sign In</h1>
          <p className="text-dark-500 mb-8">Enter your credentials to access your account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-dark-50 dark:bg-dark-800 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-dark-50 dark:bg-dark-800 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600">
                  {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-dark-600 dark:text-dark-400">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-700">Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 gradient-primary text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-dark-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-700">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
