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
import { ShaderAnimation } from '@/components/ui/shader-lines';

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
    { icon: HiOutlineClipboardCheck, label: 'Applications', value: myApplications.length, color: 'from-indigo-500 to-rose-500' },
    { icon: HiOutlineCalendar, label: 'Interviews', value: myApplications.filter((a) => a.status === 'interview').length, color: 'from-indigo-500 to-rose-500' },
    { icon: HiOutlineBookmark, label: 'Saved Jobs', value: savedJobs.length, color: 'from-indigo-500 to-rose-500' },
    { icon: HiOutlineEye, label: 'Profile Views', value: user?.profileViews || 0, color: 'from-indigo-500 to-rose-500' },
  ];

  const profileCompletion = [user?.name, user?.email, user?.phone, user?.bio, user?.skills?.length, user?.resumeUrl].filter(Boolean).length * 17;

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ===== Welcome header ===== */}
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/[0.1] text-white bg-black">
          {/* Shader-lines banner background */}
          <ShaderAnimation />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030303] via-[#030303]/40 to-[#030303]/70"></div>
          <div className="relative z-10 px-6 sm:px-10 py-16 sm:py-24">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 border border-white/[0.1] px-3 py-1 rounded-full mb-4">
              <HiOutlineSparkles className="w-4 h-4" /> Your Dashboard
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-balance text-white">
              Welcome, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">{user?.name?.split(' ')[0]}</span>!
            </h1>
            <p className="text-white/60 mt-2">Here's your career overview at a glance</p>
          </div>
        </div>

        {/* ===== Stats ===== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="group bg-white/[0.03] border border-white/[0.1] p-5 rounded-2xl hover:bg-white/[0.05] hover:border-white/[0.2] transition-all duration-300">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] group-hover:scale-110 group-hover:-rotate-6 transition-transform`}>
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="text-sm text-white/60">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ===== Recent applications ===== */}
          <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.1] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Recent <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">Applications</span></h2>
              <Link to="/applications" className="text-sm text-indigo-300 font-semibold flex items-center gap-1 hover:gap-2 transition-all">View All <HiOutlineArrowRight className="w-4 h-4" /></Link>
            </div>
            {myApplications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/15 flex items-center justify-center">
                  <HiOutlineBriefcase className="w-8 h-8 text-indigo-300" />
                </div>
                <p className="text-white/60 mb-4">No applications yet — start exploring roles</p>
                <Link to="/jobs" className="inline-flex items-center justify-center bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300 text-sm font-semibold px-5 py-2.5 rounded-xl">Browse Jobs</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {myApplications.slice(0, 5).map((app) => (
                  <div key={app._id} className="flex items-center gap-4 p-3 rounded-xl border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.2] transition-all duration-300">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] shrink-0">{app.jobId?.companyId?.companyName?.[0] || 'J'}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm truncate">{app.jobId?.title || 'Job'}</p>
                      <p className="text-xs text-white/50 truncate">{app.jobId?.companyId?.companyName} • {timeAgo(app.appliedAt)}</p>
                    </div>
                    <span className={`badge text-xs ${APPLICATION_STATUS[app.status]?.color || ''}`}>{APPLICATION_STATUS[app.status]?.label || app.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ===== Sidebar ===== */}
          <div className="space-y-6">
            {/* AI Auto-Apply */}
            <div className="bg-white/[0.03] border border-white/[0.1] rounded-2xl p-6">
              <div className="flex items-center justify-between gap-3 mb-1">
                <h3 className="flex items-center gap-2 font-bold text-white">
                  <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] shrink-0">
                    <HiOutlineSparkles className="w-5 h-5" />
                  </span>
                  AI Auto-Apply
                </h3>
                <button role="switch" aria-checked={autoEnabled} aria-label="Toggle auto-apply" onClick={toggleAuto}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303] ${autoEnabled ? 'bg-gradient-to-r from-indigo-500 to-rose-500' : 'bg-white/[0.12]'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${autoEnabled ? 'translate-x-5' : ''}`} />
                </button>
              </div>
              <p className="text-sm text-white/60 mb-4">Let AI scan open roles and auto-apply to the ones that match your skills.</p>
              <div className="mb-4">
                <div className="flex justify-between text-xs text-white/70 mb-1.5">
                  <span>Minimum match</span><span className="font-semibold text-indigo-300">{minScore}%</span>
                </div>
                <input type="range" min="40" max="95" step="5" value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  onMouseUp={() => saveAuto({ enabled: autoEnabled, minMatchScore: minScore })}
                  onTouchEnd={() => saveAuto({ enabled: autoEnabled, minMatchScore: minScore })}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/[0.1] accent-indigo-400" />
              </div>
              <button onClick={runNow} disabled={running}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:hover:scale-100">
                {running ? 'Scanning jobs…' : (<><HiOutlineSparkles className="w-5 h-5" /> Run auto-apply now</>)}
              </button>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.1] rounded-2xl p-6">
              <h3 className="flex items-center gap-2 font-bold text-white mb-4">
                <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] shrink-0">
                  <HiOutlineUserCircle className="w-5 h-5" />
                </span>
                Profile Completion
              </h3>
              <div className="w-full h-3 rounded-full bg-white/[0.06] mb-3 overflow-hidden">
                <div className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-rose-500 transition-all duration-700" style={{ width: `${Math.min(profileCompletion, 100)}%` }}></div>
              </div>
              <p className="text-sm text-white/60 mb-3"><span className="font-semibold text-white">{Math.min(profileCompletion, 100)}%</span> complete</p>
              <Link to="/profile" className="text-sm text-indigo-300 font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all">Complete profile <HiOutlineArrowRight className="w-4 h-4" /></Link>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.1] rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[{ to: '/jobs', icon: HiOutlineBriefcase, label: 'Find Jobs' }, { to: '/resume-builder', icon: HiOutlineDocumentText, label: 'Resume Builder' }, { to: '/saved-jobs', icon: HiOutlineBookmark, label: 'Saved Jobs' }].map((a) => (
                  <Link key={a.to} to={a.to} className="group flex items-center gap-3 p-3 rounded-xl border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.2] transition-all duration-300 text-sm font-semibold text-white/80">
                    <span className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-300 group-hover:scale-110 transition-transform shrink-0">
                      <a.icon className="w-5 h-5" />
                    </span>
                    {a.label}
                    <HiOutlineArrowRight className="w-4 h-4 ml-auto text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
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
