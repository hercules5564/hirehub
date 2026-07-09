import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchMyApplications, fetchSavedJobs } from '../redux/slices/applicationSlice';
import { runAutoApplyAPI, updateAutoApplyAPI } from '../services/api';
import useAuth from '../hooks/useAuth';
import { timeAgo } from '../utils/helpers';
import { APPLICATION_STATUS } from '../utils/constants';
import { HiOutlineBriefcase, HiOutlineClipboardCheck, HiOutlineEye, HiOutlineCalendar, HiOutlineArrowRight, HiOutlineBookmark, HiOutlineDocumentText, HiOutlineSparkles, HiOutlineUserCircle } from 'react-icons/hi';

const CandidateDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { myApplications, savedJobs } = useSelector((s) => s.applications);

  useEffect(() => { dispatch(fetchMyApplications()); dispatch(fetchSavedJobs()); }, [dispatch]);

  const [autoEnabled, setAutoEnabled] = useState(false);
  const [minScore, setMinScore] = useState(60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (user?.autoApply) {
      setAutoEnabled(!!user.autoApply.enabled);
      if (user.autoApply.minMatchScore != null) setMinScore(user.autoApply.minMatchScore);
    }
  }, [user?._id]);

  const saveAuto = (next) => { updateAutoApplyAPI(next).catch(() => {}); };
  const toggleAuto = () => { const v = !autoEnabled; setAutoEnabled(v); saveAuto({ enabled: v, minMatchScore: minScore }); };
  const runNow = async () => {
    setRunning(true);
    try {
      const res = await runAutoApplyAPI({ minMatchScore: minScore });
      const n = res.data.appliedCount;
      if (n > 0) toast.success(`Auto-applied to ${n} matching ${n === 1 ? 'job' : 'jobs'}!`);
      else toast(`No open jobs scored ≥ ${minScore}%. Try lowering the threshold.`, { icon: 'ℹ️' });
      dispatch(fetchMyApplications());
    } catch (e) {
      toast.error('Auto-apply failed. Try again.');
    } finally { setRunning(false); }
  };

  const stats = [
    { icon: HiOutlineClipboardCheck, label: 'Applications', value: myApplications.length },
    { icon: HiOutlineCalendar, label: 'Interviews', value: myApplications.filter((a) => a.status === 'interview').length },
    { icon: HiOutlineBookmark, label: 'Saved Jobs', value: savedJobs.length },
    { icon: HiOutlineEye, label: 'Profile Views', value: user?.profileViews || 0 },
  ];

  const profileCompletion = [user?.name, user?.email, user?.phone, user?.bio, user?.skills?.length, user?.resumeUrl].filter(Boolean).length * 17;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300">
      {/* ===== Welcome header ===== */}
      <div className="border-b border-ink-200 dark:border-[#262c36] bg-ink-50 dark:bg-[#11161f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white text-balance">
            Welcome, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-ink-500 dark:text-ink-400 mt-1.5">Here's your career overview at a glance</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ===== Stats ===== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="flex items-center gap-3.5 p-5 rounded-xl bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] shadow-soft">
              <span className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center flex-shrink-0">
                <s.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </span>
              <div>
                <p className="text-2xl font-bold text-ink-900 dark:text-white leading-none">{s.value}</p>
                <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ===== Recent applications ===== */}
          <div className="lg:col-span-2 bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-ink-900 dark:text-white">Recent Applications</h2>
              <Link to="/applications" className="text-sm text-primary-600 dark:text-primary-400 font-semibold inline-flex items-center gap-1 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">View All <HiOutlineArrowRight className="w-4 h-4" /></Link>
            </div>
            {myApplications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-ink-100 dark:bg-white/[0.06] flex items-center justify-center text-ink-400">
                  <HiOutlineBriefcase className="w-8 h-8" />
                </div>
                <p className="text-ink-500 dark:text-ink-400 mb-4">No applications yet — start exploring roles</p>
                <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {myApplications.slice(0, 5).map((app) => (
                  <div key={app._id} className="flex items-center gap-4 p-3 rounded-lg border border-ink-200 dark:border-[#262c36] hover:bg-ink-50 dark:hover:bg-white/[0.04] transition-colors">
                    <div className="w-11 h-11 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm shrink-0">{app.jobId?.companyId?.companyName?.[0] || 'J'}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-ink-900 dark:text-white text-sm truncate">{app.jobId?.title || 'Job'}</p>
                      <p className="text-xs text-ink-500 dark:text-ink-400 truncate">{app.jobId?.companyId?.companyName} • {timeAgo(app.appliedAt)}</p>
                    </div>
                    <span className={`badge text-xs ${APPLICATION_STATUS[app.status]?.color || ''}`}>{APPLICATION_STATUS[app.status]?.label || app.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ===== Sidebar ===== */}
          <div className="space-y-6">
            {/* Auto-Apply */}
            <div className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-6 shadow-soft">
              <div className="flex items-center justify-between gap-3 mb-1">
                <h3 className="flex items-center gap-2 font-bold text-ink-900 dark:text-white">
                  <span className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                    <HiOutlineSparkles className="w-5 h-5" />
                  </span>
                  Auto-Apply
                </h3>
                <button role="switch" aria-checked={autoEnabled} aria-label="Toggle auto-apply" onClick={toggleAuto}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 ${autoEnabled ? 'bg-primary-600' : 'bg-ink-200 dark:bg-white/[0.12]'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${autoEnabled ? 'translate-x-5' : ''}`} />
                </button>
              </div>
              <p className="text-sm text-ink-500 dark:text-ink-400 mb-4">Automatically scan open roles and apply to the ones that match your skills.</p>
              <div className="mb-4">
                <div className="flex justify-between text-xs text-ink-600 dark:text-ink-300 mb-1.5">
                  <span>Minimum match</span><span className="font-semibold text-primary-600 dark:text-primary-400">{minScore}%</span>
                </div>
                <input type="range" min="40" max="95" step="5" value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  onMouseUp={() => saveAuto({ enabled: autoEnabled, minMatchScore: minScore })}
                  onTouchEnd={() => saveAuto({ enabled: autoEnabled, minMatchScore: minScore })}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-ink-200 dark:bg-white/[0.1] accent-primary-600" />
              </div>
              <button onClick={runNow} disabled={running}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-colors disabled:opacity-60">
                {running ? 'Scanning jobs…' : (<><HiOutlineSparkles className="w-5 h-5" /> Run auto-apply now</>)}
              </button>
            </div>

            <div className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-6 shadow-soft">
              <h3 className="flex items-center gap-2 font-bold text-ink-900 dark:text-white mb-4">
                <span className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                  <HiOutlineUserCircle className="w-5 h-5" />
                </span>
                Profile Completion
              </h3>
              <div className="w-full h-2.5 rounded-full bg-ink-100 dark:bg-white/[0.06] mb-3 overflow-hidden">
                <div className="h-2.5 rounded-full bg-primary-600 transition-all duration-500" style={{ width: `${Math.min(profileCompletion, 100)}%` }}></div>
              </div>
              <p className="text-sm text-ink-500 dark:text-ink-400 mb-3"><span className="font-semibold text-ink-900 dark:text-white">{Math.min(profileCompletion, 100)}%</span> complete</p>
              <Link to="/profile" className="text-sm text-primary-600 dark:text-primary-400 font-semibold inline-flex items-center gap-1 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">Complete profile <HiOutlineArrowRight className="w-4 h-4" /></Link>
            </div>

            <div className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-6 shadow-soft">
              <h3 className="font-bold text-ink-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[{ to: '/jobs', icon: HiOutlineBriefcase, label: 'Find Jobs' }, { to: '/resume-builder', icon: HiOutlineDocumentText, label: 'Resume Builder' }, { to: '/saved-jobs', icon: HiOutlineBookmark, label: 'Saved Jobs' }].map((a) => (
                  <Link key={a.to} to={a.to} className="group flex items-center gap-3 p-3 rounded-lg border border-ink-200 dark:border-[#262c36] hover:bg-ink-50 dark:hover:bg-white/[0.04] transition-colors text-sm font-semibold text-ink-700 dark:text-ink-200">
                    <span className="w-9 h-9 rounded-lg bg-ink-100 dark:bg-white/[0.06] flex items-center justify-center text-ink-500 dark:text-ink-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-600/10 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors shrink-0">
                      <a.icon className="w-5 h-5" />
                    </span>
                    {a.label}
                    <HiOutlineArrowRight className="w-4 h-4 ml-auto text-ink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
