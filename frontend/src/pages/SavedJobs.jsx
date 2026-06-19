import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSavedJobs, toggleSaveJob } from '../redux/slices/applicationSlice';
import { formatSalary, timeAgo } from '../utils/helpers';
import { HiOutlineBookmark, HiOutlineTrash, HiOutlineLocationMarker, HiOutlineCurrencyRupee, HiOutlineSparkles, HiOutlineArrowRight } from 'react-icons/hi';

const accentText = 'bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300';
const gradientBtn = 'bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300';

const SavedJobs = () => {
  const dispatch = useDispatch();
  const { savedJobs, loading } = useSelector((s) => s.applications);

  useEffect(() => { dispatch(fetchSavedJobs()); }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-24">
      {/* Decorative aurora background */}
      <div className="absolute inset-x-0 top-0 h-96 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 left-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/70 bg-white/[0.03] border border-white/[0.1] backdrop-blur-sm px-3 py-1 rounded-full mb-4">
            <HiOutlineSparkles className="w-4 h-4 text-indigo-300" /> Your Shortlist
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Saved <span className={accentText}>Jobs</span>
          </h1>
          <p className="mt-2 text-white/60">Roles you have bookmarked, all in one place.</p>
        </div>

        {loading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-white/[0.06] animate-pulse rounded-2xl"></div>)}</div>
        ) : savedJobs.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-[0_8px_32px_0_rgba(99,102,241,0.3)]">
              <HiOutlineBookmark className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No saved jobs yet</h3>
            <p className="text-white/60 mb-6 max-w-sm mx-auto text-balance">Save jobs while browsing and they will show up here so you can apply later.</p>
            <Link to="/jobs" className={`inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-semibold ${gradientBtn}`}>Browse Jobs <HiOutlineArrowRight className="w-5 h-5" /></Link>
          </div>
        ) : (
          <div className="space-y-4 stagger-children">
            {savedJobs.map((s) => (
              <div key={s._id} className="group bg-white/[0.03] rounded-2xl p-5 border border-white/[0.1] hover:bg-white/[0.05] hover:border-white/[0.2] transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    {s.jobId?.companyId?.companyName?.[0] || 'J'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/jobs/${s.jobId?._id}`} className="font-semibold text-white hover:text-indigo-300 transition-colors">{s.jobId?.title}</Link>
                    <p className="text-sm text-white/50">{s.jobId?.companyId?.companyName}</p>
                    <div className="flex items-center gap-3 text-xs text-white/60 mt-2">
                      <span className="inline-flex items-center gap-1 bg-white/[0.06] px-2.5 py-1 rounded-full"><HiOutlineLocationMarker className="w-3.5 h-3.5 text-indigo-400" />{s.jobId?.location}</span>
                      <span className="inline-flex items-center gap-1 bg-white/[0.06] px-2.5 py-1 rounded-full"><HiOutlineCurrencyRupee className="w-3.5 h-3.5 text-indigo-400" />{formatSalary(s.jobId?.salary)}</span>
                    </div>
                  </div>
                  <button onClick={() => dispatch(toggleSaveJob(s.jobId?._id))} className="p-2.5 rounded-xl hover:bg-rose-500/15 text-white/50 hover:text-rose-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]" aria-label="Remove saved job">
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
