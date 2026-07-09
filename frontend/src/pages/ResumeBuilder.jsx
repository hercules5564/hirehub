import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { SKILLS_LIST } from '../utils/constants';
import AtsScorePanel from '../components/ats/AtsScorePanel';
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

// Realistic sample resume — lets you test the ATS score without typing everything in.
const SAMPLE_DATA = {
  fullName: 'Aarav Mehta',
  title: 'Senior Full Stack Developer',
  email: 'aarav.mehta@example.com',
  phone: '+91 98765 43210',
  location: 'Bangalore, India',
  website: 'aaravmehta.dev',
  linkedin: 'linkedin.com/in/aaravmehta',
  github: 'github.com/aaravmehta',
  summary:
    'Senior full stack developer with 6 years building scalable web applications across the MERN stack. Led teams that shipped products used by millions, improving performance and reliability while mentoring junior engineers.',
  experience: [
    {
      title: 'Senior Full Stack Developer',
      company: 'TechCorp India',
      location: 'Bangalore, India',
      start: '2021',
      end: 'Present',
      description:
        'Led a team of 5 engineers and improved API response time by 40%.\nBuilt and shipped a microservices platform serving 2M+ monthly users.\nReduced infrastructure costs by 30% through caching and query optimization.',
    },
    {
      title: 'Full Stack Developer',
      company: 'DataFlow Analytics',
      location: 'Mumbai, India',
      start: '2018',
      end: '2021',
      description:
        'Developed React dashboards that increased user engagement by 25%.\nAutomated CI/CD pipelines, cutting deployment time from 2 hours to 15 minutes.',
    },
  ],
  education: [
    { degree: 'B.Tech', field: 'Computer Science', institution: 'IIT Delhi', start: '2014', end: '2018' },
  ],
  skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Express.js', 'AWS', 'Docker', 'GraphQL', 'Redis', 'CI/CD'],
};

// Deliberately weak resume — missing contact details, clichés, no metrics, few skills.
// Use it to see a low ATS score with red/amber categories and tips.
const WEAK_SAMPLE_DATA = {
  fullName: 'John Smith',
  title: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  linkedin: '',
  github: '',
  summary: 'Hard working team player responsible for various tasks.',
  experience: [
    {
      title: 'Developer',
      company: 'Some Company',
      location: '',
      start: '',
      end: '',
      description: 'Responsible for working on the website and doing day to day tasks.',
    },
  ],
  education: [],
  skills: ['HTML', 'CSS'],
};

const inputClass =
  'w-full px-3 py-2 rounded-lg border border-ink-300 dark:border-[#262c36] bg-white dark:bg-[#0d1117] text-ink-900 dark:text-ink-100 placeholder-ink-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm transition';

const TEMPLATES = [
  { id: 'modern', name: 'Modern' },
  { id: 'classic', name: 'Classic' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'sidebar', name: 'Sidebar' },
];

const dateRange = (start, end) => [start, end].filter(Boolean).join(' – ') || '';

// Shared derived values so every template renders from the same source.
const derive = (data) => ({
  links: [data.website, data.linkedin, data.github].filter(Boolean),
  hasContact: !!(data.email || data.phone || data.location),
  experiences: data.experience.filter((e) => e.title || e.company),
  educations: data.education.filter((e) => e.degree || e.institution),
});

/* ===================== TEMPLATES ===================== */

