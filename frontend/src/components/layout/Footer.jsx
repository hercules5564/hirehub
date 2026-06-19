import { Link } from 'react-router-dom';
import { HiOutlineBriefcase, HiOutlineHeart, HiOutlineMail, HiOutlineArrowRight } from 'react-icons/hi';
import { FaTwitter, FaLinkedinIn, FaGithub, FaInstagram } from 'react-icons/fa';

const socials = [
  { Icon: FaTwitter, label: 'Twitter' },
  { Icon: FaLinkedinIn, label: 'LinkedIn' },
  { Icon: FaGithub, label: 'GitHub' },
  { Icon: FaInstagram, label: 'Instagram' },
];

const gradientBtn = 'bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-[0_4px_16px_0_rgba(99,102,241,0.35)] hover:shadow-[0_4px_20px_0_rgba(244,63,94,0.4)] hover:scale-105 transition-all duration-300';

const linkItem = 'group inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors';
const underline = 'w-0 group-hover:w-3 h-px bg-rose-400 transition-all duration-300';

const Footer = () => {
  return (
    <footer className="relative bg-[#030303] text-white/60 mt-auto overflow-hidden border-t border-white/[0.06]">
      {/* Gradient top accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-rose-400 to-transparent" />
      {/* Soft glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[40rem] h-48 bg-indigo-500/15 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Newsletter */}
        <div className="mb-14 rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Stay ahead of the curve</h3>
            <p className="text-sm text-white/50 mt-2 max-w-md">Get curated jobs and hiring insights delivered to your inbox. No spam, ever.</p>
          </div>
          <form className="flex w-full max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
            <div className="flex-1 flex items-center gap-2 bg-white/[0.04] rounded-xl px-4 border border-white/[0.08] focus-within:border-rose-400/50 transition-colors">
              <HiOutlineMail className="w-5 h-5 text-white/50 flex-shrink-0" />
              <input type="email" placeholder="you@example.com"
                className="w-full py-3 bg-transparent text-white placeholder-white/60 outline-none text-sm" />
            </div>
            <button type="submit" className={`flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold ${gradientBtn}`}>
              Subscribe <HiOutlineArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-[0_4px_16px_0_rgba(99,102,241,0.35)] ring-1 ring-white/20 group-hover:scale-110 transition-transform">
                <HiOutlineBriefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-display text-white">HireHub</span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mb-6">
              Connecting talented professionals with leading companies. Your dream career starts here.
            </p>
            <div className="flex gap-3">
              {socials.map(({ Icon, label }) => (
                <a key={label} href="#" aria-label={label}
                  className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:border-transparent hover:bg-gradient-to-br hover:from-indigo-500 hover:to-rose-500 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* For Candidates */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Candidates</h3>
            <ul className="space-y-2.5">
              {[{ to: '/jobs', label: 'Browse Jobs' }, { to: '/signup', label: 'Create Account' }, { to: '/resume-builder', label: 'Resume Builder' }, { to: '/saved-jobs', label: 'Saved Jobs' }].map((link) => (
                <li key={link.label}><Link to={link.to} className={linkItem}>
                  <span className={underline} />{link.label}
                </Link></li>
              ))}
            </ul>
          </div>

          {/* For Recruiters */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Recruiters</h3>
            <ul className="space-y-2.5">
              {[{ to: '/signup', label: 'Post a Job' }, { to: '/signup', label: 'Recruiter Sign Up' }, { to: '/pricing', label: 'Pricing' }, { to: '/enterprise', label: 'Enterprise' }].map((link, i) => (
                <li key={i}><Link to={link.to} className={linkItem}>
                  <span className={underline} />{link.label}
                </Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2.5">
              {[{ to: '/about', label: 'About Us' }, { to: '/contact', label: 'Contact' }, { to: '/privacy', label: 'Privacy Policy' }, { to: '/terms', label: 'Terms of Service' }].map((link, i) => (
                <li key={i}><Link to={link.to} className={linkItem}>
                  <span className={underline} />{link.label}
                </Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.08] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/50">© {new Date().getFullYear()} HireHub. All rights reserved.</p>
          <p className="text-sm text-white/50 inline-flex items-center gap-1.5">
            Built with <HiOutlineHeart className="w-4 h-4 text-rose-400" /> for the future of hiring
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
