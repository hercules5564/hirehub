import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordAPI } from '../services/api';
import { HiOutlineMail, HiOutlineBriefcase } from 'react-icons/hi';
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-50 dark:bg-dark-900">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center"><HiOutlineBriefcase className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-bold gradient-text">HireHub</span>
          </Link>
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-2">Forgot Password?</h1>
          <p className="text-dark-500">Enter your email and we'll send you a reset link</p>
        </div>
        <div className="bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-dark-700">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <HiOutlineMail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">Check your email</h3>
              <p className="text-sm text-dark-500">We've sent a password reset link to <strong>{email}</strong></p>
              <Link to="/login" className="inline-block mt-6 text-sm font-semibold text-primary-600 hover:text-primary-700">← Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-dark-50 dark:bg-dark-800 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="you@example.com" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 gradient-primary text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Send Reset Link'}
              </button>
              <p className="text-center text-sm text-dark-500">
                Remember your password? <Link to="/login" className="font-semibold text-primary-600">Sign in</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
