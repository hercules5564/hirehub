import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordAPI } from '../services/api';
import { HiOutlineMail, HiOutlineBriefcase, HiOutlineArrowLeft, HiOutlineCheckCircle, HiOutlineLockClosed, HiOutlineShieldCheck, HiOutlineKey } from 'react-icons/hi';
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
    <div className="min-h-screen flex bg-[#030303] text-white">
      {/* Left - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-24 left-16 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-16 right-20 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center mx-auto mb-8 shadow-[0_8px_24px_0_rgba(99,102,241,0.35)]">
            <HiOutlineKey className="w-10 h-10 text-white" />
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 border border-white/[0.1] px-3 py-1 rounded-full mb-5">
            <HiOutlineShieldCheck className="w-4 h-4" /> Secure Recovery
          </span>
          <h2 className="text-4xl font-bold text-white mb-4 text-balance">Reset Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">Password</span></h2>
          <p className="text-lg text-white/60 max-w-md text-balance">
            No worries, it happens. We'll email you a secure link to set a brand-new password and get you back to your dashboard in no time.
          </p>
          <div className="mt-10 flex flex-col gap-3 text-left">
            {[
              { icon: HiOutlineMail, text: 'Link sent straight to your inbox' },
              { icon: HiOutlineLockClosed, text: 'Encrypted, one-time secure reset' },
              { icon: HiOutlineShieldCheck, text: 'Your account stays protected' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-white/70">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
          <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-rose-500/20 rounded-full blur-3xl"></div>
        </div>
        <div className="w-full max-w-md relative z-10">
          <Link to="/" className="flex items-center justify-center lg:justify-start gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-[0_8px_24px_0_rgba(99,102,241,0.35)]">
              <HiOutlineBriefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">HireHub</span>
          </Link>

          <div className="bg-white/[0.03] border border-white/[0.1] p-8 rounded-2xl">
            {sent ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-[0_8px_24px_0_rgba(99,102,241,0.35)]">
                  <HiOutlineCheckCircle className="w-9 h-9 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Check your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">email</span></h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  We've sent a password reset link to
                </p>
                <p className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/15 text-sm font-semibold text-indigo-300">
                  <HiOutlineMail className="w-4 h-4" /> {email}
                </p>
                <p className="mt-4 text-xs text-white/50">Didn't get it? Check your spam folder or try again in a few minutes.</p>
                <Link to="/login" className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                  <HiOutlineArrowLeft className="w-4 h-4" /> Back to Login
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-7 text-center lg:text-left">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full mb-3">
                    <HiOutlineKey className="w-4 h-4" /> Account Recovery
                  </span>
                  <h1 className="text-3xl font-bold text-white mb-2">Forgot <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">Password?</span></h1>
                  <p className="text-white/60">Enter your email and we'll send you a reset link</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Email Address</label>
                    <div className="relative">
                      <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/[0.1] bg-white/[0.06] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 focus:border-transparent outline-none transition-all"
                        placeholder="you@example.com" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-3 rounded-xl flex items-center justify-center bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100">
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Send Reset Link'}
                  </button>
                  <p className="text-center text-sm text-white/60">
                    Remember your password? <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">Sign in</Link>
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
