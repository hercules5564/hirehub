import { Link } from 'react-router-dom';
import { HiOutlineSparkles, HiOutlineCheck, HiOutlineArrowRight, HiOutlineOfficeBuilding } from 'react-icons/hi';

const plans = [
  {
    name: 'Starter',
    price: '₹0',
    period: '/forever',
    desc: 'Everything you need to start your job search.',
    cta: 'Get Started',
    to: '/signup',
    highlight: false,
    features: ['Browse all jobs', 'Apply to 10 jobs / month', 'Basic resume builder', 'Email job alerts', 'Community support'],
  },
  {
    name: 'Pro',
    price: '₹999',
    period: '/month',
    desc: 'For serious candidates who want an edge.',
    cta: 'Upgrade to Pro',
    to: '/signup',
    highlight: true,
    features: ['Unlimited applications', 'AI resume ATS scoring', 'Priority in recruiter search', 'Advanced analytics dashboard', 'All resume templates', 'Priority support'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For teams and companies hiring at scale.',
    cta: 'Contact Sales',
    to: '/enterprise',
    highlight: false,
    features: ['Unlimited job postings', 'Team & role management', 'Branded company page', 'Bulk candidate tools', 'Dedicated account manager', 'SLA & SSO'],
  },
];

const Pricing = () => (
  <div className="min-h-screen bg-[#030303] text-white">
    {/* ===== Hero ===== */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 right-10 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl"></div>
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-28 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 border border-white/[0.1] px-3 py-1 rounded-full mb-6">
          <HiOutlineSparkles className="w-4 h-4" /> Pricing
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-6 text-balance text-white">
          Simple, transparent <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">pricing</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto text-balance">
          Start free and upgrade when you're ready. No hidden fees, cancel anytime.
        </p>
      </div>
    </section>

    {/* ===== Plans ===== */}
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 -mt-10 relative">
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {plans.map((plan) => (
          <div key={plan.name}
            className={`relative rounded-2xl p-8 border transition-all duration-300 ${
              plan.highlight
                ? 'bg-white/[0.05] border-transparent bg-clip-padding lg:-translate-y-3 shadow-[0_8px_40px_0_rgba(99,102,241,0.25)] ring-1 ring-inset ring-indigo-400/40'
                : 'bg-white/[0.03] border-white/[0.1] hover:bg-white/[0.05] hover:border-white/[0.2]'
            }`}>
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-rose-500 px-3 py-1 rounded-full shadow-[0_8px_24px_0_rgba(99,102,241,0.35)]">
                <HiOutlineSparkles className="w-3.5 h-3.5" /> Most Popular
              </span>
            )}
            <h3 className="text-lg font-bold text-white">{plan.name}</h3>
            <p className="text-sm text-white/60 mt-1 mb-5 leading-relaxed">{plan.desc}</p>
            <div className="flex items-end gap-1 mb-6">
              <span className={`text-4xl font-extrabold ${plan.highlight ? 'bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300' : 'text-white'}`}>{plan.price}</span>
              <span className="text-sm text-white/50 mb-1.5">{plan.period}</span>
            </div>
            <Link to={plan.to}
              className={`w-full mb-7 justify-center flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                plan.highlight
                  ? 'bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105'
                  : 'border border-white/[0.12] text-white/80 hover:bg-white/[0.06]'
              }`}>
              {plan.cta} <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
            <ul className="space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-white/60">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <HiOutlineCheck className="w-3.5 h-3.5 text-indigo-300" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Enterprise strip */}
      <div className="mt-12 relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.1] p-8 sm:p-10 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-12 -right-10 w-72 h-72 bg-rose-500/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2"><HiOutlineOfficeBuilding className="w-6 h-6 text-indigo-300" /> Hiring at scale?</h2>
            <p className="text-white/60 mt-2 max-w-xl">Custom plans, volume pricing, and dedicated support for enterprise teams.</p>
          </div>
          <Link to="/enterprise" className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-rose-500 text-white rounded-xl font-semibold shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300 flex items-center gap-2 flex-shrink-0">
            Explore Enterprise <HiOutlineArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default Pricing;
