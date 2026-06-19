import { Link } from 'react-router-dom';
import { HiOutlineHome, HiOutlineSearch, HiOutlineExclamationCircle } from 'react-icons/hi';

const NotFound = () => (
  <div className="relative min-h-screen overflow-hidden bg-[#030303] text-white flex items-center justify-center px-4">
    {/* Gradient blobs */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-16 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl"></div>
    </div>

    <div className="relative z-10 text-center max-w-lg mx-auto">
      {/* Eyebrow pill */}
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 border border-white/[0.1] px-3 py-1 rounded-full mb-6">
        <HiOutlineExclamationCircle className="w-4 h-4" /> Error 404
      </span>

      {/* Big gradient 404 */}
      <h1 className="text-8xl sm:text-9xl font-black mb-4 leading-none bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">404</h1>

      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 text-balance">Page Not Found</h2>
      <p className="text-white/60 mb-10 max-w-md mx-auto text-balance">The page you're looking for doesn't exist or has been moved.</p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/" className="px-8 py-3.5 rounded-xl font-semibold inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]">
          <HiOutlineHome className="w-5 h-5" /> Go Home
        </Link>
        <Link to="/jobs" className="px-8 py-3.5 rounded-xl font-semibold inline-flex items-center justify-center gap-2 border border-white/[0.12] text-white/80 hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]">
          <HiOutlineSearch className="w-5 h-5" /> Browse Jobs
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
