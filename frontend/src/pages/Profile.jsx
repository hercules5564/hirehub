import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../hooks/useAuth';
import { updateProfileAPI, uploadProfileImageAPI, uploadResumeAPI } from '../services/api';
import { updateUser } from '../redux/slices/authSlice';
import { SKILLS_LIST } from '../utils/constants';
import { getInitials } from '../utils/helpers';
import { HiOutlineCamera, HiOutlineDocumentText, HiOutlinePlus, HiOutlineX } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: '', phone: '', bio: '', location: '', website: '', linkedin: '', github: '', skills: [] });
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);

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

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) { setForm({ ...form, skills: [...form.skills, s] }); setSkillInput(''); }
  };

  const removeSkill = (skill) => setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-8 animate-fade-in">Your Profile</h1>

        {/* Avatar */}
        <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700 mb-6 animate-fade-in">
          <div className="flex items-center gap-5">
            <div className="relative group">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="" className="w-20 h-20 rounded-2xl object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-bold">{getInitials(user?.name)}</div>
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <HiOutlineCamera className="w-6 h-6 text-white" />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            <div>
              <h2 className="text-xl font-bold text-dark-900 dark:text-white">{user?.name}</h2>
              <p className="text-sm text-dark-500">{user?.email}</p>
              <span className="inline-block mt-1 badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 capitalize">{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700 mb-6 space-y-5 animate-fade-in">
          <h3 className="font-bold text-dark-900 dark:text-white">Personal Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[{ label: 'Full Name', key: 'name', type: 'text' }, { label: 'Phone', key: 'phone', type: 'tel' }, { label: 'Location', key: 'location', type: 'text' }, { label: 'Website', key: 'website', type: 'url' }].map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">{f.label}</label>
                <input type={f.type} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-dark-50 dark:bg-dark-700 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-dark-50 dark:bg-dark-700 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm resize-none" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">LinkedIn</label>
              <input type="url" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-dark-50 dark:bg-dark-700 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">GitHub</label>
              <input type="url" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-dark-50 dark:bg-dark-700 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700 mb-6 animate-fade-in">
          <h3 className="font-bold text-dark-900 dark:text-white mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {form.skills.map((s) => (
              <span key={s} className="badge bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 flex items-center gap-1">
                {s} <button onClick={() => removeSkill(s)}><HiOutlineX className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Add a skill..." list="skills-list"
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-dark-50 dark:bg-dark-700 text-dark-900 dark:text-white text-sm outline-none" />
            <datalist id="skills-list">{SKILLS_LIST.map((s) => <option key={s} value={s} />)}</datalist>
            <button onClick={addSkill} className="px-4 py-2.5 rounded-xl gradient-primary text-white text-sm font-medium"><HiOutlinePlus className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Resume */}
        <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700 mb-6 animate-fade-in">
          <h3 className="font-bold text-dark-900 dark:text-white mb-4">Resume</h3>
          {user?.resumeUrl ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <HiOutlineDocumentText className="w-8 h-8 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-dark-900 dark:text-white">Resume uploaded</p>
                <a href={user.resumeUrl} target="_blank" rel="noreferrer" className="text-xs text-primary-600">View resume</a>
              </div>
              <label className="cursor-pointer text-sm text-primary-600 font-medium hover:text-primary-700">
                Replace <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
              </label>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
              <HiOutlineDocumentText className="w-10 h-10 text-dark-400 mb-2" />
              <p className="text-sm font-medium text-dark-700 dark:text-dark-300">Upload your resume</p>
              <p className="text-xs text-dark-500">PDF, DOC, DOCX (max 5MB)</p>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
            </label>
          )}
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full py-3 gradient-primary text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center">
          {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Save Profile'}
        </button>
      </div>
    </div>
  );
};

export default Profile;
