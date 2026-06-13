import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJob } from '../redux/slices/jobSlice';
import { applyForJob, toggleSaveJob } from '../redux/slices/applicationSlice';
import useAuth from '../hooks/useAuth';
import { formatSalary, formatDate, timeAgo } from '../utils/helpers';
import { HiOutlineLocationMarker, HiOutlineCurrencyRupee, HiOutlineBriefcase, HiOutlineClock, HiOutlineUsers, HiOutlineBookmark, HiBookmark, HiOutlineExternalLink, HiOutlineCalendar, HiOutlineCheckCircle } from 'react-icons/hi';
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
      <div className="min-h-screen bg-dark-50 dark:bg-dark-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white dark:bg-dark-800 rounded-2xl p-8 animate-pulse">
            <div className="h-8 skeleton w-2/3 mb-4"></div>
            <div className="h-4 skeleton w-1/3 mb-8"></div>
            <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-4 skeleton w-full"></div>)}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in">
            {/* Header Card */}
            <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-dark-700">
              <div className="flex items-start gap-4 mb-6">
                {job.companyId?.logo ? (
                  <img src={job.companyId.logo} alt="" className="w-16 h-16 rounded-2xl object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white font-bold text-2xl">
                    {job.companyId?.companyName?.[0] || 'C'}
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-1">{job.title}</h1>
                  <Link to={`/company/${job.companyId?._id}`} className="text-primary-600 hover:text-primary-700 font-medium">
                    {job.companyId?.companyName}
                  </Link>
                  <p className="text-sm text-dark-500 mt-1">{timeAgo(job.postedDate)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { icon: HiOutlineLocationMarker, label: 'Location', value: job.location },
                  { icon: HiOutlineCurrencyRupee, label: 'Salary', value: formatSalary(job.salary) },
                  { icon: HiOutlineBriefcase, label: 'Type', value: job.jobType?.replace('-', ' ') },
                  { icon: HiOutlineClock, label: 'Experience', value: `${job.experienceRequired?.min || 0}-${job.experienceRequired?.max || 0} yrs` },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-dark-50 dark:bg-dark-700">
                    <item.icon className="w-5 h-5 text-primary-500 mb-1" />
                    <p className="text-xs text-dark-500">{item.label}</p>
                    <p className="text-sm font-semibold text-dark-900 dark:text-white capitalize">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {job.skillsRequired?.map((skill) => (
                  <span key={skill} className="badge bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">{skill}</span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-dark-700">
              <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4">Job Description</h2>
              <div className="prose prose-sm dark:prose-invert max-w-none text-dark-600 dark:text-dark-300 whitespace-pre-line leading-relaxed">{job.description}</div>

              {job.requirements && (
                <>
                  <h2 className="text-lg font-bold text-dark-900 dark:text-white mt-8 mb-4">Requirements</h2>
                  <div className="text-dark-600 dark:text-dark-300 whitespace-pre-line leading-relaxed">{job.requirements}</div>
                </>
              )}

              {job.benefits && (
                <>
                  <h2 className="text-lg font-bold text-dark-900 dark:text-white mt-8 mb-4">Benefits</h2>
                  <div className="text-dark-600 dark:text-dark-300 whitespace-pre-line leading-relaxed">{job.benefits}</div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 animate-slide-in-right">
            {/* Apply Card */}
            <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700 sticky top-24">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm"><span className="text-dark-500">Openings</span><span className="font-semibold text-dark-900 dark:text-white">{job.openings}</span></div>
                <div className="flex justify-between text-sm"><span className="text-dark-500">Applicants</span><span className="font-semibold text-dark-900 dark:text-white">{job.applicationsCount || 0}</span></div>
                {job.deadline && <div className="flex justify-between text-sm"><span className="text-dark-500">Deadline</span><span className="font-semibold text-dark-900 dark:text-white">{formatDate(job.deadline)}</span></div>}
                <div className="flex justify-between text-sm"><span className="text-dark-500">Posted</span><span className="font-semibold text-dark-900 dark:text-white">{formatDate(job.postedDate)}</span></div>
              </div>

              {hasApplied ? (
                <div className="w-full py-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-center font-semibold flex items-center justify-center gap-2">
                  <HiOutlineCheckCircle className="w-5 h-5" /> Already Applied
                </div>
              ) : (
                <button onClick={handleApply} disabled={applying || !isCandidate}
                  className="w-full py-3 gradient-primary text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {applying ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Apply Now</>}
                </button>
              )}

              {isAuthenticated && (
                <button onClick={() => dispatch(toggleSaveJob(id))}
                  className="w-full mt-3 py-3 rounded-xl border border-gray-200 dark:border-dark-600 text-dark-700 dark:text-dark-300 font-medium hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors flex items-center justify-center gap-2">
                  {isSaved ? <><HiBookmark className="w-5 h-5 text-primary-500" /> Saved</> : <><HiOutlineBookmark className="w-5 h-5" /> Save Job</>}
                </button>
              )}
            </div>

            {/* Company Card */}
            {job.companyId && (
              <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700">
                <h3 className="font-bold text-dark-900 dark:text-white mb-4">About the Company</h3>
                <div className="flex items-center gap-3 mb-3">
                  {job.companyId.logo ? (
                    <img src={job.companyId.logo} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold">{job.companyId.companyName?.[0]}</div>
                  )}
                  <div>
                    <p className="font-semibold text-dark-900 dark:text-white">{job.companyId.companyName}</p>
                    <p className="text-xs text-dark-500">{job.companyId.location}</p>
                  </div>
                </div>
                {job.companyId.description && <p className="text-sm text-dark-500 line-clamp-3 mb-4">{job.companyId.description}</p>}
                <Link to={`/company/${job.companyId._id}`} className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
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
