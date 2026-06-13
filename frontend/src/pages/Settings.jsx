import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../redux/slices/themeSlice';
import { changePasswordAPI } from '../services/api';
import { HiOutlineMoon, HiOutlineSun, HiOutlineLockClosed } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Settings = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((s) => s.theme);
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirmPassword) return toast.error('Passwords do not match');
    if (pw.newPassword.length < 6) return toast.error('Min 6 characters');
    setSaving(true);
    try {
      await changePasswordAPI({ currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      toast.success('Password changed!');
      setPw({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900 pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-8 animate-fade-in">Settings</h1>

        {/* Theme */}
        <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700 mb-6 animate-fade-in">
          <h3 className="font-bold text-dark-900 dark:text-white mb-4">Appearance</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-dark-900 dark:text-white">Dark Mode</p>
              <p className="text-xs text-dark-500">Toggle dark/light theme</p>
            </div>
            <button onClick={() => dispatch(toggleTheme())}
              className={`w-14 h-7 rounded-full flex items-center px-1 transition-colors ${mode === 'dark' ? 'bg-primary-500' : 'bg-gray-300'}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center transform transition-transform ${mode === 'dark' ? 'translate-x-7' : ''}`}>
                {mode === 'dark' ? <HiOutlineMoon className="w-3 h-3 text-primary-600" /> : <HiOutlineSun className="w-3 h-3 text-yellow-500" />}
              </div>
            </button>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700 animate-fade-in">
          <h3 className="font-bold text-dark-900 dark:text-white mb-4 flex items-center gap-2"><HiOutlineLockClosed className="w-5 h-5" /> Change Password</h3>
          <form onSubmit={handlePassword} className="space-y-4">
            {[{ label: 'Current Password', key: 'currentPassword' }, { label: 'New Password', key: 'newPassword' }, { label: 'Confirm New Password', key: 'confirmPassword' }].map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">{f.label}</label>
                <input type="password" value={pw[f.key]} onChange={(e) => setPw({ ...pw, [f.key]: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-dark-50 dark:bg-dark-700 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
              </div>
            ))}
            <button type="submit" disabled={saving} className="btn-primary w-full justify-center">
              {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
