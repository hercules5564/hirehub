import { HiOutlineBriefcase, HiOutlineUsers, HiOutlineLightningBolt, HiOutlineGlobe } from 'react-icons/hi';

const About = () => (
  <div className="min-h-screen bg-dark-50 dark:bg-dark-900 pt-20">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="text-4xl font-bold text-dark-900 dark:text-white mb-4">About <span className="gradient-text">HireHub</span></h1>
        <p className="text-lg text-dark-500 max-w-2xl mx-auto">We're on a mission to connect talent with opportunity, making the hiring process seamless for both candidates and recruiters.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-16 stagger-children">
        {[
          { icon: HiOutlineBriefcase, title: '10,000+ Jobs', desc: 'Curated opportunities from top companies across India', color: 'from-blue-500 to-indigo-600' },
          { icon: HiOutlineUsers, title: '50,000+ Users', desc: 'A growing community of professionals and recruiters', color: 'from-purple-500 to-pink-600' },
          { icon: HiOutlineLightningBolt, title: 'AI-Powered', desc: 'Smart matching and resume analysis powered by artificial intelligence', color: 'from-yellow-500 to-orange-600' },
          { icon: HiOutlineGlobe, title: 'Pan-India', desc: 'Opportunities in Bangalore, Mumbai, Delhi, Hyderabad, and more', color: 'from-green-500 to-teal-600' },
        ].map((f, i) => (
          <div key={i} className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700 card-hover">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
              <f.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-2">{f.title}</h3>
            <p className="text-sm text-dark-500">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-100 dark:border-dark-700 animate-fade-in">
        <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-4">Our Story</h2>
        <div className="text-dark-600 dark:text-dark-300 space-y-4 leading-relaxed">
          <p>HireHub was founded with a simple belief: finding the right job or the right candidate shouldn't be complicated. We leverage cutting-edge technology to create a platform that's intuitive, efficient, and fair.</p>
          <p>Our team of engineers, designers, and HR professionals work tirelessly to build tools that empower job seekers and recruiters alike. From AI-powered resume analysis to real-time application tracking, every feature is designed with our users in mind.</p>
          <p>Today, HireHub serves thousands of companies and candidates across India, helping them find their perfect match.</p>
        </div>
      </div>
    </div>
  </div>
);

export default About;
