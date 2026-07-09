import { Link } from 'react-router-dom';
import { HiOutlineHome, HiOutlineSearch, HiOutlineExclamationCircle } from 'react-icons/hi';

const NotFound = () => (
  <div className="min-h-screen bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300 flex items-center justify-center px-4">
    <div className="text-center max-w-lg mx-auto">
      {/* Eyebrow pill */}
      <span className="inline-flex items-center gap-1.5 text-xs font-medium border border-ink-200 dark:border-[#262c36] bg-white dark:bg-[#161b22] text-ink-600 dark:text-ink-400 px-3 py-1 rounded-full mb-6">
        <HiOutlineExclamationCircle className="w-4 h-4 text-primary-600 dark:text-primary-400" /> Error 404
      </span>

      <h1 className="text-8xl sm:text-9xl font-black mb-4 leading-none text-primary-600 dark:text-primary-400">404</h1>

      <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white mb-3 text-balance">Page Not Found</h2>
      <p className="text-ink-600 dark:text-ink-400 mb-10 max-w-md mx-auto text-balance">The page you're looking for doesn't exist or has been moved.</p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/" className="px-6 py-2.5 rounded-lg font-semibold inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40">
          <HiOutlineHome className="w-5 h-5" /> Go Home
        </Link>
        <Link to="/jobs" className="px-6 py-2.5 rounded-lg font-semibold inline-flex items-center justify-center gap-2 border border-ink-300 dark:border-[#262c36] text-ink-800 dark:text-ink-100 hover:bg-ink-50 dark:hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40">
          <HiOutlineSearch className="w-5 h-5" /> Browse Jobs
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
