import { useSelector } from 'react-redux';

const useAuth = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const isCandidate = user?.role === 'candidate';
  const isRecruiter = user?.role === 'recruiter';
  const isAdmin = user?.role === 'admin';
  return { user, isAuthenticated, loading, isCandidate, isRecruiter, isAdmin };
};

export default useAuth;