const ModernTemplate = ({ data }) => {
  const { links, hasContact, experiences, educations } = derive(data);
  return (
    <div className="p-8 sm:p-10 text-gray-800">
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
            {links.map((l, i) => <span key={i} className="inline-flex items-center gap-1"><HiOutlineGlobeAlt className="w-3.5 h-3.5" />{l}</span>)}
          </div>
        )}
      </header>
      {data.summary && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Summary</h2>
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">{data.summary}</p>
        </section>
      )}
      {experiences.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Experience</h2>
          <div className="space-y-3">
            {experiences.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline gap-2">
                  <p className="font-semibold text-gray-900 text-sm">{exp.title}{exp.company && <span className="font-normal text-gray-600"> · {exp.company}</span>}</p>
                  {dateRange(exp.start, exp.end) && <span className="text-xs text-gray-500 flex-shrink-0">{dateRange(exp.start, exp.end)}</span>}
                </div>
                {exp.location && <p className="text-xs text-gray-500">{exp.location}</p>}
                {exp.description && <p className="text-sm text-gray-700 mt-1 whitespace-pre-line leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
      {educations.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Education</h2>
          <div className="space-y-2">
            {educations.map((edu, i) => (
              <div key={i} className="flex justify-between items-baseline gap-2">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{edu.degree}{edu.field && <span className="font-normal text-gray-600">, {edu.field}</span>}</p>
                  {edu.institution && <p className="text-xs text-gray-600">{edu.institution}</p>}
                </div>
                {dateRange(edu.start, edu.end) && <span className="text-xs text-gray-500 flex-shrink-0">{dateRange(edu.start, edu.end)}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
      {data.skills.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((s) => <span key={s} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{s}</span>)}
          </div>
        </section>
      )}
    </div>
  );
};

const ClassicTemplate = ({ data }) => {
  const { links, hasContact, experiences, educations } = derive(data);
  const contactLine = [data.email, data.phone, data.location, ...links].filter(Boolean).join('  •  ');
  const Heading = ({ children }) => (
    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b-2 border-gray-800 pb-1 mb-2">{children}</h2>
  );
  return (
    <div className="p-8 sm:p-10 text-gray-800" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-wide">{data.fullName || 'Your Name'}</h1>
        {data.title && <p className="text-gray-600 italic mt-1">{data.title}</p>}
        {(hasContact || links.length > 0) && <p className="text-xs text-gray-600 mt-2">{contactLine}</p>}
      </header>
      {data.summary && (
        <section className="mb-5"><Heading>Summary</Heading><p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">{data.summary}</p></section>
      )}
      {experiences.length > 0 && (
        <section className="mb-5">
          <Heading>Experience</Heading>
          <div className="space-y-3">
            {experiences.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline gap-2">
                  <p className="font-bold text-gray-900 text-sm">{exp.title}{exp.company && <span className="font-normal italic"> , {exp.company}</span>}</p>
                  {dateRange(exp.start, exp.end) && <span className="text-xs text-gray-600 flex-shrink-0">{dateRange(exp.start, exp.end)}</span>}
                </div>
                {exp.location && <p className="text-xs italic text-gray-500">{exp.location}</p>}
                {exp.description && <p className="text-sm text-gray-700 mt-1 whitespace-pre-line leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
      {educations.length > 0 && (
        <section className="mb-5">
          <Heading>Education</Heading>
          <div className="space-y-2">
            {educations.map((edu, i) => (
              <div key={i} className="flex justify-between items-baseline gap-2">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{edu.degree}{edu.field && <span className="font-normal italic">, {edu.field}</span>}</p>
                  {edu.institution && <p className="text-xs italic text-gray-600">{edu.institution}</p>}
                </div>
                {dateRange(edu.start, edu.end) && <span className="text-xs text-gray-600 flex-shrink-0">{dateRange(edu.start, edu.end)}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
      {data.skills.length > 0 && (
        <section><Heading>Skills</Heading><p className="text-sm text-gray-700">{data.skills.join('  •  ')}</p></section>
      )}
    </div>
  );
};

const MinimalTemplate = ({ data }) => {
  const { links, hasContact, experiences, educations } = derive(data);
  const contactLine = [data.email, data.phone, data.location, ...links].filter(Boolean).join('   /   ');
  const Heading = ({ children }) => (
    <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-2">{children}</h2>
  );
  return (
    <div className="p-8 sm:p-12 text-gray-800">
      <header className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 tracking-tight">{data.fullName || 'Your Name'}</h1>
        {data.title && <p className="text-gray-500 mt-1">{data.title}</p>}
        {(hasContact || links.length > 0) && <p className="text-xs text-gray-500 mt-3">{contactLine}</p>}
      </header>
      {data.summary && <section className="mb-7"><Heading>Profile</Heading><p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">{data.summary}</p></section>}
      {experiences.length > 0 && (
        <section className="mb-7">
          <Heading>Experience</Heading>
          <div className="space-y-4">
            {experiences.map((exp, i) => (
              <div key={i}>
                <p className="font-medium text-gray-900 text-sm">{exp.title}</p>
                <p className="text-xs text-gray-500">{[exp.company, exp.location, dateRange(exp.start, exp.end)].filter(Boolean).join('  ·  ')}</p>
                {exp.description && <p className="text-sm text-gray-600 mt-1 whitespace-pre-line leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
      {educations.length > 0 && (
        <section className="mb-7">
          <Heading>Education</Heading>
          <div className="space-y-3">
            {educations.map((edu, i) => (
              <div key={i}>
                <p className="font-medium text-gray-900 text-sm">{[edu.degree, edu.field].filter(Boolean).join(', ')}</p>
                <p className="text-xs text-gray-500">{[edu.institution, dateRange(edu.start, edu.end)].filter(Boolean).join('  ·  ')}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {data.skills.length > 0 && <section><Heading>Skills</Heading><p className="text-sm text-gray-600">{data.skills.join(',  ')}</p></section>}
    </div>
  );
};

const SidebarTemplate = ({ data }) => {
  const { links, experiences, educations } = derive(data);
  const SideHeading = ({ children }) => <h2 className="text-[11px] font-bold uppercase tracking-widest text-white/60 mb-2 mt-5 first:mt-0">{children}</h2>;
  const MainHeading = ({ children }) => <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600 mb-2">{children}</h2>;
  return (
    <div className="flex min-h-full text-gray-800">
      {/* Sidebar */}
      <aside className="w-1/3 bg-[#1e293b] text-white p-6">
        <h1 className="text-xl font-bold leading-tight">{data.fullName || 'Your Name'}</h1>
        {data.title && <p className="text-white/70 text-sm mt-1">{data.title}</p>}

        <SideHeading>Contact</SideHeading>
        <div className="space-y-1.5 text-xs text-white/80">
          {data.email && <p className="flex items-start gap-1.5 break-all"><HiOutlineMail className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />{data.email}</p>}
          {data.phone && <p className="flex items-start gap-1.5"><HiOutlinePhone className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />{data.phone}</p>}
          {data.location && <p className="flex items-start gap-1.5"><HiOutlineLocationMarker className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />{data.location}</p>}
          {links.map((l, i) => <p key={i} className="flex items-start gap-1.5 break-all"><HiOutlineGlobeAlt className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />{l}</p>)}
        </div>

        {data.skills.length > 0 && (
          <>
            <SideHeading>Skills</SideHeading>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((s) => <span key={s} className="text-[11px] bg-white/10 text-white/90 px-2 py-0.5 rounded">{s}</span>)}
            </div>
          </>
        )}

        {educations.length > 0 && (
          <>
            <SideHeading>Education</SideHeading>
            <div className="space-y-2 text-xs">
              {educations.map((edu, i) => (
                <div key={i}>
                  <p className="font-semibold text-white">{[edu.degree, edu.field].filter(Boolean).join(', ')}</p>
                  <p className="text-white/70">{edu.institution}</p>
                  {dateRange(edu.start, edu.end) && <p className="text-white/50">{dateRange(edu.start, edu.end)}</p>}
                </div>
              ))}
            </div>
          </>
        )}
      </aside>

      {/* Main */}
      <main className="w-2/3 p-6">
        {data.summary && (
          <section className="mb-5"><MainHeading>Profile</MainHeading><p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">{data.summary}</p></section>
        )}
        {experiences.length > 0 && (
          <section>
            <MainHeading>Experience</MainHeading>
            <div className="space-y-3">
              {experiences.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline gap-2">
                    <p className="font-semibold text-gray-900 text-sm">{exp.title}</p>
                    {dateRange(exp.start, exp.end) && <span className="text-xs text-gray-500 flex-shrink-0">{dateRange(exp.start, exp.end)}</span>}
                  </div>
                  <p className="text-xs text-gray-500">{[exp.company, exp.location].filter(Boolean).join(' · ')}</p>
                  {exp.description && <p className="text-sm text-gray-700 mt-1 whitespace-pre-line leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

const TEMPLATE_COMPONENTS = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  sidebar: SidebarTemplate,
};

/* ===================== PAGE ===================== */

const ResumeBuilder = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    fullName: '', title: '', email: '', phone: '', location: '',
    website: '', linkedin: '', github: '', summary: '',
    experience: [], education: [], skills: [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [template, setTemplate] = useState('modern');

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
  const loadSample = () => setData(structuredClone(SAMPLE_DATA));
  const loadWeakSample = () => setData(structuredClone(WEAK_SAMPLE_DATA));

  const SelectedTemplate = TEMPLATE_COMPONENTS[template];

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-[#11161f] text-ink-700 dark:text-ink-300 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-ink-900 dark:text-white">Resume Builder</h1>
            <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">Fill in your details, pick a template, and download a clean PDF.</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button onClick={loadWeakSample} className="px-4 py-2 rounded-lg border border-ink-300 dark:border-[#262c36] text-ink-800 dark:text-ink-100 text-sm font-medium hover:bg-ink-50 dark:hover:bg-white/[0.04] transition-colors">
              Weak Sample
            </button>
            <button onClick={loadSample} className="px-4 py-2 rounded-lg border border-ink-300 dark:border-[#262c36] text-ink-800 dark:text-ink-100 text-sm font-medium hover:bg-ink-50 dark:hover:bg-white/[0.04] transition-colors">
              Strong Sample
            </button>
            <button onClick={handleDownload} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors">
              <HiOutlineDownload className="w-5 h-5" /> Download PDF
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* ===== FORM ===== */}
          <div className="space-y-6">
            <section className="bg-white dark:bg-[#161b22] rounded-xl p-6 border border-ink-200 dark:border-[#262c36] shadow-soft">
              <h3 className="font-bold text-ink-900 dark:text-white mb-4">Personal Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1">Full Name</label>
                  <input className={inputClass} value={data.fullName} onChange={(e) => set('fullName', e.target.value)} placeholder="Jane Doe" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1">Professional Title</label>
                  <input className={inputClass} value={data.title} onChange={(e) => set('title', e.target.value)} placeholder="Senior Full Stack Developer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1">Email</label>
                  <input className={inputClass} value={data.email} onChange={(e) => set('email', e.target.value)} placeholder="jane@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1">Phone</label>
                  <input className={inputClass} value={data.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+1 555 000 1234" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1">Location</label>
                  <input className={inputClass} value={data.location} onChange={(e) => set('location', e.target.value)} placeholder="City, Country" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1">Website</label>
                  <input className={inputClass} value={data.website} onChange={(e) => set('website', e.target.value)} placeholder="yoursite.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1">LinkedIn</label>
                  <input className={inputClass} value={data.linkedin} onChange={(e) => set('linkedin', e.target.value)} placeholder="linkedin.com/in/you" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1">GitHub</label>
                  <input className={inputClass} value={data.github} onChange={(e) => set('github', e.target.value)} placeholder="github.com/you" />
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-[#161b22] rounded-xl p-6 border border-ink-200 dark:border-[#262c36] shadow-soft">
              <h3 className="font-bold text-ink-900 dark:text-white mb-4">Professional Summary</h3>
              <textarea rows={4} className={`${inputClass} resize-none`} value={data.summary}
                onChange={(e) => set('summary', e.target.value)}
                placeholder="A short paragraph summarizing your experience, strengths, and goals." />
            </section>

            <section className="bg-white dark:bg-[#161b22] rounded-xl p-6 border border-ink-200 dark:border-[#262c36] shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-ink-900 dark:text-white">Work Experience</h3>
                <button onClick={() => addItem('experience', emptyExperience)} className="text-sm text-primary-600 dark:text-primary-400 font-medium flex items-center gap-1 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                  <HiOutlinePlus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="space-y-5">
                {data.experience.map((exp, i) => (
                  <div key={i} className="p-4 rounded-lg border border-ink-200 dark:border-[#262c36] relative">
                    {data.experience.length > 1 && (
                      <button onClick={() => removeItem('experience', i)} className="absolute top-3 right-3 text-ink-400 hover:text-danger transition-colors">
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

            <section className="bg-white dark:bg-[#161b22] rounded-xl p-6 border border-ink-200 dark:border-[#262c36] shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-ink-900 dark:text-white">Education</h3>
                <button onClick={() => addItem('education', emptyEducation)} className="text-sm text-primary-600 dark:text-primary-400 font-medium flex items-center gap-1 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                  <HiOutlinePlus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="space-y-5">
                {data.education.map((edu, i) => (
                  <div key={i} className="p-4 rounded-lg border border-ink-200 dark:border-[#262c36] relative">
                    {data.education.length > 1 && (
                      <button onClick={() => removeItem('education', i)} className="absolute top-3 right-3 text-ink-400 hover:text-danger transition-colors">
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

            <section className="bg-white dark:bg-[#161b22] rounded-xl p-6 border border-ink-200 dark:border-[#262c36] shadow-soft">
              <h3 className="font-bold text-ink-900 dark:text-white mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {data.skills.map((s) => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-md bg-primary-50 dark:bg-primary-600/15 text-primary-700 dark:text-primary-300 flex items-center gap-1">
                    {s} <button onClick={() => removeSkill(s)} className="hover:text-primary-900 dark:hover:text-white transition-colors"><HiOutlineX className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Add a skill..." list="rb-skills" className={inputClass} />
                <datalist id="rb-skills">{SKILLS_LIST.map((s) => <option key={s} value={s} />)}</datalist>
                <button onClick={addSkill} className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium flex-shrink-0 transition-colors"><HiOutlinePlus className="w-4 h-4" /></button>
              </div>
            </section>
          </div>

          {/* ===== LIVE PREVIEW (sticky, side-by-side with the form) ===== */}
          <div className="lg:sticky lg:top-24 h-fit space-y-4">
            {/* Template picker */}
            <div className="flex items-center gap-2 print:hidden">
              <span className="text-xs uppercase tracking-wide text-ink-500 dark:text-ink-400 font-semibold mr-1">Template</span>
              <div className="flex flex-wrap gap-1.5">
                {TEMPLATES.map((t) => (
                  <button key={t.id} onClick={() => setTemplate(t.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      template === t.id
                        ? 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-600/15 dark:text-primary-300 dark:border-primary-600/30'
                        : 'bg-white dark:bg-[#161b22] text-ink-600 dark:text-ink-300 border-ink-200 dark:border-[#262c36] hover:bg-ink-50 dark:hover:bg-white/[0.04] hover:text-ink-900 dark:hover:text-white'
                    }`}>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
            {/* Paper — always light so the PDF prints clean regardless of app theme. */}
            <div id="resume-paper" className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <SelectedTemplate data={data} />
            </div>
          </div>
        </div>

        {/* ===== ATS SCORE (below the builder, updates live with the resume) ===== */}
        <div className="mt-8">
          <AtsScorePanel data={data} />
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
