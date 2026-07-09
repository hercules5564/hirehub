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
  <div className="min-h-screen bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300">
    {/* ===== Hero ===== */}
    <section className="bg-ink-50 dark:bg-[#11161f] border-b border-ink-200 dark:border-[#262c36]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-ink-200 dark:border-[#262c36] bg-white dark:bg-[#161b22] text-xs font-medium text-ink-600 dark:text-ink-400 mb-6">
          <HiOutlineOfficeBuilding className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" /> Enterprise
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink-900 dark:text-white text-balance leading-[1.1]">
          Hiring infrastructure for <span className="text-primary-600 dark:text-primary-400">modern teams</span>
        </h1>
        <p className="mt-5 text-lg text-ink-600 dark:text-ink-400 max-w-2xl mx-auto text-balance">
          Everything your talent team needs to source, screen, and hire — at any scale, securely.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/contact" className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
            Talk to Sales <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/pricing" className="px-6 py-2.5 border border-ink-300 dark:border-[#262c36] text-ink-800 dark:text-ink-100 rounded-lg font-semibold hover:bg-ink-50 dark:hover:bg-white/[0.04] transition-colors flex items-center justify-center gap-2">
            View Pricing
          </Link>
        </div>
      </div>
    </section>

    {/* ===== Stats ===== */}
    <section className="py-14 border-b border-ink-200 dark:border-[#262c36]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center p-6 rounded-xl border border-ink-200 dark:border-[#262c36] bg-white dark:bg-[#161b22]">
              <p className="text-3xl sm:text-4xl font-bold text-ink-900 dark:text-white">{s.value}</p>
              <p className="text-sm text-ink-500 dark:text-ink-400 mt-1.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ===== Features ===== */}
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 dark:text-white tracking-tight mb-3">Built for scale</h2>
          <p className="text-lg text-ink-600 dark:text-ink-400 text-balance">Powerful tools and enterprise controls that grow with your organization.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border border-ink-200 dark:border-[#262c36] bg-white dark:bg-[#161b22] card-hover">
              <span className="w-11 h-11 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </span>
              <h3 className="text-base font-semibold text-ink-900 dark:text-white mb-1.5">{f.title}</h3>
              <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 rounded-xl border border-ink-200 dark:border-[#262c36] bg-ink-50 dark:bg-[#161b22] p-10 sm:p-14 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 dark:text-white tracking-tight mb-4 text-balance">Ready to transform your hiring?</h2>
          <p className="text-lg text-ink-600 dark:text-ink-400 mb-8 max-w-xl mx-auto text-balance">Let's design a plan that fits your team. Our specialists will get you up and running fast.</p>
          <Link to="/contact" className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors inline-flex items-center justify-center gap-2">
            Contact Sales <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default Enterprise;
