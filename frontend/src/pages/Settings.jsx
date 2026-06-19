import { useState } from 'react';
import { changePasswordAPI } from '../services/api';
import { HiOutlineLockClosed, HiOutlineCog, HiOutlineShieldCheck, HiOutlineSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';

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
    <div className="min-h-screen bg-[#030303] text-white pt-24 relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-16 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full mb-4">
            <HiOutlineCog className="w-4 h-4" /> Preferences
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white text-balance">
            Account <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">Settings</span>
          </h1>
          <p className="mt-2 text-white/60 text-balance">Manage how HireHub looks and keep your account secure.</p>
        </div>

        {/* Change Password */}
        <div className="group bg-white/[0.03] border border-white/[0.1] rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/[0.2] transition-all duration-300">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] group-hover:scale-110 transition-transform">
              <HiOutlineLockClosed className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white flex items-center gap-2">Change Password</h3>
              <p className="text-xs text-white/50 flex items-center gap-1"><HiOutlineShieldCheck className="w-3.5 h-3.5" /> Keep your account protected</p>
            </div>
          </div>
          <form onSubmit={handlePassword} className="space-y-4">
            {[{ label: 'Current Password', key: 'currentPassword' }, { label: 'New Password', key: 'newPassword' }, { label: 'Confirm New Password', key: 'confirmPassword' }].map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-white/70 mb-1.5">{f.label}</label>
                <input type="password" value={pw[f.key]} onChange={(e) => setPw({ ...pw, [f.key]: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none text-sm transition-shadow" />
              </div>
            ))}
            <button type="submit" disabled={saving} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100">
              {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><HiOutlineSparkles className="w-5 h-5" /> Update Password</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
