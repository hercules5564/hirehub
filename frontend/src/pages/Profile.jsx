import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../hooks/useAuth';
import { updateProfileAPI, uploadProfileImageAPI, uploadResumeAPI } from '../services/api';
import { updateUser } from '../redux/slices/authSlice';
import { SKILLS_LIST } from '../utils/constants';
import { getInitials } from '../utils/helpers';
import { HiOutlineCamera, HiOutlineDocumentText, HiOutlinePlus, HiOutlineX, HiOutlineUserCircle, HiOutlineSparkles, HiOutlineBadgeCheck, HiOutlineCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';

const inputClass = 'w-full rounded-lg border border-ink-300 dark:border-[#262c36] bg-white dark:bg-[#0d1117] px-3.5 py-2.5 text-ink-900 dark:text-white placeholder-ink-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition text-sm';

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
    <div className="min-h-screen bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300">
      {/* Header */}
      <div className="border-b border-ink-200 dark:border-[#262c36] bg-ink-50 dark:bg-[#11161f]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white text-balance">Your Profile</h1>
          <p className="mt-1.5 text-ink-500 dark:text-ink-400">Keep your details fresh so recruiters see the best version of you.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Avatar header */}
        <div className="rounded-xl border border-ink-200 dark:border-[#262c36] bg-white dark:bg-[#161b22] shadow-soft mb-6">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="relative group">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="" className="w-24 h-24 rounded-xl object-cover border border-ink-200 dark:border-[#262c36]" />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 text-3xl font-bold border border-ink-200 dark:border-[#262c36]">{getInitials(user?.name)}</div>
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-ink-900/50 rounded-xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <HiOutlineCamera className="w-6 h-6 text-white" />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              <div className="pb-1">
                <h2 className="text-2xl font-bold text-ink-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                  {user?.name}
                  <HiOutlineBadgeCheck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </h2>
                <p className="text-sm text-ink-500 dark:text-ink-400">{user?.email}</p>
                <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-md text-xs font-medium bg-ink-100 dark:bg-white/[0.06] text-ink-600 dark:text-ink-300 capitalize">{user?.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-[#161b22] rounded-xl p-6 border border-ink-200 dark:border-[#262c36] shadow-soft mb-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0">
              <HiOutlineUserCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-ink-900 dark:text-white">Personal Information</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[{ label: 'Full Name', key: 'name', type: 'text' }, { label: 'Phone', key: 'phone', type: 'tel' }, { label: 'Location', key: 'location', type: 'text' }, { label: 'Website', key: 'website', type: 'url' }].map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">{f.label}</label>
                <input type={f.type} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className={inputClass} />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3}
              className={`${inputClass} resize-none`} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">LinkedIn</label>
              <input type="url" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">GitHub</label>
              <input type="url" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })}
                className={inputClass} />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white dark:bg-[#161b22] rounded-xl p-6 border border-ink-200 dark:border-[#262c36] shadow-soft mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0">
              <HiOutlineSparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-ink-900 dark:text-white">Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {form.skills.map((s) => (
              <span key={s} className="px-2.5 py-1 rounded-md text-xs font-medium bg-primary-50 dark:bg-primary-600/10 text-primary-700 dark:text-primary-400 flex items-center gap-1.5">
                {s} <button onClick={() => removeSkill(s)} className="hover:text-primary-900 dark:hover:text-primary-200 transition-colors"><HiOutlineX className="w-3.5 h-3.5" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Add a skill..." list="skills-list"
              className={`flex-1 ${inputClass}`} />
            <datalist id="skills-list">{SKILLS_LIST.map((s) => <option key={s} value={s} />)}</datalist>
            <button onClick={addSkill} className="px-4 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors flex items-center justify-center"><HiOutlinePlus className="w-4 h-4" /></button>
          </div>
          <p className="mt-2 text-xs text-ink-400">Skills save automatically — no need to hit Save.</p>
        </div>

        {/* Resume */}
        <div className="bg-white dark:bg-[#161b22] rounded-xl p-6 border border-ink-200 dark:border-[#262c36] shadow-soft mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0">
              <HiOutlineDocumentText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-ink-900 dark:text-white">Resume</h3>
          </div>
          {user?.resumeUrl ? (
            <div className="flex items-center gap-3 p-4 bg-ink-50 dark:bg-white/[0.03] border border-ink-200 dark:border-[#262c36] rounded-lg">
              <div className="w-11 h-11 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0">
                <HiOutlineDocumentText className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink-900 dark:text-white flex items-center gap-1.5"><HiOutlineCheck className="w-4 h-4 text-green-600 dark:text-green-400" /> Resume uploaded</p>
                <a href={user.resumeUrl} target="_blank" rel="noreferrer" className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline">View resume</a>
              </div>
              <label className="cursor-pointer text-sm text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                Replace <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
              </label>
            </div>
          ) : (
            <label className="group flex flex-col items-center justify-center p-8 border-2 border-dashed border-ink-300 dark:border-[#262c36] rounded-lg cursor-pointer hover:border-primary-400 dark:hover:border-primary-700 hover:bg-ink-50 dark:hover:bg-white/[0.03] transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-3">
                <HiOutlineDocumentText className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-ink-700 dark:text-ink-200">Upload your resume</p>
              <p className="text-xs text-ink-400">PDF, DOC, DOCX (max 5MB)</p>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
            </label>
          )}
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full py-3 text-base rounded-lg font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
          {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Save Profile'}
        </button>
      </div>
    </div>
  );
};

export default Profile;
