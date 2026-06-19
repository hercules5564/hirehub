import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPasswordAPI } from '../services/api';
import { HiOutlineLockClosed, HiOutlineBriefcase, HiOutlineShieldCheck, HiOutlineSparkles, HiOutlineKey } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await resetPasswordAPI(token, { password: form.password });
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-[#030303] text-white">
      {/* ===== Decorative pane ===== */}
      <div className="hidden lg:flex relative w-1/2 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-24 left-12 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-16 right-10 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <Link to="/" className="inline-flex items-center gap-2.5 w-fit">
            <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center">
              <HiOutlineBriefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">HireHub</span>
          </Link>

          <div className="max-w-md">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.1] mb-8 text-sm font-medium text-white/70">
              <HiOutlineShieldCheck className="w-4 h-4 text-indigo-400" /> Secure password recovery
            </span>
            <h2 className="text-4xl xl:text-5xl font-extrabold leading-[1.1] mb-5 text-balance">
              Almost there.<br />Set a <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">new password</span>
            </h2>
            <p className="text-lg text-white/60 text-balance">
              Choose a strong, unique password to keep your account protected and get back to your job search.
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-white/50">
            <span className="inline-flex items-center gap-1.5">
              <HiOutlineSparkles className="w-4 h-4 text-indigo-300" /> 256-bit encrypted
            </span>
            <span className="w-1 h-1 rounded-full bg-white/30"></span>
            <span>Trusted by 50,000+ professionals</span>
          </div>
        </div>
      </div>

      {/* ===== Form pane ===== */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute -top-20 right-0 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center"><HiOutlineBriefcase className="w-5 h-5 text-white" /></div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">HireHub</span>
            </Link>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] mb-5">
              <HiOutlineKey className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Reset <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">Password</span>
            </h1>
            <p className="text-white/60">Enter your new password below</p>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.1] p-8 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">New Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/[0.1] bg-white/[0.06] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none transition-shadow" placeholder="Min 6 characters" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/[0.1] bg-white/[0.06] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none transition-shadow" placeholder="••••••••" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-rose-500 text-white font-semibold shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Reset Password'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-white/60">
              Remembered your password?{' '}
              <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
