import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { HiOutlineHome, HiOutlineBriefcase, HiOutlineUsers, HiOutlineOfficeBuilding, HiOutlineChartBar, HiOutlineCog, HiOutlineDocumentText, HiOutlineBookmark, HiOutlineBell, HiOutlineClipboardList, HiOutlineUserGroup, HiOutlineShieldCheck, HiOutlineSparkles, HiOutlineArrowRight } from 'react-icons/hi';

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
    <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-16 self-start h-[calc(100vh-4rem)] overflow-y-auto bg-[#0a0a0a] border-r border-white/[0.08] pt-6 pb-8 px-3">
      {/* Workspace eyebrow */}
      <div className="px-3 mb-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full">
          <HiOutlineSparkles className="w-3.5 h-3.5" />
          {workspaceLabel} Hub
        </span>
      </div>

      <nav className="space-y-1.5">
        {links.map((link) => {
          const Icon = link.icon;
          const active = location.pathname === link.to;
          return (
            <Link key={link.to} to={link.to}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]
                ${active
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/70 hover:bg-white/[0.06] hover:text-white'}`}>
              {/* Active accent bar */}
              <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-rose-500 transition-all duration-300 ${active ? 'h-6 opacity-100' : 'h-0 opacity-0'}`}></span>
              {/* Icon chip */}
              <span className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 group-hover:scale-110
                ${active
                  ? 'bg-gradient-to-br from-indigo-500 to-rose-500 text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)]'
                  : 'bg-white/[0.06] text-white/70 group-hover:text-indigo-300'}`}>
                <Icon className="w-5 h-5" />
              </span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade / promo card */}
      <div className="mt-auto pt-6">
        <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.1] text-white p-4">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-rose-500/20 rounded-full blur-3xl"></div>
          <div className="relative">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 mb-3">
              <HiOutlineSparkles className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold leading-snug">
              Unlock <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">premium</span> insights
            </p>
            <p className="text-xs text-white/60 mt-1 leading-relaxed">
              Boost your reach with smarter analytics and matching.
            </p>
            <Link to="/settings" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303] rounded">
              Explore
              <HiOutlineArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
