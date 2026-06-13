import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const RoleRoute = ({ children, roles }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!roles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
};

export default RoleRoute;
