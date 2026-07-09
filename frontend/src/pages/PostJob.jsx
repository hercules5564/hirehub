import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createJob, updateJob, fetchJob } from '../redux/slices/jobSlice';
import { fetchMyCompanies } from '../redux/slices/companySlice';
import { HiOutlineArrowLeft, HiOutlineBriefcase, HiOutlineExclamationCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-ink-300 dark:border-[#262c36] bg-white dark:bg-[#0d1117] text-ink-900 dark:text-ink-100 placeholder-ink-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm transition [&>option]:bg-white dark:[&>option]:bg-[#161b22] [&>option]:text-ink-900 dark:[&>option]:text-white';
const labelClass = 'block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5';

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
    <div className="min-h-screen bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link to="/recruiter/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 dark:text-ink-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-6 group">
          <HiOutlineArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
            <HiOutlineBriefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-1">{isEdit ? 'Edit listing' : 'New listing'}</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white">
              {isEdit ? 'Edit Job' : 'Post a New Job'}
            </h1>
            <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">Fill in the details to {isEdit ? 'update your' : 'publish a new'} job listing</p>
          </div>
        </div>

        {myCompanies.length === 0 ? (
          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-lg bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <HiOutlineExclamationCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-amber-800 dark:text-amber-300 mb-1">Create a company first</h3>
                <p className="text-sm text-amber-700 dark:text-amber-200/80 mb-4">You need a company profile before you can post jobs.</p>
                <Link to="/recruiter/company" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-colors">Create Company</Link>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl shadow-soft p-6 sm:p-8 space-y-5">
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

            <div className="flex items-center gap-3 pt-4 border-t border-ink-200 dark:border-[#262c36]">
              <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                <HiOutlineBriefcase className="w-5 h-5" />
                {submitting ? 'Saving...' : isEdit ? 'Update Job' : 'Post Job'}
              </button>
              <Link to="/recruiter/dashboard" className="inline-flex items-center px-6 py-2.5 rounded-lg font-semibold border border-ink-300 dark:border-[#262c36] text-ink-800 dark:text-ink-100 hover:bg-ink-50 dark:hover:bg-white/[0.04] transition-colors">Cancel</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PostJob;
