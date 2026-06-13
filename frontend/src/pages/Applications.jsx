import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyApplications } from '../redux/slices/applicationSlice';
import { formatSalary, timeAgo } from '../utils/helpers';
import { APPLICATION_STATUS } from '../utils/constants';
import { HiOutlineBriefcase } from 'react-icons/hi';

const Applications = () => {
  const dispatch = useDispatch();
  const { myApplications, loading } = useSelector((s) => s.applications);

  useEffect(() => { dispatch(fetchMyApplications()); }, [dispatch]);

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-8 animate-fade-in">My Applications</h1>

        {loading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl"></div>)}</div>
        ) : myApplications.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <HiOutlineBriefcase className="w-16 h-16 mx-auto text-dark-300 mb-4" />
            <h3 className="text-xl font-semibold text-dark-700 dark:text-dark-300 mb-2">No applications yet</h3>
            <Link to="/jobs" className="btn-primary mt-4">Browse Jobs</Link>
          </div>
        ) : (
          <div className="space-y-4 stagger-children">
            {myApplications.map((app) => (
              <div key={app._id} className="bg-white dark:bg-dark-800 rounded-2xl p-5 border border-gray-100 dark:border-dark-700 card-hover">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white font-bold flex-shrink-0">
                    {app.jobId?.companyId?.companyName?.[0] || 'J'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/jobs/${app.jobId?._id}`} className="font-semibold text-dark-900 dark:text-white hover:text-primary-600 transition-colors">
                      {app.jobId?.title || 'Position'}
                    </Link>
                    <p className="text-sm text-dark-500">{app.jobId?.companyId?.companyName} • {app.jobId?.location}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-dark-500">
                      <span>{formatSalary(app.jobId?.salary)}</span>
                      <span>Applied {timeAgo(app.appliedAt)}</span>
                    </div>
                  </div>
                  <span className={`badge text-xs flex-shrink-0 ${APPLICATION_STATUS[app.status]?.color || ''}`}>
                    {APPLICATION_STATUS[app.status]?.label || app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
