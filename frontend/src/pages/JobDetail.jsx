import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJob } from '../redux/slices/jobSlice';
import { applyForJob, toggleSaveJob } from '../redux/slices/applicationSlice';
import useAuth from '../hooks/useAuth';
import { formatSalary, formatDate, timeAgo } from '../utils/helpers';
import { HiOutlineLocationMarker, HiOutlineCurrencyRupee, HiOutlineBriefcase, HiOutlineClock, HiOutlineUsers, HiOutlineBookmark, HiBookmark, HiOutlineExternalLink, HiOutlineCalendar, HiOutlineCheckCircle, HiOutlineArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';

const JobDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentJob: job, loading } = useSelector((s) => s.jobs);
  const { savedJobIds, myApplications } = useSelector((s) => s.applications);
  const { isAuthenticated, isCandidate } = useAuth();
  const [applying, setApplying] = useState(false);

  useEffect(() => { dispatch(fetchJob(id)); }, [dispatch, id]);

  const hasApplied = myApplications.some((a) => a.jobId?._id === id || a.jobId === id);
  const isSaved = savedJobIds.includes(id);

  const handleApply = async () => {
    if (!isAuthenticated) return navigate('/login');
    if (!isCandidate) return toast.error('Only candidates can apply');
    if (hasApplied) return toast.error('Already applied');
    setApplying(true);
    try {
      await dispatch(applyForJob({ jobId: id })).unwrap();
      toast.success('Application submitted successfully!');
    } catch (err) { toast.error(err || 'Failed to apply'); }
    finally { setApplying(false); }
  };

  if (loading || !job) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl skeleton"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-7 skeleton rounded w-2/3"></div>
                    <div className="h-4 skeleton rounded w-1/3"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {[...Array(4)].map((_, i) => <div key={i} className="h-20 skeleton rounded-xl"></div>)}
                </div>
                <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-4 skeleton rounded w-full"></div>)}</div>
              </div>
              <div className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-6 sm:p-8 space-y-3">
                {[...Array(5)].map((_, i) => <div key={i} className="h-4 skeleton rounded w-full"></div>)}
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-6 space-y-4">
                {[...Array(4)].map((_, i) => <div key={i} className="h-5 skeleton rounded w-full"></div>)}
                <div className="h-12 skeleton rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 dark:text-ink-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-6">
          <HiOutlineArrowLeft className="w-4 h-4" /> Back to jobs
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-6 sm:p-8 shadow-soft">
              <div className="flex items-start gap-4 mb-6">
                {job.companyId?.logo ? (
                  <img src={job.companyId.logo} alt="" className="w-16 h-16 rounded-xl object-cover border border-ink-200 dark:border-[#262c36] flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-2xl flex-shrink-0">
                    {job.companyId?.companyName?.[0] || 'C'}
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-ink-900 dark:text-white mb-1 text-balance">{job.title}</h1>
                  <Link to={`/company/${job.companyId?._id}`} className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors">
                    {job.companyId?.companyName}
                  </Link>
                  <p className="text-sm text-ink-500 dark:text-ink-400 mt-1 flex items-center gap-1.5"><HiOutlineClock className="w-4 h-4 text-ink-400" /> {timeAgo(job.postedDate)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { icon: HiOutlineLocationMarker, label: 'Location', value: job.location },
                  { icon: HiOutlineCurrencyRupee, label: 'Salary', value: formatSalary(job.salary) },
                  { icon: HiOutlineBriefcase, label: 'Type', value: job.jobType?.replace('-', ' ') },
                  { icon: HiOutlineClock, label: 'Experience', value: `${job.experienceRequired?.min || 0}-${job.experienceRequired?.max || 0} yrs` },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-ink-50 dark:bg-white/[0.03] border border-ink-200 dark:border-[#262c36]">
                    <div className="w-9 h-9 rounded-lg bg-ink-100 dark:bg-white/[0.06] flex items-center justify-center text-ink-500 dark:text-ink-400 mb-2">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-ink-500 dark:text-ink-400">{item.label}</p>
                    <p className="text-sm font-semibold text-ink-900 dark:text-white capitalize">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {job.skillsRequired?.map((skill) => (
                  <span key={skill} className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-ink-100 dark:bg-white/[0.06] text-ink-600 dark:text-ink-300">{skill}</span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-6 sm:p-8 shadow-soft">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-1 h-6 rounded-full bg-primary-600 dark:bg-primary-500"></span>
                <h2 className="text-lg font-bold text-ink-900 dark:text-white">Job Description</h2>
              </div>
              <div className="max-w-none text-ink-600 dark:text-ink-400 whitespace-pre-line leading-relaxed">{job.description}</div>

              {job.requirements && (
                <>
                  <div className="flex items-center gap-3 mt-8 mb-4">
                    <span className="w-1 h-6 rounded-full bg-primary-600 dark:bg-primary-500"></span>
                    <h2 className="text-lg font-bold text-ink-900 dark:text-white">Requirements</h2>
                  </div>
                  <div className="text-ink-600 dark:text-ink-400 whitespace-pre-line leading-relaxed">{job.requirements}</div>
                </>
              )}

              {job.benefits && (
                <>
                  <div className="flex items-center gap-3 mt-8 mb-4">
                    <span className="w-1 h-6 rounded-full bg-primary-600 dark:bg-primary-500"></span>
                    <h2 className="text-lg font-bold text-ink-900 dark:text-white">Benefits</h2>
                  </div>
                  <div className="text-ink-600 dark:text-ink-400 whitespace-pre-line leading-relaxed">{job.benefits}</div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-6 shadow-soft sticky top-24">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-600/15 px-3 py-1 rounded-md mb-4">
                Job Overview
              </span>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm"><span className="text-ink-600 dark:text-ink-400 flex items-center gap-1.5"><HiOutlineUsers className="w-4 h-4 text-ink-400" /> Openings</span><span className="font-semibold text-ink-900 dark:text-white">{job.openings}</span></div>
                <div className="flex justify-between items-center text-sm"><span className="text-ink-600 dark:text-ink-400 flex items-center gap-1.5"><HiOutlineUsers className="w-4 h-4 text-ink-400" /> Applicants</span><span className="font-semibold text-ink-900 dark:text-white">{job.applicationsCount || 0}</span></div>
                {job.deadline && <div className="flex justify-between items-center text-sm"><span className="text-ink-600 dark:text-ink-400 flex items-center gap-1.5"><HiOutlineCalendar className="w-4 h-4 text-ink-400" /> Deadline</span><span className="font-semibold text-ink-900 dark:text-white">{formatDate(job.deadline)}</span></div>}
                <div className="flex justify-between items-center text-sm"><span className="text-ink-600 dark:text-ink-400 flex items-center gap-1.5"><HiOutlineClock className="w-4 h-4 text-ink-400" /> Posted</span><span className="font-semibold text-ink-900 dark:text-white">{formatDate(job.postedDate)}</span></div>
              </div>

              {hasApplied ? (
                <div className="w-full py-3 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-center font-semibold flex items-center justify-center gap-2 border border-green-200 dark:border-green-500/20">
                  <HiOutlineCheckCircle className="w-5 h-5" /> Already Applied
                </div>
              ) : (
                <button onClick={handleApply} disabled={applying || !isCandidate}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {applying ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Apply Now</>}
                </button>
              )}

              {isAuthenticated && (
                <button onClick={() => dispatch(toggleSaveJob(id))}
                  className="w-full mt-3 py-3 rounded-lg border border-ink-300 dark:border-[#262c36] text-ink-800 dark:text-ink-100 font-semibold hover:bg-ink-50 dark:hover:bg-white/[0.04] transition-colors flex items-center justify-center gap-2">
                  {isSaved ? <><HiBookmark className="w-5 h-5 text-primary-600 dark:text-primary-400" /> Saved</> : <><HiOutlineBookmark className="w-5 h-5" /> Save Job</>}
                </button>
              )}
            </div>

            {/* Company Card */}
            {job.companyId && (
              <div className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-6 shadow-soft card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-1 h-6 rounded-full bg-primary-600 dark:bg-primary-500"></span>
                  <h3 className="font-bold text-ink-900 dark:text-white">About the Company</h3>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  {job.companyId.logo ? (
                    <img src={job.companyId.logo} alt="" className="w-12 h-12 rounded-lg object-cover border border-ink-200 dark:border-[#262c36]" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold flex-shrink-0">{job.companyId.companyName?.[0]}</div>
                  )}
                  <div>
                    <p className="font-semibold text-ink-900 dark:text-white">{job.companyId.companyName}</p>
                    <p className="text-xs text-ink-500 dark:text-ink-400 flex items-center gap-1"><HiOutlineLocationMarker className="w-3.5 h-3.5 text-ink-400" /> {job.companyId.location}</p>
                  </div>
                </div>
                {job.companyId.description && <p className="text-sm text-ink-600 dark:text-ink-400 line-clamp-3 mb-4 leading-relaxed">{job.companyId.description}</p>}
                <Link to={`/company/${job.companyId._id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                  View Company <HiOutlineExternalLink className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
