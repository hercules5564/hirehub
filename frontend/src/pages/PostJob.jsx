import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createJob, updateJob, fetchJob } from '../redux/slices/jobSlice';
import { fetchMyCompanies } from '../redux/slices/companySlice';
import { HiOutlineArrowLeft, HiOutlineBriefcase, HiOutlineSparkles, HiOutlineExclamationCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';

const inputClass =
  'w-full px-4 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.06] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none text-sm [&>option]:bg-[#0a0a0a] [&>option]:text-white';
const labelClass = 'block text-sm font-medium text-white/70 mb-1';

const emptyForm = {
  title: '',
  companyId: '',
  location: '',
  jobType: 'full-time',
  salaryMin: '',
  salaryMax: '',
  experienceMin: '',
  experienceMax: '',
  skills: '',
  openings: 1,
  deadline: '',
  description: '',
  requirements: '',
  benefits: '',
  status: 'active',
};

const PostJob = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myCompanies } = useSelector((s) => s.companies);
  const { currentJob } = useSelector((s) => s.jobs);

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchMyCompanies());
    if (isEdit) dispatch(fetchJob(id));
  }, [dispatch, id, isEdit]);

  // Populate form when editing an existing job
  useEffect(() => {
    if (isEdit && currentJob && currentJob._id === id) {
      setForm({
        title: currentJob.title || '',
        companyId: currentJob.companyId?._id || currentJob.companyId || '',
        location: currentJob.location || '',
        jobType: currentJob.jobType || 'full-time',
        salaryMin: currentJob.salary?.min || '',
        salaryMax: currentJob.salary?.max || '',
        experienceMin: currentJob.experienceRequired?.min || '',
        experienceMax: currentJob.experienceRequired?.max || '',
        skills: (currentJob.skillsRequired || []).join(', '),
        openings: currentJob.openings || 1,
        deadline: currentJob.deadline ? currentJob.deadline.slice(0, 10) : '',
        description: currentJob.description || '',
        requirements: currentJob.requirements || '',
        benefits: currentJob.benefits || '',
        status: currentJob.status || 'active',
      });
    }
  }, [isEdit, currentJob, id]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.companyId || !form.location.trim() || !form.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const payload = {
      title: form.title.trim(),
      companyId: form.companyId,
      location: form.location.trim(),
      jobType: form.jobType,
      salary: {
        min: Number(form.salaryMin) || 0,
        max: Number(form.salaryMax) || 0,
        currency: 'INR',
      },
      experienceRequired: {
        min: Number(form.experienceMin) || 0,
        max: Number(form.experienceMax) || 0,
      },
      skillsRequired: form.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      openings: Number(form.openings) || 1,
      deadline: form.deadline || undefined,
      description: form.description.trim(),
      requirements: form.requirements.trim(),
      benefits: form.benefits.trim(),
      status: form.status,
    };

    setSubmitting(true);
    try {
      if (isEdit) {
        await dispatch(updateJob({ id, data: payload })).unwrap();
        toast.success('Job updated');
      } else {
        await dispatch(createJob(payload)).unwrap();
        toast.success('Job posted');
      }
      navigate('/recruiter/dashboard');
    } catch (err) {
      toast.error(err || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030303] text-white pt-20 overflow-hidden">
      {/* Decorative ambient blobs */}
      <div className="pointer-events-none absolute -top-10 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
      <div className="pointer-events-none absolute top-1/3 -left-20 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/recruiter/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-indigo-300 transition-colors mb-6 group">
          <HiOutlineArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] shrink-0">
            <HiOutlineBriefcase className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full mb-2">
              <HiOutlineSparkles className="w-3.5 h-3.5" /> {isEdit ? 'Edit Listing' : 'New Listing'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {isEdit ? 'Edit ' : 'Post a New '}<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">Job</span>
            </h1>
            <p className="text-sm text-white/60 mt-1">Fill in the details to {isEdit ? 'update your' : 'publish a new'} job listing</p>
          </div>
        </div>

        {myCompanies.length === 0 ? (
          <div className="relative bg-white/[0.03] border border-amber-400/30 rounded-2xl p-8 overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl"></div>
            <div className="relative flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shrink-0">
                <HiOutlineExclamationCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white mb-1">Create a company first</h3>
                <p className="text-sm text-white/60 mb-4">You need a company profile before you can post jobs.</p>
                <Link to="/recruiter/company" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300">Create Company</Link>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/[0.1] rounded-2xl p-6 sm:p-8 space-y-5">
            <div>
              <label className={labelClass}>Job Title *</label>
              <input type="text" value={form.title} onChange={update('title')} maxLength={100} placeholder="e.g. Senior Frontend Developer" className={inputClass} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Company *</label>
                <select value={form.companyId} onChange={update('companyId')} className={inputClass}>
                  <option value="">Select a company</option>
                  {myCompanies.map((c) => (
                    <option key={c._id} value={c._id}>{c.companyName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Location *</label>
                <input type="text" value={form.location} onChange={update('location')} placeholder="e.g. Bengaluru, India" className={inputClass} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Job Type</label>
                <select value={form.jobType} onChange={update('jobType')} className={inputClass}>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Number of Openings</label>
                <input type="number" min={1} value={form.openings} onChange={update('openings')} className={inputClass} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Salary Min (₹ / year)</label>
                <input type="number" min={0} value={form.salaryMin} onChange={update('salaryMin')} placeholder="e.g. 600000" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Salary Max (₹ / year)</label>
                <input type="number" min={0} value={form.salaryMax} onChange={update('salaryMax')} placeholder="e.g. 1200000" className={inputClass} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Experience Min (years)</label>
                <input type="number" min={0} value={form.experienceMin} onChange={update('experienceMin')} placeholder="e.g. 2" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Experience Max (years)</label>
                <input type="number" min={0} value={form.experienceMax} onChange={update('experienceMax')} placeholder="e.g. 5" className={inputClass} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Application Deadline</label>
                <input type="date" value={form.deadline} onChange={update('deadline')} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select value={form.status} onChange={update('status')} className={inputClass}>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Skills Required</label>
              <input type="text" value={form.skills} onChange={update('skills')} placeholder="Comma separated, e.g. React, Node.js, MongoDB" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Job Description *</label>
              <textarea rows={6} value={form.description} onChange={update('description')} maxLength={5000} placeholder="Describe the role, responsibilities, and what the day-to-day looks like..." className={`${inputClass} resize-none`} />
            </div>

            <div>
              <label className={labelClass}>Requirements</label>
              <textarea rows={4} value={form.requirements} onChange={update('requirements')} maxLength={3000} placeholder="Qualifications, must-have experience, education..." className={`${inputClass} resize-none`} />
            </div>

            <div>
              <label className={labelClass}>Benefits</label>
              <textarea rows={3} value={form.benefits} onChange={update('benefits')} maxLength={2000} placeholder="Health insurance, remote work, learning budget..." className={`${inputClass} resize-none`} />
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/[0.08]">
              <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]">
                <HiOutlineBriefcase className="w-5 h-5" />
                {submitting ? 'Saving...' : isEdit ? 'Update Job' : 'Post Job'}
              </button>
              <Link to="/recruiter/dashboard" className="inline-flex items-center px-6 py-2.5 rounded-xl border border-white/[0.12] text-white/80 hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]">Cancel</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PostJob;
