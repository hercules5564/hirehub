import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSavedJobs, toggleSaveJob } from '../redux/slices/applicationSlice';
import { formatSalary, timeAgo } from '../utils/helpers';
import { HiOutlineBookmark, HiOutlineTrash, HiOutlineLocationMarker, HiOutlineCurrencyRupee, HiOutlineArrowRight } from 'react-icons/hi';

const SavedJobs = () => {
  const dispatch = useDispatch();
  const { savedJobs, loading } = useSelector((s) => s.applications);

  useEffect(() => { dispatch(fetchSavedJobs()); }, [dispatch]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300">
      {/* Header */}
      <div className="border-b border-ink-200 dark:border-[#262c36] bg-ink-50 dark:bg-[#11161f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white text-balance">
            Saved Jobs
          </h1>
          <p className="mt-1.5 text-ink-500 dark:text-ink-400">Roles you have bookmarked, all in one place.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-24 skeleton rounded-xl"></div>)}</div>
        ) : savedJobs.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-ink-100 dark:bg-white/[0.06] flex items-center justify-center text-ink-400">
              <HiOutlineBookmark className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-ink-900 dark:text-white mb-1.5">No saved jobs yet</h3>
            <p className="text-ink-500 dark:text-ink-400 mb-5 max-w-sm mx-auto text-balance">Save jobs while browsing and they will show up here so you can apply later.</p>
            <Link to="/jobs" className="btn-primary">Browse Jobs <HiOutlineArrowRight className="w-5 h-5" /></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((s) => (
              <div key={s._id} className="group bg-white dark:bg-[#161b22] rounded-xl p-5 border border-ink-200 dark:border-[#262c36] card-hover">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold flex-shrink-0">
                    {s.jobId?.companyId?.companyName?.[0] || 'J'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/jobs/${s.jobId?._id}`} className="font-semibold text-ink-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{s.jobId?.title}</Link>
                    <p className="text-sm text-ink-500 dark:text-ink-400">{s.jobId?.companyId?.companyName}</p>
                    <div className="flex items-center gap-2 text-xs text-ink-600 dark:text-ink-300 mt-2">
                      <span className="inline-flex items-center gap-1 bg-ink-100 dark:bg-white/[0.06] px-2.5 py-1 rounded-md"><HiOutlineLocationMarker className="w-3.5 h-3.5 text-ink-400" />{s.jobId?.location}</span>
                      <span className="inline-flex items-center gap-1 bg-ink-100 dark:bg-white/[0.06] px-2.5 py-1 rounded-md"><HiOutlineCurrencyRupee className="w-3.5 h-3.5 text-ink-400" />{formatSalary(s.jobId?.salary)}</span>
                    </div>
                  </div>
                  <button onClick={() => dispatch(toggleSaveJob(s.jobId?._id))} className="p-2.5 rounded-lg text-ink-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40" aria-label="Remove saved job">
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
