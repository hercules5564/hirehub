import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../redux/slices/authSlice';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineUser, HiOutlineBriefcase, HiOutlineSparkles, HiOutlineCheckCircle, HiOutlineArrowRight } from 'react-icons/hi';
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
    'AI-powered job matching tuned to your skills',
    'One-click apply and real-time application tracking',
    'Free resume builder with ATS scoring',
  ];

  return (
    <div className="min-h-screen flex bg-[#030303] text-white">
      {/* Left - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden border-r border-white/[0.08]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-16 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-24 right-12 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-violet-500/15 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.1] mb-8">
            <HiOutlineSparkles className="w-4 h-4 text-indigo-300" />
            <span className="text-sm font-medium text-white">Join 50,000+ professionals</span>
          </div>

          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center mb-8 shadow-[0_8px_24px_0_rgba(99,102,241,0.35)]">
            <HiOutlineBriefcase className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Join <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">HireHub</span> today
          </h2>
          <p className="text-lg text-white/60 mb-10">
            Start your journey today. Whether you're finding a job or hiring talent, we've got you covered.
          </p>

          <ul className="space-y-4">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3 text-white/70">
                <span className="shrink-0 w-7 h-7 rounded-lg bg-white/[0.06] border border-white/[0.1] flex items-center justify-center mt-0.5">
                  <HiOutlineCheckCircle className="w-4 h-4 text-indigo-300" />
                </span>
                <span className="text-sm leading-relaxed">{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-[#030303] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
          <div className="absolute top-10 -left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 -right-10 w-72 h-72 bg-rose-500/20 rounded-full blur-3xl"></div>
        </div>
        <div className="w-full max-w-md relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-[0_8px_24px_0_rgba(99,102,241,0.35)]"><HiOutlineBriefcase className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">HireHub</span>
          </Link>

          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full mb-4">
            <HiOutlineSparkles className="w-4 h-4" /> Get Started
          </span>
          <h1 className="text-3xl font-bold text-white mb-2">Create your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">account</span></h1>
          <p className="text-white/60 mb-8">Join the best job platform today</p>

          {/* Role Selector */}
          <div className="flex gap-3 mb-6">
            {[{ value: 'candidate', label: 'Candidate', desc: 'Find jobs' }, { value: 'recruiter', label: 'Recruiter', desc: 'Hire talent' }].map((r) => (
              <button key={r.value} type="button" onClick={() => setForm({ ...form, role: r.value })}
                className={`flex-1 p-4 rounded-xl border text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303] ${form.role === r.value
                  ? 'border-indigo-400/60 bg-indigo-500/15 shadow-[0_8px_24px_0_rgba(99,102,241,0.35)]'
                  : 'border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.2]'}`}>
                <p className="font-semibold text-white text-sm">{r.label}</p>
                <p className="text-xs text-white/50 mt-0.5">{r.desc}</p>
              </button>
            ))}
          </div>

          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.1] p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Full Name</label>
                <div className="relative group">
                  <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-indigo-300 transition-colors" />
                  <input type="text" name="name" id="name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/[0.1] bg-white/[0.06] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none transition-all"
                    placeholder="John Doe" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Email</label>
                <div className="relative group">
                  <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-indigo-300 transition-colors" />
                  <input type="email" name="email" id="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/[0.1] bg-white/[0.06] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none transition-all"
                    placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
                <div className="relative group">
                  <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-indigo-300 transition-colors" />
                  <input type={showPassword ? 'text' : 'password'} name="password" id="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-11 pr-11 py-3 rounded-xl border border-white/[0.1] bg-white/[0.06] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none transition-all"
                    placeholder="Min. 6 characters" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-indigo-300 transition-colors">
                    {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Confirm Password</label>
                <div className="relative group">
                  <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-indigo-300 transition-colors" />
                  <input type="password" name="confirmPassword" id="confirmPassword" autoComplete="new-password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/[0.1] bg-white/[0.06] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none transition-all"
                    placeholder="••••••••" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 text-base rounded-xl font-semibold inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (<>Create Account <HiOutlineArrowRight className="w-5 h-5" /></>)}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-white/60">
            Already have an account? <Link to="/login" className="font-semibold text-indigo-300 hover:text-indigo-200 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
