import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchMyApplications, withdrawApplication } from '../redux/slices/applicationSlice';
import { formatSalary, timeAgo } from '../utils/helpers';
import { APPLICATION_STATUS } from '../utils/constants';
import {
  HiOutlineBriefcase, HiOutlineLocationMarker,
  HiOutlineCash, HiOutlineClock, HiOutlineSearch, HiOutlineArrowRight,
} from 'react-icons/hi';

// Statuses where the application is final and can no longer be withdrawn.
const NON_WITHDRAWABLE = ['withdrawn', 'rejected', 'offered'];

// Neutral / semantic status badge styles (light-first, theme-aware).
const STATUS_BADGE = {
  applied: 'bg-primary-50 text-primary-700 dark:bg-primary-600/10 dark:text-primary-400',
  reviewing: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  shortlisted: 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400',
  interview: 'bg-primary-50 text-primary-700 dark:bg-primary-600/10 dark:text-primary-400',
  offered: 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400',
  rejected: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  withdrawn: 'bg-ink-100 text-ink-600 dark:bg-white/[0.06] dark:text-ink-300',
};

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
    <div className="min-h-screen bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300">
      {/* Header */}
      <div className="border-b border-ink-200 dark:border-[#262c36] bg-ink-50 dark:bg-[#11161f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white text-balance">
            My Applications
          </h1>
          <p className="mt-1.5 text-ink-500 dark:text-ink-400">Track every role you've applied to, all in one place.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-28 skeleton rounded-xl"></div>)}</div>
        ) : myApplications.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-ink-100 dark:bg-white/[0.06] flex items-center justify-center text-ink-400">
              <HiOutlineBriefcase className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-ink-900 dark:text-white mb-1.5">No applications yet</h3>
            <p className="text-ink-500 dark:text-ink-400 max-w-sm mx-auto mb-5">Start exploring opportunities and your applications will show up right here.</p>
            <Link to="/jobs" className="btn-primary">
              <HiOutlineSearch className="w-5 h-5" /> Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myApplications.map((app) => (
              <div key={app._id} className="group bg-white dark:bg-[#161b22] rounded-xl p-5 sm:p-6 border border-ink-200 dark:border-[#262c36] card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg flex-shrink-0">
                    {app.jobId?.companyId?.companyName?.[0] || 'J'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/jobs/${app.jobId?._id}`} className="font-semibold text-ink-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-flex items-center gap-1.5">
                      {app.jobId?.title || 'Position'}
                      <HiOutlineArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                    <p className="text-sm text-ink-500 dark:text-ink-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span className="font-medium text-ink-700 dark:text-ink-300">{app.jobId?.companyId?.companyName}</span>
                      <span className="inline-flex items-center gap-1"><HiOutlineLocationMarker className="w-3.5 h-3.5 text-ink-400" />{app.jobId?.location}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-3 flex-wrap text-xs">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-ink-100 dark:bg-white/[0.06] text-ink-600 dark:text-ink-300 font-medium">
                        <HiOutlineCash className="w-3.5 h-3.5 text-ink-400" />{formatSalary(app.jobId?.salary)}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-ink-100 dark:bg-white/[0.06] text-ink-600 dark:text-ink-300 font-medium">
                        <HiOutlineClock className="w-3.5 h-3.5 text-ink-400" />Applied {timeAgo(app.appliedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${STATUS_BADGE[app.status] || 'bg-ink-100 text-ink-600 dark:bg-white/[0.06] dark:text-ink-300'}`}>
                      {APPLICATION_STATUS[app.status]?.label || app.status}
                    </span>
                    {!NON_WITHDRAWABLE.includes(app.status) && (
                      <button
                        onClick={() => handleWithdraw(app)}
                        disabled={withdrawingId === app._id}
                        className="text-xs font-semibold text-red-600 dark:text-red-400 px-2.5 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
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
