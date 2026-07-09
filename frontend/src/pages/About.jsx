import { HiOutlineBriefcase, HiOutlineUsers, HiOutlineLightningBolt, HiOutlineGlobe, HiOutlineHeart } from 'react-icons/hi';

const stats = [
  { icon: HiOutlineBriefcase, title: '10,000+ Jobs', desc: 'Curated opportunities from top companies across India' },
  { icon: HiOutlineUsers, title: '50,000+ Users', desc: 'A growing community of professionals and recruiters' },
  { icon: HiOutlineLightningBolt, title: 'AI-Powered', desc: 'Smart matching and resume analysis powered by artificial intelligence' },
  { icon: HiOutlineGlobe, title: 'Pan-India', desc: 'Opportunities in Bangalore, Mumbai, Delhi, Hyderabad, and more' },
];

const About = () => (
  <div className="min-h-screen bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300">
    {/* ===== Hero ===== */}
    <section className="bg-ink-50 dark:bg-[#11161f] border-b border-ink-200 dark:border-[#262c36]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-3">About us</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink-900 dark:text-white text-balance leading-[1.1]">
          About HireHub
        </h1>
        <p className="mt-5 text-lg text-ink-600 dark:text-ink-400 max-w-2xl mx-auto text-balance">
          We're on a mission to connect talent with opportunity, making the hiring process seamless for both candidates and recruiters.
        </p>
      </div>
    </section>

    {/* ===== Body ===== */}
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid sm:grid-cols-2 gap-4 mb-14">
        {stats.map((f, i) => (
          <div key={i} className="p-6 rounded-xl border border-ink-200 dark:border-[#262c36] bg-white dark:bg-[#161b22]">
            <span className="w-11 h-11 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center mb-4">
              <f.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </span>
            <h3 className="text-lg font-semibold text-ink-900 dark:text-white mb-1.5">{f.title}</h3>
            <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-8 sm:p-10 bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36]">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-11 h-11 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center flex-shrink-0">
            <HiOutlineHeart className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </span>
          <h2 className="text-2xl font-bold text-ink-900 dark:text-white">Our Story</h2>
        </div>
        <div className="text-ink-600 dark:text-ink-400 space-y-4 leading-relaxed">
          <p>HireHub was founded with a simple belief: finding the right job or the right candidate shouldn't be complicated. We leverage cutting-edge technology to create a platform that's intuitive, efficient, and fair.</p>
          <p>Our team of engineers, designers, and HR professionals work tirelessly to build tools that empower job seekers and recruiters alike. From AI-powered resume analysis to real-time application tracking, every feature is designed with our users in mind.</p>
          <p>Today, HireHub serves thousands of companies and candidates across India, helping them find their perfect match.</p>
        </div>
      </div>
    </div>
  </div>
);

export default About;
