import { Link } from 'react-router-dom';
import { HiOutlineHome } from 'react-icons/hi';

const NotFound = () => (
  <div className="min-h-screen bg-dark-50 dark:bg-dark-900 flex items-center justify-center px-4">
    <div className="text-center animate-fade-in">
      <h1 className="text-8xl font-black gradient-text mb-4">404</h1>
      <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">Page Not Found</h2>
      <p className="text-dark-500 mb-8 max-w-md mx-auto">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary inline-flex items-center gap-2"><HiOutlineHome className="w-5 h-5" /> Go Home</Link>
    </div>
  </div>
);

export default NotFound;
