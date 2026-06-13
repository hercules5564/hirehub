import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineBriefcase, HiOutlineBell, HiOutlineMoon, HiOutlineSun, HiOutlineMenu, HiOutlineX, HiOutlineUser, HiOutlineLogout, HiOutlineCog, HiOutlineBookmark, HiOutlineClipboardList } from 'react-icons/hi';
import { toggleTheme } from '../../redux/slices/themeSlice';
import { logout } from '../../redux/slices/authSlice';
import useAuth from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isCandidate, isRecruiter, isAdmin } = useAuth();
  const { mode } = useSelector((s) => s.theme);
  const { unreadCount } = useSelector((s) => s.notifications);

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
    { to: '/jobs', label: 'Find Jobs', show: true },
    { to: '/about', label: 'About', show: true },
    { to: '/contact', label: 'Contact', show: true },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <HiOutlineBriefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">HireHub</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.filter((l) => l.show).map((link) => (
              <Link key={link.to} to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive(link.to) ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-dark-600 hover:text-primary-600 hover:bg-gray-100 dark:text-dark-300 dark:hover:bg-dark-700'}`}>
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link to={getDashboardLink()}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive(getDashboardLink()) ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-dark-600 hover:text-primary-600 hover:bg-gray-100 dark:text-dark-300 dark:hover:bg-dark-700'}`}>
                Dashboard
              </Link>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-lg text-dark-500 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              aria-label="Toggle theme">
              {mode === 'dark' ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Link to="/notifications" className="p-2 rounded-lg text-dark-500 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors relative">
                  <HiOutlineBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                        {getInitials(user?.name)}
                      </div>
                    )}
                    <span className="hidden lg:block text-sm font-medium text-dark-700 dark:text-dark-200 max-w-24 truncate">{user?.name}</span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 py-2 glass-strong rounded-xl shadow-xl border border-gray-200/50 dark:border-dark-600/50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-dark-700">
                        <p className="text-sm font-semibold text-dark-800 dark:text-dark-100">{user?.name}</p>
                        <p className="text-xs text-dark-500 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 capitalize">{user?.role}</span>
                      </div>
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-600 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                        <HiOutlineUser className="w-4 h-4" /> Profile
                      </Link>
                      <Link to={getDashboardLink()} className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-600 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                        <HiOutlineClipboardList className="w-4 h-4" /> Dashboard
                      </Link>
                      {isCandidate && (
                        <>
                          <Link to="/applications" className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-600 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                            <HiOutlineBriefcase className="w-4 h-4" /> Applications
                          </Link>
                          <Link to="/saved-jobs" className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-600 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                            <HiOutlineBookmark className="w-4 h-4" /> Saved Jobs
                          </Link>
                        </>
                      )}
                      <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-600 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                        <HiOutlineCog className="w-4 h-4" /> Settings
                      </Link>
                      <div className="border-t border-gray-100 dark:border-dark-700 mt-1 pt-1">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <HiOutlineLogout className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-dark-600 hover:text-primary-600 dark:text-dark-300 transition-colors">Login</Link>
                <Link to="/signup" className="btn-primary text-sm">Get Started</Link>
              </div>
            )}

            {/* Mobile Menu */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-dark-500 hover:bg-gray-100 dark:hover:bg-dark-700">
              {mobileOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass-strong border-t border-gray-200/50 dark:border-dark-700/50 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.filter((l) => l.show).map((link) => (
              <Link key={link.to} to={link.to} className="block px-4 py-2.5 rounded-lg text-sm font-medium text-dark-600 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700">{link.label}</Link>
            ))}
            {isAuthenticated && (
              <Link to={getDashboardLink()} className="block px-4 py-2.5 rounded-lg text-sm font-medium text-dark-600 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700">Dashboard</Link>
            )}
            {!isAuthenticated && (
              <div className="pt-3 space-y-2 border-t border-gray-200 dark:border-dark-700">
                <Link to="/login" className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium btn-outline">Login</Link>
                <Link to="/signup" className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium btn-primary">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
