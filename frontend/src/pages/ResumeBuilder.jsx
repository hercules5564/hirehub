import { useEffect, useRef, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { SKILLS_LIST } from '../utils/constants';
import {
  HiOutlinePlus, HiOutlineX, HiOutlineTrash, HiOutlineDownload,
  HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineGlobeAlt,
} from 'react-icons/hi';

// Pull a year out of whatever the stored date looks like (ISO string, Date, or year number).
const toYear = (v) => {
  if (!v) return '';
  const d = new Date(v);
  return isNaN(d.getTime()) ? String(v) : String(d.getFullYear());
};

const emptyExperience = { title: '', company: '', location: '', start: '', end: '', description: '' };
const emptyEducation = { degree: '', field: '', institution: '', start: '', end: '' };

const inputClass =
  'w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-dark-600 bg-dark-50 dark:bg-dark-700 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm';

const ResumeBuilder = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    fullName: '', title: '', email: '', phone: '', location: '',
    website: '', linkedin: '', github: '', summary: '',
    experience: [], education: [], skills: [],
  });
  const [skillInput, setSkillInput] = useState('');
  const printRef = useRef(null);

  // Prefill from the saved profile once the user is available.
  useEffect(() => {
    if (!user) return;
    setData((prev) => ({
      ...prev,
      fullName: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      location: user.location || '',
      website: user.website || '',
      linkedin: user.linkedin || '',
      github: user.github || '',
      summary: user.bio || '',
      skills: user.skills?.length ? user.skills : [],
      experience: user.experience?.length
        ? user.experience.map((e) => ({
            title: e.title || '', company: e.company || '', location: e.location || '',
            start: toYear(e.startDate), end: e.current ? 'Present' : toYear(e.endDate),
            description: e.description || '',
          }))
        : [{ ...emptyExperience }],
      education: user.education?.length
        ? user.education.map((e) => ({
            degree: e.degree || '', field: e.field || '', institution: e.institution || '',
            start: e.startYear ? String(e.startYear) : '', end: e.endYear ? String(e.endYear) : '',
          }))
        : [{ ...emptyEducation }],
    }));
  }, [user]);

  const set = (key, value) => setData((d) => ({ ...d, [key]: value }));

  // Generic helpers for the repeatable Experience / Education sections.
  const updateItem = (key, idx, field, value) =>
    setData((d) => ({ ...d, [key]: d[key].map((it, i) => (i === idx ? { ...it, [field]: value } : it)) }));
  const addItem = (key, blank) => setData((d) => ({ ...d, [key]: [...d[key], { ...blank }] }));
  const removeItem = (key, idx) => setData((d) => ({ ...d, [key]: d[key].filter((_, i) => i !== idx) }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !data.skills.includes(s)) set('skills', [...data.skills, s]);
    setSkillInput('');
  };
  const removeSkill = (s) => set('skills', data.skills.filter((x) => x !== s));

  const handleDownload = () => window.print();

  const dateRange = (start, end) =>
    [start, end].filter(Boolean).join(' – ') || '';

  const hasContact = data.email || data.phone || data.location;
  const links = [
    { val: data.website, label: data.website },
    { val: data.linkedin, label: data.linkedin },
    { val: data.github, label: data.github },
  ].filter((l) => l.val);

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-dark-900 dark:text-white">Resume Builder</h1>
            <p className="text-sm text-dark-500 mt-1">Fill in your details and download a clean, ATS-friendly PDF.</p>
          </div>
          <button onClick={handleDownload} className="btn-primary self-start sm:self-auto">
            <HiOutlineDownload className="w-5 h-5" /> Download PDF
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* ===== FORM ===== */}
          <div className="space-y-6">
            {/* Personal */}
            <section className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700">
              <h3 className="font-bold text-dark-900 dark:text-white mb-4">Personal Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Full Name</label>
                  <input className={inputClass} value={data.fullName} onChange={(e) => set('fullName', e.target.value)} placeholder="Jane Doe" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Professional Title</label>
                  <input className={inputClass} value={data.title} onChange={(e) => set('title', e.target.value)} placeholder="Senior Full Stack Developer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Email</label>
                  <input className={inputClass} value={data.email} onChange={(e) => set('email', e.target.value)} placeholder="jane@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Phone</label>
                  <input className={inputClass} value={data.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+1 555 000 1234" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Location</label>
                  <input className={inputClass} value={data.location} onChange={(e) => set('location', e.target.value)} placeholder="City, Country" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Website</label>
                  <input className={inputClass} value={data.website} onChange={(e) => set('website', e.target.value)} placeholder="yoursite.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">LinkedIn</label>
                  <input className={inputClass} value={data.linkedin} onChange={(e) => set('linkedin', e.target.value)} placeholder="linkedin.com/in/you" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">GitHub</label>
                  <input className={inputClass} value={data.github} onChange={(e) => set('github', e.target.value)} placeholder="github.com/you" />
                </div>
              </div>
            </section>

            {/* Summary */}
            <section className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700">
              <h3 className="font-bold text-dark-900 dark:text-white mb-4">Professional Summary</h3>
              <textarea rows={4} className={`${inputClass} resize-none`} value={data.summary}
                onChange={(e) => set('summary', e.target.value)}
                placeholder="A short paragraph summarizing your experience, strengths, and goals." />
            </section>

            {/* Experience */}
            <section className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-dark-900 dark:text-white">Work Experience</h3>
                <button onClick={() => addItem('experience', emptyExperience)} className="text-sm text-primary-600 font-medium flex items-center gap-1 hover:text-primary-700">
                  <HiOutlinePlus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="space-y-5">
                {data.experience.map((exp, i) => (
                  <div key={i} className="p-4 rounded-xl border border-gray-100 dark:border-dark-700 relative">
                    {data.experience.length > 1 && (
                      <button onClick={() => removeItem('experience', i)} className="absolute top-3 right-3 text-dark-400 hover:text-danger">
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    )}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input className={inputClass} value={exp.title} onChange={(e) => updateItem('experience', i, 'title', e.target.value)} placeholder="Job Title" />
                      <input className={inputClass} value={exp.company} onChange={(e) => updateItem('experience', i, 'company', e.target.value)} placeholder="Company" />
                      <input className={inputClass} value={exp.location} onChange={(e) => updateItem('experience', i, 'location', e.target.value)} placeholder="Location" />
                      <div className="grid grid-cols-2 gap-3">
                        <input className={inputClass} value={exp.start} onChange={(e) => updateItem('experience', i, 'start', e.target.value)} placeholder="Start (2022)" />
                        <input className={inputClass} value={exp.end} onChange={(e) => updateItem('experience', i, 'end', e.target.value)} placeholder="End / Present" />
                      </div>
                    </div>
                    <textarea rows={2} className={`${inputClass} resize-none mt-3`} value={exp.description}
                      onChange={(e) => updateItem('experience', i, 'description', e.target.value)}
                      placeholder="What you did and achieved (one line per point)." />
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-dark-900 dark:text-white">Education</h3>
                <button onClick={() => addItem('education', emptyEducation)} className="text-sm text-primary-600 font-medium flex items-center gap-1 hover:text-primary-700">
                  <HiOutlinePlus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="space-y-5">
                {data.education.map((edu, i) => (
                  <div key={i} className="p-4 rounded-xl border border-gray-100 dark:border-dark-700 relative">
                    {data.education.length > 1 && (
                      <button onClick={() => removeItem('education', i)} className="absolute top-3 right-3 text-dark-400 hover:text-danger">
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    )}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input className={inputClass} value={edu.degree} onChange={(e) => updateItem('education', i, 'degree', e.target.value)} placeholder="Degree (B.Tech)" />
                      <input className={inputClass} value={edu.field} onChange={(e) => updateItem('education', i, 'field', e.target.value)} placeholder="Field (Computer Science)" />
                      <input className={inputClass} value={edu.institution} onChange={(e) => updateItem('education', i, 'institution', e.target.value)} placeholder="Institution" />
                      <div className="grid grid-cols-2 gap-3">
                        <input className={inputClass} value={edu.start} onChange={(e) => updateItem('education', i, 'start', e.target.value)} placeholder="Start (2018)" />
                        <input className={inputClass} value={edu.end} onChange={(e) => updateItem('education', i, 'end', e.target.value)} placeholder="End (2022)" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills */}
            <section className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700">
              <h3 className="font-bold text-dark-900 dark:text-white mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {data.skills.map((s) => (
                  <span key={s} className="badge bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 flex items-center gap-1">
                    {s} <button onClick={() => removeSkill(s)}><HiOutlineX className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Add a skill..." list="rb-skills"
                  className={inputClass} />
                <datalist id="rb-skills">{SKILLS_LIST.map((s) => <option key={s} value={s} />)}</datalist>
                <button onClick={addSkill} className="px-4 py-2 rounded-lg gradient-primary text-white text-sm font-medium flex-shrink-0"><HiOutlinePlus className="w-4 h-4" /></button>
              </div>
            </section>
          </div>

          {/* ===== LIVE PREVIEW ===== */}
          <div className="lg:sticky lg:top-24 h-fit">
            <p className="text-xs uppercase tracking-wide text-dark-400 font-semibold mb-2 print:hidden">Live Preview</p>
            {/* The paper: always light-themed so it prints clean regardless of app theme. */}
            <div id="resume-paper" ref={printRef} className="bg-white text-gray-800 rounded-xl shadow-lg border border-gray-200 p-8 sm:p-10">
              {/* Header */}
              <header className="border-b border-gray-200 pb-4 mb-5">
                <h1 className="text-2xl font-bold text-gray-900">{data.fullName || 'Your Name'}</h1>
                {data.title && <p className="text-primary-600 font-medium mt-0.5">{data.title}</p>}
                {hasContact && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-600">
                    {data.email && <span className="inline-flex items-center gap-1"><HiOutlineMail className="w-3.5 h-3.5" />{data.email}</span>}
                    {data.phone && <span className="inline-flex items-center gap-1"><HiOutlinePhone className="w-3.5 h-3.5" />{data.phone}</span>}
                    {data.location && <span className="inline-flex items-center gap-1"><HiOutlineLocationMarker className="w-3.5 h-3.5" />{data.location}</span>}
                  </div>
                )}
                {links.length > 0 && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-600">
                    {links.map((l, i) => (
                      <span key={i} className="inline-flex items-center gap-1"><HiOutlineGlobeAlt className="w-3.5 h-3.5" />{l.label}</span>
                    ))}
                  </div>
                )}
              </header>

              {/* Summary */}
              {data.summary && (
                <section className="mb-5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Summary</h2>
                  <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">{data.summary}</p>
                </section>
              )}

              {/* Experience */}
              {data.experience.some((e) => e.title || e.company) && (
                <section className="mb-5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Experience</h2>
                  <div className="space-y-3">
                    {data.experience.filter((e) => e.title || e.company).map((exp, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-baseline gap-2">
                          <p className="font-semibold text-gray-900 text-sm">
                            {exp.title}{exp.company && <span className="font-normal text-gray-600"> · {exp.company}</span>}
                          </p>
                          {dateRange(exp.start, exp.end) && <span className="text-xs text-gray-500 flex-shrink-0">{dateRange(exp.start, exp.end)}</span>}
                        </div>
                        {exp.location && <p className="text-xs text-gray-500">{exp.location}</p>}
                        {exp.description && <p className="text-sm text-gray-700 mt-1 whitespace-pre-line leading-relaxed">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {data.education.some((e) => e.degree || e.institution) && (
                <section className="mb-5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Education</h2>
                  <div className="space-y-2">
                    {data.education.filter((e) => e.degree || e.institution).map((edu, i) => (
                      <div key={i} className="flex justify-between items-baseline gap-2">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {edu.degree}{edu.field && <span className="font-normal text-gray-600">, {edu.field}</span>}
                          </p>
                          {edu.institution && <p className="text-xs text-gray-600">{edu.institution}</p>}
                        </div>
                        {dateRange(edu.start, edu.end) && <span className="text-xs text-gray-500 flex-shrink-0">{dateRange(edu.start, edu.end)}</span>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Skills */}
              {data.skills.length > 0 && (
                <section>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Skills</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {data.skills.map((s) => (
                      <span key={s} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{s}</span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
