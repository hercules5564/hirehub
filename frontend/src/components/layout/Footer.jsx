import { Link } from 'react-router-dom';
import { HiOutlineBriefcase } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="bg-dark-900 text-dark-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <HiOutlineBriefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">HireHub</span>
            </Link>
            <p className="text-sm text-dark-400 leading-relaxed mb-6">
              Connecting talented professionals with leading companies. Your dream career starts here.
            </p>
            <div className="flex gap-3">
              {['twitter', 'linkedin', 'github', 'instagram'].map((social) => (
                <a key={social} href="#" className="w-9 h-9 rounded-lg bg-dark-800 flex items-center justify-center text-dark-400 hover:bg-primary-600 hover:text-white transition-all duration-300 hover:scale-110">
                  <span className="text-xs font-bold uppercase">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* For Candidates */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Candidates</h3>
            <ul className="space-y-2.5">
              {[{ to: '/jobs', label: 'Browse Jobs' }, { to: '/signup', label: 'Create Account' }, { to: '/resume-builder', label: 'Resume Builder' }, { to: '/saved-jobs', label: 'Saved Jobs' }].map((link) => (
                <li key={link.to}><Link to={link.to} className="text-sm text-dark-400 hover:text-primary-400 transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* For Recruiters */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Recruiters</h3>
            <ul className="space-y-2.5">
              {[{ to: '/signup', label: 'Post a Job' }, { to: '/signup', label: 'Recruiter Sign Up' }, { to: '/about', label: 'Pricing' }, { to: '/about', label: 'Enterprise' }].map((link, i) => (
                <li key={i}><Link to={link.to} className="text-sm text-dark-400 hover:text-primary-400 transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2.5">
              {[{ to: '/about', label: 'About Us' }, { to: '/contact', label: 'Contact' }, { to: '/about', label: 'Privacy Policy' }, { to: '/about', label: 'Terms of Service' }].map((link, i) => (
                <li key={i}><Link to={link.to} className="text-sm text-dark-400 hover:text-primary-400 transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-dark-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-dark-500">© {new Date().getFullYear()} HireHub. All rights reserved.</p>
          <p className="text-sm text-dark-500">Built with ❤️ for the future of hiring</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
