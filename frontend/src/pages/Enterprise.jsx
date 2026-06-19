import { Link } from 'react-router-dom';
import {
  HiOutlineOfficeBuilding, HiOutlineShieldCheck, HiOutlineUserGroup, HiOutlineChartSquareBar,
  HiOutlineLockClosed, HiOutlineSupport, HiOutlineSparkles, HiOutlineArrowRight,
} from 'react-icons/hi';

const features = [
  { icon: HiOutlineUserGroup, title: 'Team management', desc: 'Invite recruiters, assign roles, and collaborate on hiring from one shared workspace.' },
  { icon: HiOutlineChartSquareBar, title: 'Advanced analytics', desc: 'Pipeline insights, time-to-hire, and source reporting across every open role.' },
  { icon: HiOutlineShieldCheck, title: 'Verified employer badge', desc: 'Stand out to candidates with a verified, branded company presence.' },
  { icon: HiOutlineLockClosed, title: 'SSO & security', desc: 'SAML single sign-on, audit logs, and enterprise-grade data protection.' },
  { icon: HiOutlineSparkles, title: 'AI candidate matching', desc: 'Surface the best-fit applicants automatically with AI-powered ranking.' },
  { icon: HiOutlineSupport, title: 'Dedicated support', desc: 'A named account manager, onboarding help, and a 99.9% uptime SLA.' },
];

const stats = [
  { value: '60%', label: 'Faster time-to-hire' },
  { value: '2,500+', label: 'Companies hiring' },
  { value: '99.9%', label: 'Uptime SLA' },
];

const Enterprise = () => (
  <div className="min-h-screen bg-[#030303] text-white">
    {/* ===== Hero ===== */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 right-10 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl"></div>
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-28 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 border border-white/[0.1] px-3 py-1 rounded-full mb-6">
          <HiOutlineOfficeBuilding className="w-4 h-4" /> Enterprise
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-6 text-balance text-white">
          Hiring infrastructure for <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">modern teams</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 text-balance">
          Everything your talent team needs to source, screen, and hire — at any scale, securely.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact" className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-rose-500 text-white rounded-xl font-semibold shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
            Talk to Sales <HiOutlineArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/pricing" className="px-8 py-3.5 border border-white/[0.12] text-white/80 rounded-xl font-semibold hover:bg-white/[0.06] transition-colors flex items-center justify-center gap-2">
            View Pricing
          </Link>
        </div>
      </div>
    </section>

    {/* ===== Stats ===== */}
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 -mt-8 relative">
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center p-6 rounded-2xl bg-white/[0.03] border border-white/[0.1] hover:bg-white/[0.05] hover:border-white/[0.2] transition-all duration-300">
            <p className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">{s.value}</p>
            <p className="text-sm text-white/60 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>

    {/* ===== Features ===== */}
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Built for <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">scale</span></h2>
        <p className="text-lg text-white/60 max-w-2xl mx-auto text-balance">Powerful tools and enterprise controls that grow with your organization.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => (
          <div key={f.title} className="group relative overflow-hidden bg-white/[0.03] rounded-2xl p-6 border border-white/[0.1] hover:bg-white/[0.05] hover:border-white/[0.2] transition-all duration-300">
            <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500/10 blur-2xl transition-all duration-500"></div>
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-transform">
              <f.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="relative text-lg font-semibold text-white mb-2">{f.title}</h3>
            <p className="relative text-sm text-white/60 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-14 relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.1] p-10 sm:p-14 text-center">
        <div className="absolute -top-16 -left-16 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-rose-500/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-balance">Ready to transform your hiring?</h2>
          <p className="text-lg text-white/60 mb-8 max-w-xl mx-auto text-balance">Let's design a plan that fits your team. Our specialists will get you up and running fast.</p>
          <Link to="/contact" className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-rose-500 text-white rounded-xl font-semibold shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2">
            Contact Sales <HiOutlineArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default Enterprise;
