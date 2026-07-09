import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../redux/slices/authSlice';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineBriefcase, HiOutlineSparkles, HiOutlineShieldCheck, HiOutlineLightningBolt, HiOutlineArrowRight } from 'react-icons/hi';
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
    <div className="min-h-screen flex bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300">
      {/* Left - Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-ink-50 dark:bg-[#11161f] border-r border-ink-200 dark:border-[#262c36]">
        <div className="max-w-md">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-12">
            <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center">
              <HiOutlineBriefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-ink-900 dark:text-white">HireHub</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-ink-200 dark:border-[#262c36] bg-white dark:bg-[#161b22] text-xs font-medium text-ink-600 dark:text-ink-400 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Welcome back to HireHub
          </div>

          <h2 className="text-4xl font-bold text-ink-900 dark:text-white leading-tight mb-5 text-balance">
            Your next big <span className="text-primary-600 dark:text-primary-400">opportunity</span> awaits.
          </h2>
          <p className="text-lg text-ink-600 dark:text-ink-400 mb-10">
            Sign in to access your dashboard, track applications, and discover new opportunities.
          </p>

          <ul className="space-y-4">
            {[
              { icon: HiOutlineLightningBolt, text: 'Smart job matches tailored to you' },
              { icon: HiOutlineShieldCheck, text: 'Verified companies and quality listings' },
              { icon: HiOutlineSparkles, text: 'Resume ATS scoring built right in' },
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-ink-700 dark:text-ink-300">
                <span className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                  <item.icon className="w-5 h-5" />
                </span>
                <span className="text-sm font-medium">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center">
              <HiOutlineBriefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-ink-900 dark:text-white">HireHub</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ink-900 dark:text-white mb-2">Sign in</h1>
            <p className="text-ink-600 dark:text-ink-400">Enter your credentials to access your account</p>
          </div>

          <div className="rounded-xl bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] p-6 sm:p-8 shadow-soft">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Email</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                  <input type="email" name="email" id="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-ink-300 dark:border-[#262c36] bg-white dark:bg-[#0d1117] text-ink-900 dark:text-white placeholder-ink-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                    placeholder="you@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                  <input type={showPassword ? 'text' : 'password'} name="password" id="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-11 pr-11 py-2.5 rounded-lg border border-ink-300 dark:border-[#262c36] bg-white dark:bg-[#0d1117] text-ink-900 dark:text-white placeholder-ink-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 transition-colors">
                    {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-ink-300 dark:border-[#262c36] text-primary-600 focus:ring-primary-500/30" />
                  <span className="text-sm text-ink-600 dark:text-ink-400">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">Forgot password?</Link>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Sign In <HiOutlineArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>
          </div>

          <p className="mt-8 text-center text-sm text-ink-600 dark:text-ink-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
