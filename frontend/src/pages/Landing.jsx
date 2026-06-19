import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineSearch, HiOutlineBriefcase, HiOutlineUsers, HiOutlineOfficeBuilding,
  HiOutlineLightningBolt, HiOutlineShieldCheck, HiOutlineChartBar, HiOutlineStar,
  HiOutlineArrowRight, HiOutlineSparkles, HiOutlineDocumentSearch, HiOutlinePaperAirplane,
  HiOutlineCode, HiOutlineColorSwatch, HiOutlineSpeakerphone, HiOutlineCurrencyDollar,
  HiOutlineHeart, HiOutlineAcademicCap, HiOutlineCog, HiOutlineTrendingUp,
} from 'react-icons/hi';
import { RevealGroup, RevealItem } from '../components/ui/Reveal';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

// Shared accent for headings — mirrors the hero's gradient clip-text.
const accentText =
  'bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300';
// Shared glass card surface — mirrors the hero's translucent panels.
const glassCard =
  'bg-white/[0.03] border border-white/[0.1] hover:bg-white/[0.05] hover:border-white/[0.2] transition-all duration-300';

const Landing = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(search)}`);
  };

  const stats = [
    { icon: HiOutlineBriefcase, value: '10,000+', label: 'Active Jobs', color: 'from-indigo-500 to-blue-600' },
    { icon: HiOutlineUsers, value: '50,000+', label: 'Candidates', color: 'from-violet-500 to-purple-600' },
    { icon: HiOutlineOfficeBuilding, value: '2,500+', label: 'Companies', color: 'from-rose-500 to-pink-600' },
    { icon: HiOutlineStar, value: '95%', label: 'Success Rate', color: 'from-amber-500 to-orange-500' },
  ];

  const features = [
    { icon: HiOutlineLightningBolt, title: 'Smart Job Matching', desc: 'AI-powered recommendations based on your skills, experience, and preferences.', gradient: 'from-amber-400 to-orange-500' },
    { icon: HiOutlineShieldCheck, title: 'Verified Companies', desc: 'Every company is verified to ensure legitimate and quality job postings.', gradient: 'from-emerald-400 to-teal-500' },
    { icon: HiOutlineChartBar, title: 'Career Analytics', desc: 'Track your applications, interviews, and career growth with powerful dashboards.', gradient: 'from-indigo-400 to-blue-600' },
    { icon: HiOutlineStar, title: 'Resume ATS Score', desc: 'Get your resume scored and optimized for Applicant Tracking Systems.', gradient: 'from-rose-400 to-pink-600' },
  ];

  const categories = [
    { name: 'Technology', count: '3,200+', icon: HiOutlineCode, color: 'from-blue-500 to-indigo-600' },
    { name: 'Design', count: '1,100+', icon: HiOutlineColorSwatch, color: 'from-pink-500 to-rose-500' },
    { name: 'Marketing', count: '900+', icon: HiOutlineSpeakerphone, color: 'from-orange-500 to-amber-500' },
    { name: 'Finance', count: '800+', icon: HiOutlineCurrencyDollar, color: 'from-emerald-500 to-teal-600' },
    { name: 'Healthcare', count: '600+', icon: HiOutlineHeart, color: 'from-red-500 to-pink-500' },
    { name: 'Education', count: '500+', icon: HiOutlineAcademicCap, color: 'from-violet-500 to-purple-600' },
    { name: 'Engineering', count: '1,400+', icon: HiOutlineCog, color: 'from-cyan-500 to-blue-600' },
    { name: 'Sales', count: '700+', icon: HiOutlineTrendingUp, color: 'from-fuchsia-500 to-pink-600' },
  ];

  const steps = [
    { icon: HiOutlineUsers, title: 'Create your profile', desc: 'Build a standout profile and resume in minutes with our guided builder.' },
    { icon: HiOutlineDocumentSearch, title: 'Discover matches', desc: 'Get personalized job recommendations tuned to your skills and goals.' },
    { icon: HiOutlinePaperAirplane, title: 'Apply & get hired', desc: 'Apply in one click, track every stage, and land your dream role.' },
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* ===== Hero (HeroGeometric shape-landing) ===== */}
      <HeroGeometric
        badge="HireHub — Hiring, reimagined"
        title1="Find Your"
        title2="Dream Career"
        subtitle="Connect with top companies, discover opportunities that match your skills, and take the next step in your professional journey."
      >
        {/* Search Bar (kept as the primary job-portal CTA) */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-white/[0.04] border border-white/[0.14] backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
            <div className="flex-1 flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-xl px-4">
              <HiOutlineSearch className="w-5 h-5 text-white/60 flex-shrink-0" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Job title, skill, or company..."
                className="w-full py-3 text-white placeholder-white/60 bg-transparent outline-none text-sm" />
            </div>
            <button type="submit" className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-rose-500 shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:shadow-[0_8px_32px_0_rgba(244,63,94,0.4)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]">
              <HiOutlineSearch className="w-5 h-5" /> Search Jobs
            </button>
          </div>
        </form>

        {/* Popular searches */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <span className="text-sm text-white/60">Popular:</span>
          {['React Developer', 'Python', 'Data Analyst', 'DevOps', 'UI Designer'].map((tag) => (
            <Link key={tag} to={`/jobs?search=${tag}`}
              className="text-sm px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-white/60 hover:text-white transition-all hover:-translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]">
              {tag}
            </Link>
          ))}
        </div>
      </HeroGeometric>

      {/* ===== Stats ===== */}
      <section className="relative py-20 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealGroup className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <RevealItem key={i} className={`group text-center p-6 rounded-2xl backdrop-blur-sm hover:-translate-y-1 ${glassCard}`}>
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-transform`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-sm text-white/50">{stat.label}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ===== Product preview (scroll-reveal) ===== */}
      <ContainerScroll
        titleComponent={
          <>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full mb-4">
              <HiOutlineSparkles className="w-4 h-4" /> Product preview
            </span>
            <h1 className="text-4xl font-semibold text-white">
              Your whole job search, <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                in one dashboard
              </span>
            </h1>
          </>
        }
      >
        <img
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80"
          alt="HireHub dashboard preview"
          className="mx-auto rounded-2xl object-cover h-full w-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>

      {/* ===== Features ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/[0.04] to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/60 bg-white/[0.03] border border-white/[0.08] px-3 py-1 rounded-full mb-4">
              <HiOutlineSparkles className="w-4 h-4" /> Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose <span className={accentText}>HireHub</span>?
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto text-balance">
              Powerful tools and features designed to supercharge your job search and hiring process.
            </p>
          </div>
          <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <RevealItem key={i} className={`group relative p-6 rounded-2xl overflow-hidden ${glassCard}`}>
                <div className={`absolute -right-10 -top-10 w-28 h-28 rounded-full bg-gradient-to-br ${feat.gradient} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />
                <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:-rotate-6 transition-transform shadow-lg`}>
                  <feat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="relative text-lg font-semibold text-white mb-2">{feat.title}</h3>
                <p className="relative text-sm text-white/60 leading-relaxed">{feat.desc}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section className="relative py-24 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Get hired in <span className={accentText}>three steps</span>
            </h2>
            <p className="text-lg text-white/60">Your next opportunity is closer than you think</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            {steps.map((step, i) => (
              <div key={i} className="relative text-center p-6">
                <div className="relative w-20 h-20 mx-auto mb-5">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-[0_8px_32px_0_rgba(99,102,241,0.3)] mx-auto">
                    <step.icon className="w-9 h-9 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#030303] border border-white/15 text-white text-sm font-bold flex items-center justify-center">{i + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Categories ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rose-500/[0.04] to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Explore by <span className={accentText}>Category</span>
            </h2>
            <p className="text-lg text-white/60">Browse opportunities across diverse industries</p>
          </div>
          <RevealGroup className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <RevealItem key={i}>
                <Link to={`/jobs?search=${cat.name}`}
                  className={`group flex flex-col items-center w-full h-full p-6 rounded-2xl hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303] ${glassCard}`}>
                  <span className={`w-14 h-14 mb-3 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-transform`}>
                    <cat.icon className="w-7 h-7" />
                  </span>
                  <h3 className="font-semibold text-white mb-1">{cat.name}</h3>
                  <p className="text-xs text-white/60">{cat.count} jobs</p>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-24 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="relative p-12 sm:p-16 rounded-[2rem] bg-white/[0.03] border border-white/[0.08] overflow-hidden">
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-aurora" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl animate-aurora" style={{ animationDelay: '4s' }} />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 text-balance">
                Ready to <span className={accentText}>Get Started?</span>
              </h2>
              <p className="text-lg text-white/50 mb-8 max-w-xl mx-auto text-balance">
                Join thousands of professionals who found their dream job through HireHub.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup" className="px-8 py-3.5 bg-white text-[#030303] rounded-xl font-semibold hover:bg-white/90 transition-all hover:scale-105 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]">
                  Find a Job <HiOutlineArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/signup" className="px-8 py-3.5 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/[0.06] hover:border-white/40 transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]">
                  Post a Job <HiOutlineBriefcase className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
