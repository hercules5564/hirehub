import { HiOutlineBriefcase, HiOutlineUsers, HiOutlineLightningBolt, HiOutlineGlobe, HiOutlineHeart } from 'react-icons/hi';
import { Sparkles } from 'lucide-react';
import NeuralBackground from '@/components/ui/flow-field-background';

const accentText = 'bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300';

const stats = [
  { icon: HiOutlineBriefcase, title: '10,000+ Jobs', desc: 'Curated opportunities from top companies across India', color: 'from-indigo-500 to-blue-600' },
  { icon: HiOutlineUsers, title: '50,000+ Users', desc: 'A growing community of professionals and recruiters', color: 'from-violet-500 to-purple-600' },
  { icon: HiOutlineLightningBolt, title: 'AI-Powered', desc: 'Smart matching and resume analysis powered by artificial intelligence', color: 'from-amber-500 to-orange-600' },
  { icon: HiOutlineGlobe, title: 'Pan-India', desc: 'Opportunities in Bangalore, Mumbai, Delhi, Hyderabad, and more', color: 'from-rose-500 to-pink-600' },
];

const About = () => (
  <div className="min-h-screen bg-[#030303] text-white">
    {/* ===== Neural particle hero ===== */}
    <section className="relative min-h-[78vh] flex items-center justify-center overflow-hidden">
      {/* Animated flow-field background — mouse-interactive across the whole hero */}
      <NeuralBackground
        color="#818cf8"
        trailOpacity={0.12}
        particleCount={650}
        speed={0.25}
        className="absolute inset-0 bg-[#030303]"
      />
      {/* Fade the particles into the page body */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#030303] to-transparent pointer-events-none z-[5]" />

      {/* Content overlay — pointer-events-none lets the mouse reach the particles */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pointer-events-none">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/70 bg-white/[0.03] border border-white/[0.1] backdrop-blur-sm px-3 py-1 rounded-full mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-300" /> About Us
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-6 text-balance">
          About <span className={accentText}>HireHub</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto text-balance">
          We're on a mission to connect talent with opportunity, making the hiring process seamless for both candidates and recruiters.
        </p>
      </div>
    </section>

    {/* ===== Body ===== */}
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="grid sm:grid-cols-2 gap-6 mb-16 stagger-children">
        {stats.map((f, i) => (
          <div key={i} className="group relative overflow-hidden rounded-2xl p-6 bg-white/[0.03] border border-white/[0.1] hover:bg-white/[0.05] hover:border-white/[0.2] transition-all duration-300">
            <div className={`absolute -right-10 -top-10 w-28 h-28 rounded-full bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />
            <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-transform`}>
              <f.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="relative text-lg font-bold text-white mb-2">{f.title}</h3>
            <p className="relative text-sm text-white/60 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-2xl p-8 sm:p-10 bg-white/[0.03] border border-white/[0.1]">
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-rose-500/10 blur-3xl" />
        <div className="relative flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-lg flex-shrink-0">
            <HiOutlineHeart className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Our <span className={accentText}>Story</span></h2>
        </div>
        <div className="relative text-white/70 space-y-4 leading-relaxed">
          <p>HireHub was founded with a simple belief: finding the right job or the right candidate shouldn't be complicated. We leverage cutting-edge technology to create a platform that's intuitive, efficient, and fair.</p>
          <p>Our team of engineers, designers, and HR professionals work tirelessly to build tools that empower job seekers and recruiters alike. From AI-powered resume analysis to real-time application tracking, every feature is designed with our users in mind.</p>
          <p>Today, HireHub serves thousands of companies and candidates across India, helping them find their perfect match.</p>
        </div>
      </div>
    </div>
  </div>
);

export default About;
