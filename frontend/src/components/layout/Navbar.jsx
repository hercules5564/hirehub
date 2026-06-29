import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineBriefcase, HiOutlineBell, HiOutlineMenu, HiOutlineX, HiOutlineUser, HiOutlineLogout, HiOutlineCog, HiOutlineBookmark, HiOutlineClipboardList, HiOutlineViewGrid, HiOutlineDocumentText, HiOutlinePlusCircle, HiOutlineOfficeBuilding, HiOutlineSparkles, HiOutlineArrowRight } from 'react-icons/hi';
import { FaCrown } from 'react-icons/fa';
import { logout } from '../../redux/slices/authSlice';
import useAuth from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';

// Shared accent — mirrors the hero's gradient clip-text / icon tiles.
const accentText = 'bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300';
const gradientBtn = 'bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-[0_4px_16px_0_rgba(99,102,241,0.35)] hover:shadow-[0_4px_20px_0_rgba(244,63,94,0.4)] hover:scale-105 transition-all duration-300';
const itemCls = 'flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isCandidate, isRecruiter, isAdmin } = useAuth();
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
    { to: '/jobs', label: 'Find Jobs', show: !isRecruiter && !isAdmin },
    { to: '/about', label: 'About', show: true },
    { to: '/contact', label: 'Contact', show: true },
  ];

  const isActive = (path) => location.pathname === path;
  const linkClass = (active) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${active ? 'bg-white/[0.08] text-white' : 'text-white/70 hover:text-white hover:bg-white/[0.06]'}`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030303]/70 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-[0_4px_16px_0_rgba(99,102,241,0.35)] ring-1 ring-white/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <HiOutlineBriefcase className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold font-display tracking-tight ${accentText}`}>HireHub</span>
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

            {/* Premium — gold accent to stand apart from the indigo/rose theme.
                Hover reveals what's included (CSS-only; pt-2 bridges the gap). */}
            <div className="relative group">
              <Link to="/pricing"
                className="ml-1 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-amber-200 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-400/30 hover:border-amber-300/60 hover:from-amber-500/30 transition-all duration-200">
                <FaCrown className="w-4 h-4 text-amber-300" /> Premium
              </Link>
              <div className="invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 absolute left-0 top-full pt-2 w-72 z-50">
                <div className="rounded-xl bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl p-3">
                  <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wider text-amber-300/90">Premium features</p>
                  <Link to="/pricing" className="flex items-start gap-2.5 px-2 py-2 rounded-lg hover:bg-white/[0.05] transition-colors">
                    <HiOutlineSparkles className="w-4 h-4 text-indigo-300 mt-0.5 flex-shrink-0" />
                    <span>
                      <span className="block text-sm font-medium text-white">AI Job Matching</span>
                      <span className="block text-xs text-white/50">Auto-match & apply to roles that fit your resume.</span>
                    </span>
                  </Link>
                  <Link to="/resume-builder" className="flex items-start gap-2.5 px-2 py-2 rounded-lg hover:bg-white/[0.05] transition-colors">
                    <HiOutlineDocumentText className="w-4 h-4 text-rose-300 mt-0.5 flex-shrink-0" />
                    <span>
                      <span className="block text-sm font-medium text-white">Resume Builder</span>
                      <span className="block text-xs text-white/50">Craft a standout resume with live templates.</span>
                    </span>
                  </Link>
                  <Link to="/pricing" className="mt-2 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:scale-[1.02] transition-transform">
                    View plans <HiOutlineArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Link to="/notifications" className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors relative">
                  <HiOutlineBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/[0.06] transition-colors">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white text-sm font-bold">
                        {getInitials(user?.name)}
                      </div>
                    )}
                    <span className="hidden lg:block text-sm font-medium text-white/80 max-w-24 truncate">{user?.name}</span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 py-2 bg-[#0a0a0a]/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/[0.08] animate-fade-in">
                      <div className="px-4 py-2 border-b border-white/[0.08]">
                        <p className="text-sm font-semibold text-white">{user?.name}</p>
                        <p className="text-xs text-white/50 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 capitalize">{user?.role}</span>
                      </div>
                      <Link to="/profile" className={itemCls}><HiOutlineUser className="w-4 h-4" /> Profile</Link>
                      <Link to={getDashboardLink()} className={itemCls}><HiOutlineViewGrid className="w-4 h-4" /> Dashboard</Link>
                      <Link to="/notifications" className={itemCls}>
                        <HiOutlineBell className="w-4 h-4" /> Notifications
                        {unreadCount > 0 && (
                          <span className="ml-auto text-[10px] font-bold bg-rose-500 text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center">{unreadCount > 9 ? '9+' : unreadCount}</span>
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
                      <div className="border-t border-white/[0.08] mt-1 pt-1">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors">
                          <HiOutlineLogout className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors">Login</Link>
                <Link to="/signup" className={`px-4 py-2 rounded-lg text-sm font-semibold ${gradientBtn}`}>Get Started</Link>
              </div>
            )}

            {/* Mobile Menu */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06]">
              {mobileOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/[0.08] animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.filter((l) => l.show).map((link) => (
              <Link key={link.to} to={link.to} className="block px-4 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.06]">{link.label}</Link>
            ))}
            {isAuthenticated && (
              <Link to={getDashboardLink()} className="block px-4 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.06]">Dashboard</Link>
            )}

            {/* Premium */}
            <Link to="/pricing" className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-amber-200 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-400/30">
              <FaCrown className="w-4 h-4 text-amber-300" /> Premium
              <span className="ml-auto text-[10px] font-normal text-white/50">AI Matching · Resume Builder</span>
            </Link>

            {!isAuthenticated && (
              <div className="pt-3 space-y-2 border-t border-white/[0.08]">
                <Link to="/login" className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium text-white/80 border border-white/[0.12] hover:bg-white/[0.06]">Login</Link>
                <Link to="/signup" className={`block w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold ${gradientBtn}`}>Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
