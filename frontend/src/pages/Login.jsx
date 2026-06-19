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
    <div className="min-h-screen flex bg-[#030303] text-white">
      {/* Left - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden border-r border-white/[0.08]">
        {/* Floating gradient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-16 left-16 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-16 right-16 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-violet-500/15 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 mb-12 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] group-hover:scale-110 transition-transform">
              <HiOutlineBriefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">HireHub</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.1] mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
            </span>
            <span className="text-sm font-medium text-white/80">Welcome back to HireHub</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
            Your next big <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">opportunity</span> awaits.
          </h2>
          <p className="text-lg text-white/60 mb-10">
            Sign in to access your dashboard, track applications, and discover new opportunities.
          </p>

          <ul className="space-y-4">
            {[
              { icon: HiOutlineLightningBolt, text: 'AI-powered job matches tailored to you' },
              { icon: HiOutlineShieldCheck, text: 'Verified companies and quality listings' },
              { icon: HiOutlineSparkles, text: 'Resume ATS scoring built right in' },
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-white/70">
                <span className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-indigo-300 shrink-0">
                  <item.icon className="w-5 h-5" />
                </span>
                <span className="text-sm font-medium">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-rose-500/20 rounded-full blur-3xl"></div>
        </div>
        <div className="w-full max-w-md relative">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-[0_8px_24px_0_rgba(99,102,241,0.35)]">
              <HiOutlineBriefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">HireHub</span>
          </Link>

          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full mb-4">
              <HiOutlineSparkles className="w-4 h-4" /> Account Login
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Sign <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">In</span>
            </h1>
            <p className="text-white/60">Enter your credentials to access your account</p>
          </div>

          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.1] p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Email</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input type="email" name="email" id="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/[0.1] bg-white/[0.06] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none transition-all"
                    placeholder="you@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input type={showPassword ? 'text' : 'password'} name="password" id="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-11 pr-11 py-3 rounded-xl border border-white/[0.1] bg-white/[0.06] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none transition-all"
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-indigo-300 transition-colors">
                    {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-white/[0.2] bg-white/[0.06] text-indigo-500 focus:ring-indigo-400/60" />
                  <span className="text-sm text-white/60">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-indigo-300 hover:text-indigo-200 transition-colors">Forgot password?</Link>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-rose-500 text-white rounded-xl font-semibold shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Sign In <HiOutlineArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>
          </div>

          <p className="mt-8 text-center text-sm text-white/60">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-indigo-300 hover:text-indigo-200 transition-colors">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
