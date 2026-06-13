import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../redux/slices/authSlice';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineUser, HiOutlineBriefcase } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'candidate' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      const dest = user.role === 'recruiter' ? '/recruiter/dashboard' : '/dashboard';
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all fields');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    dispatch(register({ name: form.name, email: form.email, password: form.password, role: form.role }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-32 right-16 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-8 animate-pulse-glow">
            <HiOutlineBriefcase className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Join HireHub</h2>
          <p className="text-lg text-gray-300 max-w-md">Start your journey today. Whether you're finding a job or hiring talent, we've got you covered.</p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-dark-900">
        <div className="w-full max-w-md animate-fade-in">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center"><HiOutlineBriefcase className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-bold gradient-text">HireHub</span>
          </Link>

          <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-2">Create Account</h1>
          <p className="text-dark-500 mb-8">Join the best job platform today</p>

          {/* Role Selector */}
          <div className="flex gap-3 mb-6">
            {[{ value: 'candidate', label: '🎯 Candidate', desc: 'Find jobs' }, { value: 'recruiter', label: '🏢 Recruiter', desc: 'Hire talent' }].map((r) => (
              <button key={r.value} type="button" onClick={() => setForm({ ...form, role: r.value })}
                className={`flex-1 p-4 rounded-xl border-2 text-left transition-all ${form.role === r.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-dark-600 hover:border-gray-300'}`}>
                <p className="font-semibold text-dark-900 dark:text-white text-sm">{r.label}</p>
                <p className="text-xs text-dark-500 mt-0.5">{r.desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-dark-50 dark:bg-dark-800 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="John Doe" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-dark-50 dark:bg-dark-800 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-dark-50 dark:bg-dark-800 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="Min. 6 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400">
                  {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-dark-50 dark:bg-dark-800 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 gradient-primary text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-dark-500">
            Already have an account? <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
