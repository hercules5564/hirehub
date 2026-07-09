import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordAPI } from '../services/api';
import { HiOutlineMail, HiOutlineBriefcase, HiOutlineArrowLeft, HiOutlineCheckCircle, HiOutlineLockClosed, HiOutlineShieldCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    setLoading(true);
    try {
      await forgotPasswordAPI({ email });
      setSent(true);
      toast.success('Reset link sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
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
            <HiOutlineShieldCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" /> Secure recovery
          </div>
          <h2 className="text-4xl font-bold text-ink-900 dark:text-white mb-4 text-balance">
            Reset your <span className="text-primary-600 dark:text-primary-400">password</span>
          </h2>
          <p className="text-lg text-ink-600 dark:text-ink-400 max-w-md text-balance">
            No worries, it happens. We'll email you a secure link to set a brand-new password and get you back to your dashboard in no time.
          </p>
          <div className="mt-10 flex flex-col gap-3">
            {[
              { icon: HiOutlineMail, text: 'Link sent straight to your inbox' },
              { icon: HiOutlineLockClosed, text: 'Encrypted, one-time secure reset' },
              { icon: HiOutlineShieldCheck, text: 'Your account stays protected' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-lg px-4 py-3">
                <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-sm text-ink-700 dark:text-ink-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center justify-center lg:justify-start gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center">
              <HiOutlineBriefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-ink-900 dark:text-white">HireHub</span>
          </Link>

          <div className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] p-8 rounded-xl shadow-soft">
            {sent ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400">
                  <HiOutlineCheckCircle className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-bold text-ink-900 dark:text-white mb-2">Check your email</h3>
                <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed">
                  We've sent a password reset link to
                </p>
                <p className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary-50 dark:bg-primary-600/10 text-sm font-semibold text-primary-700 dark:text-primary-300">
                  <HiOutlineMail className="w-4 h-4" /> {email}
                </p>
                <p className="mt-4 text-xs text-ink-500 dark:text-ink-400">Didn't get it? Check your spam folder or try again in a few minutes.</p>
                <Link to="/login" className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                  <HiOutlineArrowLeft className="w-4 h-4" /> Back to Login
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-7 text-center lg:text-left">
                  <h1 className="text-3xl font-bold text-ink-900 dark:text-white mb-2">Forgot password?</h1>
                  <p className="text-ink-600 dark:text-ink-400">Enter your email and we'll send you a reset link</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Email Address</label>
                    <div className="relative">
                      <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-ink-300 dark:border-[#262c36] bg-white dark:bg-[#0d1117] text-ink-900 dark:text-white placeholder-ink-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                        placeholder="you@example.com" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-2.5 rounded-lg flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors disabled:opacity-50">
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Send Reset Link'}
                  </button>
                  <p className="text-center text-sm text-ink-600 dark:text-ink-400">
                    Remember your password? <Link to="/login" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">Sign in</Link>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
