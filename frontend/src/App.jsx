import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MotionConfig } from 'motion/react';
import { loadUser } from './redux/slices/authSlice';
import { setTheme } from './redux/slices/themeSlice';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleRoute from './components/auth/RoleRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import PostJob from './pages/PostJob';
import JobApplicants from './pages/JobApplicants';
import ManageCompany from './pages/ManageCompany';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import CompanyProfile from './pages/CompanyProfile';
import Applications from './pages/Applications';
import SavedJobs from './pages/SavedJobs';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import About from './pages/About';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Enterprise from './pages/Enterprise';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import ResumeBuilder from './pages/ResumeBuilder';
import NotFound from './pages/NotFound';

const hideNavFooter = ['/login', '/signup', '/forgot-password'];

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated } = useSelector((s) => s.auth);

  // Theme toggle was removed — the app is dark-only now. Force dark on load.
  useEffect(() => {
    dispatch(setTheme('dark'));
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) dispatch(loadUser());
  }, [dispatch, isAuthenticated]);

  // Scroll to top on route change
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  const showLayout = !hideNavFooter.includes(location.pathname) && !location.pathname.startsWith('/reset-password');

  return (
    <MotionConfig reducedMotion="user">
    <div className="flex flex-col min-h-screen">
      {showLayout && <Navbar />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/company/:id" element={<CompanyProfile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/enterprise" element={<Enterprise />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Candidate Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><CandidateDashboard /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
          <Route path="/saved-jobs" element={<ProtectedRoute><SavedJobs /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/resume-builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />

          {/* Recruiter Routes */}
          <Route path="/recruiter/dashboard" element={<RoleRoute roles={['recruiter']}><RecruiterDashboard /></RoleRoute>} />
          <Route path="/recruiter/company" element={<RoleRoute roles={['recruiter']}><ManageCompany /></RoleRoute>} />
          <Route path="/recruiter/jobs/new" element={<RoleRoute roles={['recruiter']}><PostJob /></RoleRoute>} />
          <Route path="/recruiter/jobs/:id/edit" element={<RoleRoute roles={['recruiter']}><PostJob /></RoleRoute>} />
          <Route path="/recruiter/jobs/:id/applicants" element={<RoleRoute roles={['recruiter']}><JobApplicants /></RoleRoute>} />
          <Route path="/recruiter/*" element={<RoleRoute roles={['recruiter']}><RecruiterDashboard /></RoleRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<RoleRoute roles={['admin']}><AdminDashboard /></RoleRoute>} />
          <Route path="/admin/*" element={<RoleRoute roles={['admin']}><AdminDashboard /></RoleRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {showLayout && <Footer />}
    </div>
    </MotionConfig>
  );
}

export default App;
