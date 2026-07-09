import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { HiOutlineHome, HiOutlineBriefcase, HiOutlineUsers, HiOutlineOfficeBuilding, HiOutlineChartBar, HiOutlineCog, HiOutlineDocumentText, HiOutlineBookmark, HiOutlineBell, HiOutlineClipboardList, HiOutlineUserGroup, HiOutlineShieldCheck, HiOutlineArrowRight } from 'react-icons/hi';

const Sidebar = () => {
  const location = useLocation();
  const { isCandidate, isRecruiter, isAdmin } = useAuth();

  const candidateLinks = [
    { to: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
    { to: '/jobs', icon: HiOutlineBriefcase, label: 'Find Jobs' },
    { to: '/applications', icon: HiOutlineClipboardList, label: 'Applications' },
    { to: '/saved-jobs', icon: HiOutlineBookmark, label: 'Saved Jobs' },
    { to: '/resume-builder', icon: HiOutlineDocumentText, label: 'Resume Builder' },
    { to: '/profile', icon: HiOutlineUsers, label: 'Profile' },
    { to: '/notifications', icon: HiOutlineBell, label: 'Notifications' },
    { to: '/settings', icon: HiOutlineCog, label: 'Settings' },
  ];

  const recruiterLinks = [
    { to: '/recruiter/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
    { to: '/recruiter/jobs', icon: HiOutlineBriefcase, label: 'My Jobs' },
    { to: '/recruiter/company', icon: HiOutlineOfficeBuilding, label: 'Company' },
    { to: '/recruiter/analytics', icon: HiOutlineChartBar, label: 'Analytics' },
    { to: '/notifications', icon: HiOutlineBell, label: 'Notifications' },
    { to: '/profile', icon: HiOutlineUsers, label: 'Profile' },
    { to: '/settings', icon: HiOutlineCog, label: 'Settings' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
    { to: '/admin/users', icon: HiOutlineUserGroup, label: 'Users' },
    { to: '/admin/jobs', icon: HiOutlineBriefcase, label: 'Jobs' },
    { to: '/admin/companies', icon: HiOutlineOfficeBuilding, label: 'Companies' },
    { to: '/admin/verification', icon: HiOutlineShieldCheck, label: 'Verification' },
    { to: '/admin/analytics', icon: HiOutlineChartBar, label: 'Analytics' },
    { to: '/settings', icon: HiOutlineCog, label: 'Settings' },
  ];

  const links = isAdmin ? adminLinks : isRecruiter ? recruiterLinks : candidateLinks;
  const workspaceLabel = isAdmin ? 'Admin' : isRecruiter ? 'Recruiter' : 'Candidate';

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-16 self-start h-[calc(100vh-4rem)] overflow-y-auto bg-white dark:bg-[#0d1117] border-r border-ink-200 dark:border-[#262c36] pt-6 pb-8 px-3">
      {/* Workspace eyebrow */}
      <div className="px-3 mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-500">
          {workspaceLabel} workspace
        </span>
      </div>

      <nav className="space-y-0.5">
        {links.map((link) => {
          const Icon = link.icon;
          const active = location.pathname === link.to;
          return (
            <Link key={link.to} to={link.to}
              className={`group relative flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${active
                  ? 'bg-primary-50 dark:bg-primary-600/10 text-primary-700 dark:text-primary-300'
                  : 'text-ink-600 dark:text-ink-400 hover:bg-ink-50 dark:hover:bg-white/[0.04] hover:text-ink-900 dark:hover:text-white'}`}>
              {/* Active accent bar */}
              <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-full bg-primary-600 transition-all ${active ? 'h-6 opacity-100' : 'h-0 opacity-0'}`}></span>
              <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-primary-600 dark:text-primary-400' : 'text-ink-400 group-hover:text-ink-600 dark:group-hover:text-ink-300'}`} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade / promo card */}
      <div className="mt-auto pt-6">
        <div className="rounded-xl bg-ink-50 dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] p-4">
          <p className="text-sm font-semibold text-ink-900 dark:text-white leading-snug">
            Unlock premium insights
          </p>
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-1 leading-relaxed">
            Boost your reach with smarter analytics and matching.
          </p>
          <Link to="/pricing" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
            View plans
            <HiOutlineArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
