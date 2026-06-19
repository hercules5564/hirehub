import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchMyApplications, withdrawApplication } from '../redux/slices/applicationSlice';
import { formatSalary, timeAgo } from '../utils/helpers';
import { APPLICATION_STATUS } from '../utils/constants';
import {
  HiOutlineBriefcase, HiOutlineSparkles, HiOutlineLocationMarker,
  HiOutlineCash, HiOutlineClock, HiOutlineSearch, HiOutlineArrowRight,
} from 'react-icons/hi';

// Statuses where the application is final and can no longer be withdrawn.
const NON_WITHDRAWABLE = ['withdrawn', 'rejected', 'offered'];

// Dark-theme status badge styles (semantic colors on #030303).
const STATUS_BADGE = {
  applied: 'bg-indigo-500/15 text-indigo-300',
  reviewing: 'bg-amber-500/15 text-amber-300',
  shortlisted: 'bg-emerald-500/15 text-emerald-300',
  interview: 'bg-violet-500/15 text-violet-300',
  offered: 'bg-emerald-500/15 text-emerald-300',
  rejected: 'bg-rose-500/15 text-rose-300',
  withdrawn: 'bg-white/[0.06] text-white/70',
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
    <div className="min-h-screen bg-[#030303] text-white pt-24 relative overflow-hidden">
      {/* Decorative aurora blobs */}
      <div className="absolute top-10 -left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-40 -right-24 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full mb-4">
            <HiOutlineSparkles className="w-4 h-4" /> Your Journey
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white text-balance">
            My <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">Applications</span>
          </h1>
          <p className="mt-2 text-white/60">Track every role you've applied to, all in one place.</p>
        </div>

        {loading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-white/[0.06] animate-pulse rounded-2xl"></div>)}</div>
        ) : myApplications.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-[0_8px_24px_0_rgba(99,102,241,0.35)]">
              <HiOutlineBriefcase className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No applications yet</h3>
            <p className="text-white/60 max-w-sm mx-auto mb-6">Start exploring opportunities and your applications will show up right here.</p>
            <Link to="/jobs" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]">
              <HiOutlineSearch className="w-5 h-5" /> Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myApplications.map((app) => (
              <div key={app._id} className="group bg-white/[0.03] rounded-2xl p-5 sm:p-6 border border-white/[0.1] hover:bg-white/[0.05] hover:border-white/[0.2] transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] group-hover:scale-110 transition-transform">
                    {app.jobId?.companyId?.companyName?.[0] || 'J'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/jobs/${app.jobId?._id}`} className="font-semibold text-white hover:text-indigo-300 transition-colors inline-flex items-center gap-1.5">
                      {app.jobId?.title || 'Position'}
                      <HiOutlineArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                    <p className="text-sm text-white/60 mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span className="font-medium text-white/70">{app.jobId?.companyId?.companyName}</span>
                      <span className="inline-flex items-center gap-1"><HiOutlineLocationMarker className="w-3.5 h-3.5" />{app.jobId?.location}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-3 flex-wrap text-xs">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 font-medium">
                        <HiOutlineCash className="w-3.5 h-3.5" />{formatSalary(app.jobId?.salary)}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.06] text-white/70 font-medium">
                        <HiOutlineClock className="w-3.5 h-3.5" />Applied {timeAgo(app.appliedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_BADGE[app.status] || 'bg-white/[0.06] text-white/70'}`}>
                      {APPLICATION_STATUS[app.status]?.label || app.status}
                    </span>
                    {!NON_WITHDRAWABLE.includes(app.status) && (
                      <button
                        onClick={() => handleWithdraw(app)}
                        disabled={withdrawingId === app._id}
                        className="text-xs font-semibold text-rose-300 px-2.5 py-1 rounded-full hover:bg-rose-500/15 disabled:opacity-50 disabled:hover:bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]"
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
