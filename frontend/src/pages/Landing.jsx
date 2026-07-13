import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineSearch, HiOutlineBriefcase, HiOutlineUsers, HiOutlineOfficeBuilding,
  HiOutlineLightningBolt, HiOutlineShieldCheck, HiOutlineChartBar, HiOutlineStar,
  HiOutlineArrowRight, HiOutlineDocumentSearch, HiOutlinePaperAirplane,
  HiOutlineCode, HiOutlineColorSwatch, HiOutlineSpeakerphone, HiOutlineCurrencyDollar,
  HiOutlineHeart, HiOutlineAcademicCap, HiOutlineCog, HiOutlineTrendingUp, HiOutlineCheck,
  HiOutlineLocationMarker,
} from 'react-icons/hi';
import { RevealGroup, RevealItem, Reveal } from '../components/ui/Reveal';

const latestRoles = [
  { title: 'Senior React Developer', company: 'TechCorp India', location: 'Bangalore', salary: '₹15–25L' },
  { title: 'Product Designer', company: 'InnovateTech', location: 'Remote', salary: '₹12–20L' },
  { title: 'Data Analyst', company: 'DataFlow Analytics', location: 'Mumbai', salary: '₹8–14L' },
  { title: 'DevOps Engineer', company: 'CloudNine Solutions', location: 'Hyderabad', salary: '₹16–28L' },
];

