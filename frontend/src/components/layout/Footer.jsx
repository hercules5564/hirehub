import { Link } from 'react-router-dom';
import { HiOutlineBriefcase, HiOutlineMail, HiOutlineArrowRight } from 'react-icons/hi';
import { FaTwitter, FaLinkedinIn, FaGithub, FaInstagram } from 'react-icons/fa';

const socials = [
  { Icon: FaTwitter, label: 'Twitter' },
  { Icon: FaLinkedinIn, label: 'LinkedIn' },
  { Icon: FaGithub, label: 'GitHub' },
  { Icon: FaInstagram, label: 'Instagram' },
];

const linkItem = 'text-sm text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors';

const Footer = () => {
  return (
    <footer className="bg-ink-50 dark:bg-[#0d1117] text-ink-600 dark:text-ink-400 mt-auto border-t border-ink-200 dark:border-[#262c36]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Newsletter */}
        <div className="mb-12 rounded-xl border border-ink-200 dark:border-[#262c36] bg-white dark:bg-[#161b22] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-ink-900 dark:text-white">Stay ahead of the curve</h3>
            <p className="text-sm text-ink-500 dark:text-ink-400 mt-1.5 max-w-md">Get curated jobs and hiring insights delivered to your inbox. No spam, ever.</p>
          </div>
          <form className="flex w-full max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
            <div className="flex-1 flex items-center gap-2 bg-white dark:bg-[#0d1117] rounded-lg px-3.5 border border-ink-300 dark:border-[#262c36] focus-within:border-primary-500 transition-colors">
              <HiOutlineMail className="w-5 h-5 text-ink-400 flex-shrink-0" />
              <input type="email" placeholder="you@example.com"
                className="w-full py-2.5 bg-transparent text-ink-900 dark:text-white placeholder-ink-400 outline-none text-sm" />
            </div>
            <button type="submit" className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-colors">
              Subscribe <HiOutlineArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary-600 flex items-center justify-center">
                <HiOutlineBriefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold font-display text-ink-900 dark:text-white">HireHub</span>
            </Link>
            <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed mb-5">
              Connecting talented professionals with leading companies. Your next role starts here.
            </p>
            <div className="flex gap-2">
              {socials.map(({ Icon, label }) => (
                <a key={label} href="#" aria-label={label}
                  className="w-9 h-9 rounded-md border border-ink-200 dark:border-[#262c36] flex items-center justify-center text-ink-500 dark:text-ink-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* For Candidates */}
          <div>
            <h3 className="text-ink-900 dark:text-white font-semibold text-sm mb-3.5">For Candidates</h3>
            <ul className="space-y-2.5">
              {[{ to: '/jobs', label: 'Browse Jobs' }, { to: '/signup', label: 'Create Account' }, { to: '/resume-builder', label: 'Resume Builder' }, { to: '/saved-jobs', label: 'Saved Jobs' }].map((link) => (
                <li key={link.label}><Link to={link.to} className={linkItem}>{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* For Recruiters */}
          <div>
            <h3 className="text-ink-900 dark:text-white font-semibold text-sm mb-3.5">For Recruiters</h3>
            <ul className="space-y-2.5">
              {[{ to: '/signup', label: 'Post a Job' }, { to: '/signup', label: 'Recruiter Sign Up' }, { to: '/pricing', label: 'Pricing' }, { to: '/enterprise', label: 'Enterprise' }].map((link, i) => (
                <li key={i}><Link to={link.to} className={linkItem}>{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-ink-900 dark:text-white font-semibold text-sm mb-3.5">Company</h3>
            <ul className="space-y-2.5">
              {[{ to: '/about', label: 'About Us' }, { to: '/contact', label: 'Contact' }, { to: '/privacy', label: 'Privacy Policy' }, { to: '/terms', label: 'Terms of Service' }].map((link, i) => (
                <li key={i}><Link to={link.to} className={linkItem}>{link.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-ink-200 dark:border-[#262c36] flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-sm text-ink-500 dark:text-ink-400">© {new Date().getFullYear()} HireHub. All rights reserved.</p>
          <p className="text-sm text-ink-500 dark:text-ink-400">Built for the future of hiring.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
