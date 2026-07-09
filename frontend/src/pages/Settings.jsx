import { useState } from 'react';
import { changePasswordAPI } from '../services/api';
import { HiOutlineLockClosed, HiOutlineShieldCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';

const inputClass = 'w-full rounded-lg border border-ink-300 dark:border-[#262c36] bg-white dark:bg-[#0d1117] px-3.5 py-2.5 text-ink-900 dark:text-white placeholder-ink-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition text-sm';

const Settings = () => {
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
    <div className="min-h-screen bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300">
      {/* Header */}
      <div className="border-b border-ink-200 dark:border-[#262c36] bg-ink-50 dark:bg-[#11161f]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white text-balance">
            Account Settings
          </h1>
          <p className="mt-1.5 text-ink-500 dark:text-ink-400 text-balance">Manage how HireHub looks and keep your account secure.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Change Password */}
        <div className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0">
              <HiOutlineLockClosed className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-ink-900 dark:text-white">Change Password</h3>
              <p className="text-xs text-ink-500 dark:text-ink-400 flex items-center gap-1"><HiOutlineShieldCheck className="w-3.5 h-3.5" /> Keep your account protected</p>
            </div>
          </div>
          <form onSubmit={handlePassword} className="space-y-4">
            {[{ label: 'Current Password', key: 'currentPassword' }, { label: 'New Password', key: 'newPassword' }, { label: 'Confirm New Password', key: 'confirmPassword' }].map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">{f.label}</label>
                <input type="password" value={pw[f.key]} onChange={(e) => setPw({ ...pw, [f.key]: e.target.value })}
                  className={inputClass} />
              </div>
            ))}
            <button type="submit" disabled={saving} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-colors disabled:opacity-70">
              {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><HiOutlineLockClosed className="w-5 h-5" /> Update Password</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
