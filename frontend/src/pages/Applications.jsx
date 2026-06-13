import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchMyApplications, withdrawApplication } from '../redux/slices/applicationSlice';
import { formatSalary, timeAgo } from '../utils/helpers';
import { APPLICATION_STATUS } from '../utils/constants';
import { HiOutlineBriefcase } from 'react-icons/hi';

// Statuses where the application is final and can no longer be withdrawn.
const NON_WITHDRAWABLE = ['withdrawn', 'rejected', 'offered'];

const Applications = () => {
  const dispatch = useDispatch();
  const { myApplications, loading } = useSelector((s) => s.applications);
  const [withdrawingId, setWithdrawingId] = useState(null);

  useEffect(() => { dispatch(fetchMyApplications()); }, [dispatch]);

  const handleWithdraw = async (app) => {
    const title = app.jobId?.title || 'this position';
    if (!window.confirm(`Withdraw your application for ${title}? This cannot be undone.`)) return;
    setWithdrawingId(app._id);
    const result = await dispatch(withdrawApplication(app._id));
    setWithdrawingId(null);
    if (withdrawApplication.fulfilled.match(result)) toast.success('Application withdrawn');
    else toast.error(result.payload || 'Failed to withdraw application');
  };

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
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`badge text-xs ${APPLICATION_STATUS[app.status]?.color || ''}`}>
                      {APPLICATION_STATUS[app.status]?.label || app.status}
                    </span>
                    {!NON_WITHDRAWABLE.includes(app.status) && (
                      <button
                        onClick={() => handleWithdraw(app)}
                        disabled={withdrawingId === app._id}
                        className="text-xs font-medium text-danger hover:underline disabled:opacity-50 disabled:no-underline"
                      >
                        {withdrawingId === app._id ? 'Withdrawing…' : 'Withdraw'}
                      </button>
                    )}
                  </div>
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
