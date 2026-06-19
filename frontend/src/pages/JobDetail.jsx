import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJob } from '../redux/slices/jobSlice';
import { applyForJob, toggleSaveJob } from '../redux/slices/applicationSlice';
import useAuth from '../hooks/useAuth';
import { formatSalary, formatDate, timeAgo } from '../utils/helpers';
import { HiOutlineLocationMarker, HiOutlineCurrencyRupee, HiOutlineBriefcase, HiOutlineClock, HiOutlineUsers, HiOutlineBookmark, HiBookmark, HiOutlineExternalLink, HiOutlineCalendar, HiOutlineCheckCircle, HiOutlineArrowLeft, HiOutlineSparkles, HiOutlineOfficeBuilding } from 'react-icons/hi';
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
      <div className="min-h-screen bg-[#030303] text-white pt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/[0.03] border border-white/[0.1] rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.06] animate-pulse"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-7 bg-white/[0.06] animate-pulse rounded w-2/3"></div>
                    <div className="h-4 bg-white/[0.06] animate-pulse rounded w-1/3"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-white/[0.06] animate-pulse rounded-xl"></div>)}
                </div>
                <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-4 bg-white/[0.06] animate-pulse rounded w-full"></div>)}</div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.1] rounded-2xl p-6 sm:p-8 space-y-3">
                {[...Array(5)].map((_, i) => <div key={i} className="h-4 bg-white/[0.06] animate-pulse rounded w-full"></div>)}
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white/[0.03] border border-white/[0.1] rounded-2xl p-6 space-y-4">
                {[...Array(4)].map((_, i) => <div key={i} className="h-5 bg-white/[0.06] animate-pulse rounded w-full"></div>)}
                <div className="h-12 bg-white/[0.06] animate-pulse rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-24 relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute top-10 -left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-40 -right-20 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-indigo-300 transition-colors mb-6">
          <HiOutlineArrowLeft className="w-4 h-4" /> Back to jobs
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="relative bg-white/[0.03] border border-white/[0.1] rounded-2xl p-6 sm:p-8 overflow-hidden">
              <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
              <div className="relative flex items-start gap-4 mb-6">
                {job.companyId?.logo ? (
                  <img src={job.companyId.logo} alt="" className="w-16 h-16 rounded-2xl object-cover shadow-lg ring-1 ring-white/[0.1]" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white font-bold text-2xl shadow-[0_8px_24px_0_rgba(99,102,241,0.35)]">
                    {job.companyId?.companyName?.[0] || 'C'}
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-1 text-balance">{job.title}</h1>
                  <Link to={`/company/${job.companyId?._id}`} className="text-indigo-300 hover:text-indigo-200 font-semibold transition-colors">
                    {job.companyId?.companyName}
                  </Link>
                  <p className="text-sm text-white/50 mt-1 flex items-center gap-1.5"><HiOutlineClock className="w-4 h-4" /> {timeAgo(job.postedDate)}</p>
                </div>
              </div>

              <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { icon: HiOutlineLocationMarker, label: 'Location', value: job.location },
                  { icon: HiOutlineCurrencyRupee, label: 'Salary', value: formatSalary(job.salary) },
                  { icon: HiOutlineBriefcase, label: 'Type', value: job.jobType?.replace('-', ' ') },
                  { icon: HiOutlineClock, label: 'Experience', value: `${job.experienceRequired?.min || 0}-${job.experienceRequired?.max || 0} yrs` },
                ].map((item, i) => (
                  <div key={i} className="group p-4 rounded-xl bg-white/[0.03] border border-white/[0.1] hover:bg-white/[0.05] hover:border-white/[0.2] transition-all duration-300">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-lg mb-2 group-hover:scale-110 transition-transform">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-white/50">{item.label}</p>
                    <p className="text-sm font-semibold text-white capitalize">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="relative flex flex-wrap gap-2">
                {job.skillsRequired?.map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/15 text-indigo-300">{skill}</span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white/[0.03] border border-white/[0.1] rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-rose-500"></span>
                <h2 className="text-lg font-bold text-white">Job Description</h2>
              </div>
              <div className="max-w-none text-white/60 whitespace-pre-line leading-relaxed">{job.description}</div>

              {job.requirements && (
                <>
                  <div className="flex items-center gap-3 mt-8 mb-4">
                    <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-rose-500"></span>
                    <h2 className="text-lg font-bold text-white">Requirements</h2>
                  </div>
                  <div className="text-white/60 whitespace-pre-line leading-relaxed">{job.requirements}</div>
                </>
              )}

              {job.benefits && (
                <>
                  <div className="flex items-center gap-3 mt-8 mb-4">
                    <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-rose-500"></span>
                    <h2 className="text-lg font-bold text-white">Benefits</h2>
                  </div>
                  <div className="text-white/60 whitespace-pre-line leading-relaxed">{job.benefits}</div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-white/[0.03] border border-white/[0.1] rounded-2xl p-6 sticky top-24">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full mb-4">
                <HiOutlineSparkles className="w-3.5 h-3.5" /> Job Overview
              </span>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm"><span className="text-white/60 flex items-center gap-1.5"><HiOutlineUsers className="w-4 h-4 text-indigo-400" /> Openings</span><span className="font-semibold text-white">{job.openings}</span></div>
                <div className="flex justify-between items-center text-sm"><span className="text-white/60 flex items-center gap-1.5"><HiOutlineUsers className="w-4 h-4 text-indigo-400" /> Applicants</span><span className="font-semibold text-white">{job.applicationsCount || 0}</span></div>
                {job.deadline && <div className="flex justify-between items-center text-sm"><span className="text-white/60 flex items-center gap-1.5"><HiOutlineCalendar className="w-4 h-4 text-indigo-400" /> Deadline</span><span className="font-semibold text-white">{formatDate(job.deadline)}</span></div>}
                <div className="flex justify-between items-center text-sm"><span className="text-white/60 flex items-center gap-1.5"><HiOutlineClock className="w-4 h-4 text-indigo-400" /> Posted</span><span className="font-semibold text-white">{formatDate(job.postedDate)}</span></div>
              </div>

              {hasApplied ? (
                <div className="w-full py-3 rounded-xl bg-emerald-500/15 text-emerald-300 text-center font-semibold flex items-center justify-center gap-2 border border-emerald-500/20">
                  <HiOutlineCheckCircle className="w-5 h-5" /> Already Applied
                </div>
              ) : (
                <button onClick={handleApply} disabled={applying || !isCandidate}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-rose-500 text-white rounded-xl font-semibold shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2">
                  {applying ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Apply Now</>}
                </button>
              )}

              {isAuthenticated && (
                <button onClick={() => dispatch(toggleSaveJob(id))}
                  className="w-full mt-3 py-3 rounded-xl border border-white/[0.12] text-white/80 font-medium hover:bg-white/[0.06] transition-colors flex items-center justify-center gap-2">
                  {isSaved ? <><HiBookmark className="w-5 h-5 text-indigo-400" /> Saved</> : <><HiOutlineBookmark className="w-5 h-5" /> Save Job</>}
                </button>
              )}
            </div>

            {/* Company Card */}
            {job.companyId && (
              <div className="bg-white/[0.03] border border-white/[0.1] rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/[0.2] transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-rose-500"></span>
                  <h3 className="font-bold text-white">About the Company</h3>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  {job.companyId.logo ? (
                    <img src={job.companyId.logo} alt="" className="w-12 h-12 rounded-xl object-cover shadow-lg ring-1 ring-white/[0.1]" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white font-bold shadow-[0_8px_24px_0_rgba(99,102,241,0.35)]">{job.companyId.companyName?.[0]}</div>
                  )}
                  <div>
                    <p className="font-semibold text-white">{job.companyId.companyName}</p>
                    <p className="text-xs text-white/50 flex items-center gap-1"><HiOutlineLocationMarker className="w-3.5 h-3.5" /> {job.companyId.location}</p>
                  </div>
                </div>
                {job.companyId.description && <p className="text-sm text-white/60 line-clamp-3 mb-4 leading-relaxed">{job.companyId.description}</p>}
                <Link to={`/company/${job.companyId._id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-300 hover:text-indigo-200 transition-colors">
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