const Landing = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(search)}`);
  };

  const stats = [
    { icon: HiOutlineBriefcase, value: '10,000+', label: 'Active jobs' },
    { icon: HiOutlineUsers, value: '50,000+', label: 'Candidates' },
    { icon: HiOutlineOfficeBuilding, value: '2,500+', label: 'Companies' },
    { icon: HiOutlineStar, value: '95%', label: 'Success rate' },
  ];

  const features = [
    { icon: HiOutlineLightningBolt, title: 'Smart job matching', desc: 'Recommendations based on your skills, experience, and preferences — not just keywords.' },
    { icon: HiOutlineShieldCheck, title: 'Verified companies', desc: 'Every company is verified so you only apply to legitimate, quality postings.' },
    { icon: HiOutlineChartBar, title: 'Career analytics', desc: 'Track applications, interviews, and progress from one clear dashboard.' },
    { icon: HiOutlineStar, title: 'Resume ATS score', desc: 'See how your resume scores against applicant tracking systems and fix the gaps.' },
  ];

  const categories = [
    { name: 'Technology', count: '3,200+', icon: HiOutlineCode },
    { name: 'Design', count: '1,100+', icon: HiOutlineColorSwatch },
    { name: 'Marketing', count: '900+', icon: HiOutlineSpeakerphone },
    { name: 'Finance', count: '800+', icon: HiOutlineCurrencyDollar },
    { name: 'Healthcare', count: '600+', icon: HiOutlineHeart },
    { name: 'Education', count: '500+', icon: HiOutlineAcademicCap },
    { name: 'Engineering', count: '1,400+', icon: HiOutlineCog },
    { name: 'Sales', count: '700+', icon: HiOutlineTrendingUp },
  ];

  const steps = [
    { icon: HiOutlineUsers, title: 'Create your profile', desc: 'Build a standout profile and resume in minutes with our guided builder.' },
    { icon: HiOutlineDocumentSearch, title: 'Discover matches', desc: 'Get job recommendations tuned to your skills and goals.' },
    { icon: HiOutlinePaperAirplane, title: 'Apply & get hired', desc: 'Apply in one click, track every stage, and land the role.' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300">
      {/* ===== Hero — search-led, with a live roles preview ===== */}
      <section className="relative overflow-hidden border-b border-ink-200 dark:border-[#262c36]">
        {/* faint dotted texture, fading downward */}
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-10 items-center">
            {/* Left */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-ink-200 dark:border-[#262c36] bg-white dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-ink-600 dark:text-ink-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-500/60 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                </span>
                Fresh roles added every week
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.3rem] font-bold tracking-tight leading-[1.06] text-ink-900 dark:text-white text-balance">
                The shortest path to your{' '}
                <span className="relative whitespace-nowrap text-primary-600 dark:text-primary-400">
                  next role
                  <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-primary-200 dark:bg-primary-600/40" />
                </span>.
              </h1>
              <p className="mt-5 text-lg text-ink-600 dark:text-ink-400 max-w-xl">
                Search verified jobs, get matched to the ones that actually fit, and track every application in one place.
              </p>

              {/* Search */}
              <form onSubmit={handleSearch} className="mt-7 max-w-xl">
                <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] shadow-soft focus-within:border-primary-400 dark:focus-within:border-primary-500 transition-colors">
                  <div className="flex-1 flex items-center gap-2 px-3">
                    <HiOutlineSearch className="w-5 h-5 text-ink-400 flex-shrink-0" />
                    <input
                      type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                      placeholder="Job title, skill, or company"
                      className="w-full py-2.5 bg-transparent text-ink-900 dark:text-white placeholder-ink-400 outline-none text-sm"
                    />
                  </div>
                  <button type="submit" className="px-5 py-2.5 rounded-lg font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors">
                    Search
                  </button>
                </div>
              </form>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-ink-500 dark:text-ink-400">Trending:</span>
                {['React Developer', 'Data Analyst', 'Product Designer', 'DevOps'].map((tag) => (
                  <Link key={tag} to={`/jobs?search=${tag}`}
                    className="px-2.5 py-0.5 rounded-md border border-ink-200 dark:border-[#262c36] text-ink-600 dark:text-ink-400 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {tag}
                  </Link>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <Link to="/signup" className="inline-flex items-center gap-1.5 font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                  Create a free account <HiOutlineArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-ink-300 dark:text-ink-600">·</span>
                <Link to="/signup" className="font-medium text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors">
                  Hiring? Post a job
                </Link>
              </div>
            </div>

            {/* Right — live roles preview panel */}
            <div className="lg:col-span-5">
              <Reveal className="rounded-2xl border border-ink-200 dark:border-[#262c36] bg-white dark:bg-[#161b22] shadow-soft overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-ink-200 dark:border-[#262c36]">
                  <span className="text-sm font-semibold text-ink-900 dark:text-white">Latest openings</span>
                  <Link to="/jobs" className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">View all</Link>
                </div>
                <div className="divide-y divide-ink-200 dark:divide-[#262c36]">
                  {latestRoles.map((r) => (
                    <Link key={r.title} to={`/jobs?search=${encodeURIComponent(r.title)}`}
                      className="group flex items-center gap-3 px-5 py-3.5 hover:bg-ink-50 dark:hover:bg-white/[0.03] transition-colors">
                      <span className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-600/10 text-primary-600 dark:text-primary-400 font-bold flex items-center justify-center flex-shrink-0">
                        {r.company[0]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-ink-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{r.title}</p>
                        <p className="text-xs text-ink-500 dark:text-ink-400 truncate flex items-center gap-1.5">
                          {r.company} <span className="text-ink-300 dark:text-ink-600">·</span>
                          <HiOutlineLocationMarker className="w-3.5 h-3.5" />{r.location} <span className="text-ink-300 dark:text-ink-600">·</span> {r.salary}
                        </p>
                      </div>
                      <HiOutlineArrowRight className="w-4 h-4 text-ink-300 dark:text-ink-600 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>
                  ))}
                </div>
                <Link to="/jobs" className="block px-5 py-3 text-center text-sm font-semibold text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-white/[0.03] border-t border-ink-200 dark:border-[#262c36] transition-colors">
                  Browse all jobs
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Stats ===== */}
      <section className="py-14 border-b border-ink-200 dark:border-[#262c36]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealGroup className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <RevealItem key={i} className="flex items-center gap-3.5 p-5 rounded-xl border border-ink-200 dark:border-[#262c36] bg-white dark:bg-[#161b22]">
                <span className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center flex-shrink-0">
                  <stat.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-ink-900 dark:text-white leading-none">{stat.value}</h3>
                  <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">{stat.label}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ===== Product preview ===== */}
      <section className="py-20 bg-ink-50 dark:bg-[#11161f] border-b border-ink-200 dark:border-[#262c36]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-2">Product</p>
            <h2 className="text-3xl font-bold text-ink-900 dark:text-white tracking-tight">Your whole job search, in one dashboard</h2>
            <p className="mt-3 text-ink-600 dark:text-ink-400">Applications, saved roles, interview stages, and resume score — organized so nothing slips.</p>
          </div>
          <Reveal className="rounded-xl border border-ink-200 dark:border-[#262c36] bg-white dark:bg-[#161b22] p-2 shadow-soft">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80"
              alt="HireHub dashboard preview"
              className="rounded-lg w-full object-cover aspect-[16/9]"
              draggable={false}
            />
          </Reveal>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="py-20 border-b border-ink-200 dark:border-[#262c36]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-2">Why HireHub</p>
            <h2 className="text-3xl font-bold text-ink-900 dark:text-white tracking-tight">Built to get you hired, not to waste your time</h2>
          </div>
          <RevealGroup className="grid sm:grid-cols-2 gap-4">
            {features.map((feat, i) => (
              <RevealItem key={i} className="flex gap-4 p-6 rounded-xl border border-ink-200 dark:border-[#262c36] bg-white dark:bg-[#161b22] card-hover">
                <span className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center flex-shrink-0">
                  <feat.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink-900 dark:text-white mb-1.5">{feat.title}</h3>
                  <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed">{feat.desc}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section className="py-20 bg-ink-50 dark:bg-[#11161f] border-b border-ink-200 dark:border-[#262c36]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-2">How it works</p>
            <h2 className="text-3xl font-bold text-ink-900 dark:text-white tracking-tight">Get hired in three steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {steps.map((step, i) => (
              <div key={i} className="p-6 rounded-xl border border-ink-200 dark:border-[#262c36] bg-white dark:bg-[#161b22]">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-md border border-ink-200 dark:border-[#262c36] flex items-center justify-center text-sm font-bold text-primary-600 dark:text-primary-400">{i + 1}</span>
                  <step.icon className="w-5 h-5 text-ink-400" />
                </div>
                <h3 className="text-base font-semibold text-ink-900 dark:text-white mb-1.5">{step.title}</h3>
                <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Categories ===== */}
      <section className="py-20 border-b border-ink-200 dark:border-[#262c36]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-2">Categories</p>
            <h2 className="text-3xl font-bold text-ink-900 dark:text-white tracking-tight">Explore roles across industries</h2>
          </div>
          <RevealGroup className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map((cat, i) => (
              <RevealItem key={i}>
                <Link to={`/jobs?search=${cat.name}`}
                  className="group flex items-center gap-3 w-full h-full p-4 rounded-xl border border-ink-200 dark:border-[#262c36] bg-white dark:bg-[#161b22] card-hover">
                  <span className="w-9 h-9 rounded-lg bg-ink-100 dark:bg-white/[0.06] flex items-center justify-center text-ink-500 dark:text-ink-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-600/10 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex-shrink-0">
                    <cat.icon className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-ink-900 dark:text-white truncate">{cat.name}</h3>
                    <p className="text-xs text-ink-500 dark:text-ink-400">{cat.count} jobs</p>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-ink-200 dark:border-[#262c36] bg-ink-50 dark:bg-[#161b22] p-10 sm:p-14 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 dark:text-white tracking-tight text-balance">
              Ready to find your next role?
            </h2>
            <p className="mt-3 text-ink-600 dark:text-ink-400 max-w-xl mx-auto">
              Join thousands of professionals who found their job through HireHub.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/signup" className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                Find a job <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/signup" className="px-6 py-2.5 border border-ink-300 dark:border-[#262c36] text-ink-800 dark:text-ink-100 rounded-lg font-semibold hover:bg-white dark:hover:bg-white/[0.04] transition-colors flex items-center justify-center gap-2">
                Post a job <HiOutlineBriefcase className="w-4 h-4" />
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-ink-500 dark:text-ink-400">
              {['Free to get started', 'No credit card required', 'Cancel anytime'].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5"><HiOutlineCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" /> {t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
