import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineBriefcase, HiOutlineBell, HiOutlineMenu, HiOutlineX, HiOutlineUser, HiOutlineLogout, HiOutlineCog, HiOutlineBookmark, HiOutlineClipboardList, HiOutlineViewGrid, HiOutlineDocumentText, HiOutlinePlusCircle, HiOutlineOfficeBuilding, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import { FaCrown } from 'react-icons/fa';
import { logout } from '../../redux/slices/authSlice';
import { toggleTheme } from '../../redux/slices/themeSlice';
import useAuth from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';

const itemCls = 'flex items-center gap-3 px-4 py-2.5 text-sm text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-white/[0.05] transition-colors';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isCandidate, isRecruiter, isAdmin } = useAuth();
  const { unreadCount } = useSelector((s) => s.notifications);
  const { mode } = useSelector((s) => s.theme);

  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setProfileOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); setProfileOpen(false); }, [location]);

  const handleLogout = () => { dispatch(logout()); navigate('/'); };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isRecruiter) return '/recruiter/dashboard';
    return '/dashboard';
  };

  const navLinks = [
    { to: '/jobs', label: 'Find Jobs', show: !isRecruiter && !isAdmin },
    { to: '/about', label: 'About', show: true },
    { to: '/contact', label: 'Contact', show: true },
  ];

  const isActive = (path) => location.pathname === path;
  const linkClass = (active) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${active
      ? 'text-ink-900 dark:text-white bg-ink-100 dark:bg-white/[0.06]'
      : 'text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white hover:bg-ink-50 dark:hover:bg-white/[0.04]'}`;

  const ThemeToggle = ({ className = '' }) => (
    <button
      onClick={() => dispatch(toggleTheme())}
      aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`p-2 rounded-md text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white hover:bg-ink-50 dark:hover:bg-white/[0.05] transition-colors ${className}`}
    >
      {mode === 'dark' ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
    </button>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-[#0d1117]/90 backdrop-blur-sm border-b border-ink-200 dark:border-[#262c36]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-primary-600 flex items-center justify-center">
              <HiOutlineBriefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold font-display tracking-tight text-ink-900 dark:text-white">HireHub</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.filter((l) => l.show).map((link) => (
              <Link key={link.to} to={link.to} className={linkClass(isActive(link.to))}>
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link to={getDashboardLink()} className={linkClass(isActive(getDashboardLink()))}>
                Dashboard
              </Link>
            )}
            <Link to="/pricing"
              className="ml-1 flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white hover:bg-ink-50 dark:hover:bg-white/[0.04] transition-colors">
              <FaCrown className="w-4 h-4 text-amber-500" /> Premium
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <ThemeToggle className="hidden sm:inline-flex" />
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Link to="/notifications" className="p-2 rounded-md text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white hover:bg-ink-50 dark:hover:bg-white/[0.05] transition-colors relative">
                  <HiOutlineBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-primary-600 text-white text-[10px] rounded-full flex items-center justify-center font-semibold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1 rounded-md hover:bg-ink-50 dark:hover:bg-white/[0.05] transition-colors">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
                        {getInitials(user?.name)}
                      </div>
                    )}
                    <span className="hidden lg:block text-sm font-medium text-ink-700 dark:text-ink-300 max-w-24 truncate">{user?.name}</span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 py-1.5 bg-white dark:bg-[#161b22] rounded-lg shadow-lg border border-ink-200 dark:border-[#262c36] animate-fade-in">
                      <div className="px-4 py-2.5 border-b border-ink-200 dark:border-[#262c36]">
                        <p className="text-sm font-semibold text-ink-900 dark:text-white">{user?.name}</p>
                        <p className="text-xs text-ink-500 dark:text-ink-400 truncate">{user?.email}</p>
                        <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-md bg-primary-50 dark:bg-primary-600/15 text-primary-700 dark:text-primary-300 capitalize font-medium">{user?.role}</span>
                      </div>
                      <Link to="/profile" className={itemCls}><HiOutlineUser className="w-4 h-4" /> Profile</Link>
                      <Link to={getDashboardLink()} className={itemCls}><HiOutlineViewGrid className="w-4 h-4" /> Dashboard</Link>
                      <Link to="/notifications" className={itemCls}>
                        <HiOutlineBell className="w-4 h-4" /> Notifications
                        {unreadCount > 0 && (
                          <span className="ml-auto text-[10px] font-semibold bg-primary-600 text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center">{unreadCount > 9 ? '9+' : unreadCount}</span>
                        )}
                      </Link>

                      {isCandidate && (
                        <>
                          <Link to="/applications" className={itemCls}><HiOutlineClipboardList className="w-4 h-4" /> Applications</Link>
                          <Link to="/saved-jobs" className={itemCls}><HiOutlineBookmark className="w-4 h-4" /> Saved Jobs</Link>
                          <Link to="/resume-builder" className={itemCls}><HiOutlineDocumentText className="w-4 h-4" /> Resume Builder</Link>
                        </>
                      )}
                      {isRecruiter && (
                        <>
                          <Link to="/recruiter/jobs/new" className={itemCls}><HiOutlinePlusCircle className="w-4 h-4" /> Post a Job</Link>
                          <Link to="/recruiter/company" className={itemCls}><HiOutlineOfficeBuilding className="w-4 h-4" /> Manage Company</Link>
                        </>
                      )}

                      <Link to="/settings" className={itemCls}><HiOutlineCog className="w-4 h-4" /> Settings</Link>
                      <div className="border-t border-ink-200 dark:border-[#262c36] mt-1 pt-1">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                          <HiOutlineLogout className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="px-3 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white transition-colors">Login</Link>
                <Link to="/signup" className="px-3.5 py-2 rounded-lg text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-colors">Get Started</Link>
              </div>
            )}

            {/* Mobile Menu */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-md text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white hover:bg-ink-50 dark:hover:bg-white/[0.05]">
              {mobileOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-[#0d1117] border-t border-ink-200 dark:border-[#262c36] animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.filter((l) => l.show).map((link) => (
              <Link key={link.to} to={link.to} className="block px-4 py-2.5 rounded-md text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-white/[0.05]">{link.label}</Link>
            ))}
            {isAuthenticated && (
              <Link to={getDashboardLink()} className="block px-4 py-2.5 rounded-md text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-white/[0.05]">Dashboard</Link>
            )}
            <Link to="/pricing" className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-white/[0.05]">
              <FaCrown className="w-4 h-4 text-amber-500" /> Premium
            </Link>
            <button onClick={() => dispatch(toggleTheme())} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-white/[0.05]">
              {mode === 'dark' ? <HiOutlineSun className="w-4 h-4" /> : <HiOutlineMoon className="w-4 h-4" />}
              {mode === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>

            {!isAuthenticated && (
              <div className="pt-3 space-y-2 border-t border-ink-200 dark:border-[#262c36]">
                <Link to="/login" className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium text-ink-800 dark:text-ink-200 border border-ink-300 dark:border-[#262c36] hover:bg-ink-50 dark:hover:bg-white/[0.04]">Login</Link>
                <Link to="/signup" className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-colors">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
