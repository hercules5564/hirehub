import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { HiOutlineHome, HiOutlineBriefcase, HiOutlineUsers, HiOutlineOfficeBuilding, HiOutlineChartBar, HiOutlineCog, HiOutlineDocumentText, HiOutlineBookmark, HiOutlineBell, HiOutlineClipboardList, HiOutlineUserGroup, HiOutlineShieldCheck } from 'react-icons/hi';

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

  return (
    <aside className="hidden lg:block w-64 min-h-[calc(100vh-4rem)] bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 pt-6 pb-8 px-3">
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = location.pathname === link.to;
          return (
            <Link key={link.to} to={link.to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${active
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 shadow-sm'
                  : 'text-dark-600 dark:text-dark-400 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-dark-900 dark:hover:text-dark-100'}`}>
              <Icon className={`w-5 h-5 ${active ? 'text-primary-500' : ''}`} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
