import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../redux/slices/authSlice';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineUser, HiOutlineBriefcase, HiOutlineCheckCircle, HiOutlineArrowRight } from 'react-icons/hi';
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

  const perks = [
    'Smart job matching tuned to your skills',
    'One-click apply and real-time application tracking',
    'Free resume builder with ATS scoring',
  ];

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
            <span className="w-1.5 h-1.5 rounded-full bg-primary-600" />
            Join 50,000+ professionals
          </div>

          <h2 className="text-4xl font-bold text-ink-900 dark:text-white mb-4 leading-tight text-balance">
            Join <span className="text-primary-600 dark:text-primary-400">HireHub</span> today
          </h2>
          <p className="text-lg text-ink-600 dark:text-ink-400 mb-10">
            Start your journey today. Whether you're finding a job or hiring talent, we've got you covered.
          </p>

          <ul className="space-y-4">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3 text-ink-700 dark:text-ink-300">
                <span className="shrink-0 w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 mt-0.5">
                  <HiOutlineCheckCircle className="w-4 h-4" />
                </span>
                <span className="text-sm leading-relaxed">{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center"><HiOutlineBriefcase className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-bold text-ink-900 dark:text-white">HireHub</span>
          </Link>

          <h1 className="text-3xl font-bold text-ink-900 dark:text-white mb-2">Create your account</h1>
          <p className="text-ink-600 dark:text-ink-400 mb-8">Join the best job platform today</p>

          {/* Role Selector */}
          <div className="flex gap-3 mb-6">
            {[{ value: 'candidate', label: 'Candidate', desc: 'Find jobs' }, { value: 'recruiter', label: 'Recruiter', desc: 'Hire talent' }].map((r) => (
              <button key={r.value} type="button" onClick={() => setForm({ ...form, role: r.value })}
                className={`flex-1 p-4 rounded-lg border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 ${form.role === r.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-600/10'
                  : 'border-ink-300 dark:border-[#262c36] bg-white dark:bg-[#161b22] hover:bg-ink-50 dark:hover:bg-white/[0.04]'}`}>
                <p className="font-semibold text-ink-900 dark:text-white text-sm">{r.label}</p>
                <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">{r.desc}</p>
              </button>
            ))}
          </div>

          <div className="rounded-xl bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] p-6 sm:p-8 shadow-soft">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                  <input type="text" name="name" id="name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-ink-300 dark:border-[#262c36] bg-white dark:bg-[#0d1117] text-ink-900 dark:text-white placeholder-ink-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                    placeholder="John Doe" />
                </div>
              </div>
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
                  <input type={showPassword ? 'text' : 'password'} name="password" id="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-11 pr-11 py-2.5 rounded-lg border border-ink-300 dark:border-[#262c36] bg-white dark:bg-[#0d1117] text-ink-900 dark:text-white placeholder-ink-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                    placeholder="Min. 6 characters" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 transition-colors">
                    {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                  <input type="password" name="confirmPassword" id="confirmPassword" autoComplete="new-password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-ink-300 dark:border-[#262c36] bg-white dark:bg-[#0d1117] text-ink-900 dark:text-white placeholder-ink-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                    placeholder="••••••••" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-2.5 text-base rounded-lg font-semibold inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (<>Create Account <HiOutlineArrowRight className="w-5 h-5" /></>)}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-ink-600 dark:text-ink-400">
            Already have an account? <Link to="/login" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
