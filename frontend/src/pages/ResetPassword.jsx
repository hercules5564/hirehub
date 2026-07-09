import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPasswordAPI } from '../services/api';
import { HiOutlineLockClosed, HiOutlineBriefcase, HiOutlineShieldCheck, HiOutlineKey } from 'react-icons/hi';
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
    <div className="min-h-screen flex bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300">
      {/* ===== Brand panel ===== */}
      <div className="hidden lg:flex relative w-1/2 overflow-hidden bg-ink-50 dark:bg-[#11161f] border-r border-ink-200 dark:border-[#262c36]">
        <div className="flex flex-col justify-between p-12 xl:p-16 w-full">
          <Link to="/" className="inline-flex items-center gap-2.5 w-fit">
            <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center">
              <HiOutlineBriefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-ink-900 dark:text-white">HireHub</span>
          </Link>

          <div className="max-w-md">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-ink-200 dark:border-[#262c36] bg-white dark:bg-[#161b22] mb-8 text-xs font-medium text-ink-600 dark:text-ink-400">
              <HiOutlineShieldCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" /> Secure password recovery
            </span>
            <h2 className="text-4xl xl:text-5xl font-bold leading-[1.1] mb-5 text-balance text-ink-900 dark:text-white">
              Almost there.<br />Set a <span className="text-primary-600 dark:text-primary-400">new password</span>
            </h2>
            <p className="text-lg text-ink-600 dark:text-ink-400 text-balance">
              Choose a strong, unique password to keep your account protected and get back to your job search.
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm text-ink-500 dark:text-ink-400">
            <span className="inline-flex items-center gap-1.5">
              <HiOutlineShieldCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" /> 256-bit encrypted
            </span>
            <span className="w-1 h-1 rounded-full bg-ink-300 dark:bg-ink-600"></span>
            <span>Trusted by 50,000+ professionals</span>
          </div>
        </div>
      </div>

      {/* ===== Form pane ===== */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center"><HiOutlineBriefcase className="w-5 h-5 text-white" /></div>
              <span className="text-xl font-bold text-ink-900 dark:text-white">HireHub</span>
            </Link>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary-50 dark:bg-primary-600/10 text-primary-600 dark:text-primary-400 mb-5">
              <HiOutlineKey className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-ink-900 dark:text-white mb-2">
              Reset <span className="text-primary-600 dark:text-primary-400">password</span>
            </h1>
            <p className="text-ink-600 dark:text-ink-400">Enter your new password below</p>
          </div>

          <div className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] p-8 rounded-xl shadow-soft">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">New Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-ink-300 dark:border-[#262c36] bg-white dark:bg-[#0d1117] text-ink-900 dark:text-white placeholder-ink-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition" placeholder="Min 6 characters" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                  <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-ink-300 dark:border-[#262c36] bg-white dark:bg-[#0d1117] text-ink-900 dark:text-white placeholder-ink-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition" placeholder="••••••••" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors disabled:opacity-50 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Reset Password'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-600 dark:text-ink-400">
              Remembered your password?{' '}
              <Link to="/login" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
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
