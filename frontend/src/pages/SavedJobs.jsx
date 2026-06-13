import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSavedJobs, toggleSaveJob } from '../redux/slices/applicationSlice';
import { formatSalary, timeAgo } from '../utils/helpers';
import { HiOutlineBookmark, HiOutlineTrash, HiOutlineLocationMarker, HiOutlineCurrencyRupee } from 'react-icons/hi';

const SavedJobs = () => {
  const dispatch = useDispatch();
  const { savedJobs, loading } = useSelector((s) => s.applications);

  useEffect(() => { dispatch(fetchSavedJobs()); }, [dispatch]);

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-8 animate-fade-in">Saved Jobs</h1>

        {loading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl"></div>)}</div>
        ) : savedJobs.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <HiOutlineBookmark className="w-16 h-16 mx-auto text-dark-300 mb-4" />
            <h3 className="text-xl font-semibold text-dark-700 dark:text-dark-300 mb-2">No saved jobs</h3>
            <p className="text-dark-500 mb-4">Save jobs while browsing to see them here</p>
            <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
          </div>
        ) : (
          <div className="space-y-4 stagger-children">
            {savedJobs.map((s) => (
              <div key={s._id} className="bg-white dark:bg-dark-800 rounded-2xl p-5 border border-gray-100 dark:border-dark-700 card-hover">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white font-bold flex-shrink-0">
                    {s.jobId?.companyId?.companyName?.[0] || 'J'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/jobs/${s.jobId?._id}`} className="font-semibold text-dark-900 dark:text-white hover:text-primary-600">{s.jobId?.title}</Link>
                    <p className="text-sm text-dark-500">{s.jobId?.companyId?.companyName}</p>
                    <div className="flex items-center gap-3 text-xs text-dark-500 mt-1">
                      <span className="flex items-center gap-1"><HiOutlineLocationMarker className="w-3 h-3" />{s.jobId?.location}</span>
                      <span className="flex items-center gap-1"><HiOutlineCurrencyRupee className="w-3 h-3" />{formatSalary(s.jobId?.salary)}</span>
                    </div>
                  </div>
                  <button onClick={() => dispatch(toggleSaveJob(s.jobId?._id))} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-dark-400 hover:text-red-500 transition-colors">
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
