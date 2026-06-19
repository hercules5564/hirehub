import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../hooks/useAuth';
import { updateProfileAPI, uploadProfileImageAPI, uploadResumeAPI } from '../services/api';
import { updateUser } from '../redux/slices/authSlice';
import { SKILLS_LIST } from '../utils/constants';
import { getInitials } from '../utils/helpers';
import { HiOutlineCamera, HiOutlineDocumentText, HiOutlinePlus, HiOutlineX, HiOutlineUserCircle, HiOutlineSparkles, HiOutlineBadgeCheck, HiOutlineCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: '', phone: '', bio: '', location: '', website: '', linkedin: '', github: '', skills: [] });
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);

  // Sync the form from the user whenever it changes — so the fresh user fetched by
  // loadUser() on reload (with saved skills) populates the form.
  useEffect(() => {
    if (user) setForm({ name: user.name || '', phone: user.phone || '', bio: user.bio || '', location: user.location || '', website: user.website || '', linkedin: user.linkedin || '', github: user.github || '', skills: user.skills || [] });
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateProfileAPI(form);
      dispatch(updateUser(res.data.user));
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('profileImage', file);
    try {
      const res = await uploadProfileImageAPI(fd);
      dispatch(updateUser(res.data.user));
      toast.success('Image updated!');
    } catch { toast.error('Upload failed'); }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('resume', file);
    try {
      const res = await uploadResumeAPI(fd);
      dispatch(updateUser(res.data.user));
      toast.success('Resume uploaded!');
    } catch { toast.error('Upload failed'); }
  };

  // Skills save immediately (so they persist even without hitting "Save Profile").
  // Optimistic update, reverts if the save fails.
  const persistSkills = async (next, prev) => {
    try {
      const res = await updateProfileAPI({ skills: next });
      dispatch(updateUser(res.data.user));
    } catch {
      setForm((f) => ({ ...f, skills: prev })); // revert
      toast.error('Could not save skill — try again');
    }
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      const prev = form.skills;
      const next = [...prev, s];
      setForm((f) => ({ ...f, skills: next }));
      setSkillInput('');
      persistSkills(next, prev);
    }
  };

  const removeSkill = (skill) => {
    const prev = form.skills;
    const next = prev.filter((s) => s !== skill);
    setForm((f) => ({ ...f, skills: next }));
    persistSkills(next, prev);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-20 relative overflow-hidden">
      {/* Ambient decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-10 w-72 h-72 bg-rose-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Heading */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full mb-3">
            <HiOutlineSparkles className="w-4 h-4" /> Account
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white text-balance">Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">Profile</span></h1>
          <p className="mt-2 text-white/60">Keep your details fresh so recruiters see the best version of you.</p>
        </div>

        {/* Avatar — hero banner */}
        <div className="relative rounded-2xl overflow-hidden border border-white/[0.1] mb-6">
          <div className="relative bg-white/[0.03] p-6 sm:p-8">
            <div className="absolute -top-12 -right-8 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-12 -left-8 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl"></div>
            <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="relative group">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="" className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white/10" />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white/10">{getInitials(user?.name)}</div>
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-sm">
                  <HiOutlineCamera className="w-6 h-6 text-white" />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              <div className="pb-1">
                <h2 className="text-2xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                  {user?.name}
                  <HiOutlineBadgeCheck className="w-5 h-5 text-indigo-300" />
                </h2>
                <p className="text-sm text-white/60">{user?.email}</p>
                <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs font-medium bg-white/[0.06] text-white/70 border border-white/[0.1] capitalize">{user?.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/[0.1] mb-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <HiOutlineUserCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white">Personal Information</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[{ label: 'Full Name', key: 'name', type: 'text' }, { label: 'Phone', key: 'phone', type: 'tel' }, { label: 'Location', key: 'location', type: 'text' }, { label: 'Website', key: 'website', type: 'url' }].map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-white/70 mb-1.5">{f.label}</label>
                <input type={f.type} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.06] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none text-sm transition-shadow" />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.06] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none text-sm resize-none transition-shadow" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">LinkedIn</label>
              <input type="url" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.06] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none text-sm transition-shadow" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">GitHub</label>
              <input type="url" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.06] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none text-sm transition-shadow" />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/[0.1] mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <HiOutlineSparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white">Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {form.skills.map((s) => (
              <span key={s} className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/15 text-indigo-300 flex items-center gap-1.5">
                {s} <button onClick={() => removeSkill(s)} className="hover:text-rose-300 transition-colors"><HiOutlineX className="w-3.5 h-3.5" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Add a skill..." list="skills-list"
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.06] text-white placeholder-white/50 text-sm focus:ring-2 focus:ring-indigo-400/60 outline-none transition-shadow" />
            <datalist id="skills-list">{SKILLS_LIST.map((s) => <option key={s} value={s} />)}</datalist>
            <button onClick={addSkill} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-rose-500 text-white text-sm font-medium shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300 flex items-center justify-center"><HiOutlinePlus className="w-4 h-4" /></button>
          </div>
          <p className="mt-2 text-xs text-white/50">Skills save automatically — no need to hit Save.</p>
        </div>

        {/* Resume */}
        <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/[0.1] mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <HiOutlineDocumentText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white">Resume</h3>
          </div>
          {user?.resumeUrl ? (
            <div className="flex items-center gap-3 p-4 bg-indigo-500/10 border border-white/[0.1] rounded-xl">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                <HiOutlineDocumentText className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white flex items-center gap-1.5"><HiOutlineCheck className="w-4 h-4 text-indigo-300" /> Resume uploaded</p>
                <a href={user.resumeUrl} target="_blank" rel="noreferrer" className="text-xs font-medium text-indigo-300 hover:underline">View resume</a>
              </div>
              <label className="cursor-pointer text-sm text-indigo-300 font-semibold hover:text-indigo-200 transition-colors">
                Replace <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
              </label>
            </div>
          ) : (
            <label className="group flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/[0.1] rounded-xl cursor-pointer hover:border-indigo-400/60 hover:bg-white/[0.05] transition-all">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-lg mb-3 group-hover:scale-110 transition-transform">
                <HiOutlineDocumentText className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-white/80">Upload your resume</p>
              <p className="text-xs text-white/50">PDF, DOC, DOCX (max 5MB)</p>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
            </label>
          )}
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full py-3.5 text-base rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
          {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Save Profile'}
        </button>
      </div>
    </div>
  );
};

export default Profile;
