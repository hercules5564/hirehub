import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPasswordAPI } from '../services/api';
import { HiOutlineLockClosed, HiOutlineBriefcase } from 'react-icons/hi';
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-50 dark:bg-dark-900">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center"><HiOutlineBriefcase className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-bold gradient-text">HireHub</span>
          </Link>
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-2">Reset Password</h1>
          <p className="text-dark-500">Enter your new password below</p>
        </div>
        <div className="bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-dark-700">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">New Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-dark-50 dark:bg-dark-800 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Min 6 characters" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-dark-50 dark:bg-dark-800 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 gradient-primary text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
