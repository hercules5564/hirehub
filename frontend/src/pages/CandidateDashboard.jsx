import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyApplications, fetchSavedJobs } from '../redux/slices/applicationSlice';
import useAuth from '../hooks/useAuth';
import { timeAgo } from '../utils/helpers';
import { APPLICATION_STATUS } from '../utils/constants';
import { HiOutlineBriefcase, HiOutlineClipboardCheck, HiOutlineEye, HiOutlineCalendar, HiOutlineArrowRight, HiOutlineBookmark, HiOutlineDocumentText } from 'react-icons/hi';

const CandidateDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { myApplications, savedJobs } = useSelector((s) => s.applications);

  useEffect(() => { dispatch(fetchMyApplications()); dispatch(fetchSavedJobs()); }, [dispatch]);

  const stats = [
    { icon: HiOutlineClipboardCheck, label: 'Applications', value: myApplications.length, color: 'from-blue-500 to-indigo-600' },
    { icon: HiOutlineCalendar, label: 'Interviews', value: myApplications.filter((a) => a.status === 'interview').length, color: 'from-purple-500 to-pink-600' },
    { icon: HiOutlineBookmark, label: 'Saved Jobs', value: savedJobs.length, color: 'from-emerald-500 to-teal-600' },
    { icon: HiOutlineEye, label: 'Profile Views', value: user?.profileViews || 0, color: 'from-orange-500 to-red-500' },
  ];

  const profileCompletion = [user?.name, user?.email, user?.phone, user?.bio, user?.skills?.length, user?.resumeUrl].filter(Boolean).length * 17;

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white">Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-dark-500 mt-1">Here's your career overview</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
          {stats.map((s, i) => (
            <div key={i} className="bg-white dark:bg-dark-800 p-5 rounded-2xl card-hover border border-gray-100 dark:border-dark-700">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-dark-900 dark:text-white">{s.value}</p>
              <p className="text-sm text-dark-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-dark-900 dark:text-white">Recent Applications</h2>
              <Link to="/applications" className="text-sm text-primary-600 font-medium flex items-center gap-1">View All <HiOutlineArrowRight className="w-4 h-4" /></Link>
            </div>
            {myApplications.length === 0 ? (
              <div className="text-center py-10">
                <HiOutlineBriefcase className="w-12 h-12 mx-auto text-dark-300 mb-3" />
                <p className="text-dark-500 mb-3">No applications yet</p>
                <Link to="/jobs" className="btn-primary text-sm">Browse Jobs</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {myApplications.slice(0, 5).map((app) => (
                  <div key={app._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-sm">{app.jobId?.companyId?.companyName?.[0] || 'J'}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-dark-900 dark:text-white text-sm truncate">{app.jobId?.title || 'Job'}</p>
                      <p className="text-xs text-dark-500">{app.jobId?.companyId?.companyName} • {timeAgo(app.appliedAt)}</p>
                    </div>
                    <span className={`badge text-xs ${APPLICATION_STATUS[app.status]?.color || ''}`}>{APPLICATION_STATUS[app.status]?.label || app.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700">
              <h3 className="font-bold text-dark-900 dark:text-white mb-4">Profile Completion</h3>
              <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-dark-700 mb-3">
                <div className="h-3 rounded-full gradient-primary" style={{ width: `${Math.min(profileCompletion, 100)}%` }}></div>
              </div>
              <p className="text-sm text-dark-500 mb-3">{Math.min(profileCompletion, 100)}% complete</p>
              <Link to="/profile" className="text-sm text-primary-600 font-medium">Complete profile →</Link>
            </div>

            <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700">
              <h3 className="font-bold text-dark-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[{ to: '/jobs', icon: HiOutlineBriefcase, label: 'Find Jobs' }, { to: '/resume-builder', icon: HiOutlineDocumentText, label: 'Resume Builder' }, { to: '/saved-jobs', icon: HiOutlineBookmark, label: 'Saved Jobs' }].map((a) => (
                  <Link key={a.to} to={a.to} className="flex items-center gap-3 p-3 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors text-sm font-medium text-dark-700 dark:text-dark-300">
                    <a.icon className="w-5 h-5 text-primary-500" /> {a.label}
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
