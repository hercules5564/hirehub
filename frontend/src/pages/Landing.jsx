import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineLocationMarker, HiOutlineBriefcase, HiOutlineUsers, HiOutlineOfficeBuilding, HiOutlineLightningBolt, HiOutlineShieldCheck, HiOutlineChartBar, HiOutlineStar, HiOutlineArrowRight } from 'react-icons/hi';

const Landing = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(search)}`);
  };

  const stats = [
    { icon: HiOutlineBriefcase, value: '10,000+', label: 'Active Jobs', color: 'from-blue-500 to-indigo-600' },
    { icon: HiOutlineUsers, value: '50,000+', label: 'Candidates', color: 'from-purple-500 to-pink-600' },
    { icon: HiOutlineOfficeBuilding, value: '2,500+', label: 'Companies', color: 'from-emerald-500 to-teal-600' },
    { icon: HiOutlineStar, value: '95%', label: 'Success Rate', color: 'from-orange-500 to-red-500' },
  ];

  const features = [
    { icon: HiOutlineLightningBolt, title: 'Smart Job Matching', desc: 'AI-powered recommendations based on your skills, experience, and preferences.', gradient: 'from-yellow-400 to-orange-500' },
    { icon: HiOutlineShieldCheck, title: 'Verified Companies', desc: 'Every company is verified to ensure legitimate and quality job postings.', gradient: 'from-green-400 to-emerald-600' },
    { icon: HiOutlineChartBar, title: 'Career Analytics', desc: 'Track your applications, interviews, and career growth with powerful dashboards.', gradient: 'from-blue-400 to-indigo-600' },
    { icon: HiOutlineStar, title: 'Resume ATS Score', desc: 'Get your resume scored and optimized for Applicant Tracking Systems.', gradient: 'from-purple-400 to-pink-600' },
  ];

  const categories = [
    { name: 'Technology', count: '3,200+', emoji: '💻' },
    { name: 'Design', count: '1,100+', emoji: '🎨' },
    { name: 'Marketing', count: '900+', emoji: '📢' },
    { name: 'Finance', count: '800+', emoji: '💰' },
    { name: 'Healthcare', count: '600+', emoji: '🏥' },
    { name: 'Education', count: '500+', emoji: '📚' },
    { name: 'Engineering', count: '1,400+', emoji: '⚙️' },
    { name: 'Sales', count: '700+', emoji: '🤝' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero text-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">Over 10,000+ jobs available right now</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight mb-6 animate-slide-up">
              Find Your
              <span className="block mt-2 bg-gradient-to-r from-primary-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Dream Career
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Connect with top companies, discover opportunities that match your skills, and take the next step in your professional journey.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4">
                  <HiOutlineSearch className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Job title, skill, or company..."
                    className="w-full py-3 text-gray-800 placeholder-gray-400 bg-transparent outline-none text-sm" />
                </div>
                <button type="submit" className="px-8 py-3 gradient-primary text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                  <HiOutlineSearch className="w-5 h-5" /> Search Jobs
                </button>
              </div>
            </form>

            {/* Popular searches */}
            <div className="mt-6 flex flex-wrap justify-center gap-2 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <span className="text-sm text-gray-400">Popular:</span>
              {['React Developer', 'Python', 'Data Analyst', 'DevOps', 'UI Designer'].map((tag) => (
                <Link key={tag} to={`/jobs?search=${tag}`}
                  className="text-sm px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 transition-colors cursor-pointer">
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" className="w-full h-16 fill-dark-50 dark:fill-dark-900"><path d="M0,60 C360,100 720,20 1440,60 L1440,100 L0,100 Z"></path></svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-dark-50 dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white dark:bg-dark-800 shadow-sm card-hover">
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-dark-900 dark:text-white mb-1">{stat.value}</h3>
                <p className="text-sm text-dark-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 dark:text-white mb-4">
              Why Choose <span className="gradient-text">HireHub</span>?
            </h2>
            <p className="text-lg text-dark-500 max-w-2xl mx-auto">
              Powerful tools and features designed to supercharge your job search and hiring process.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {features.map((feat, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-dark-50 dark:bg-dark-700 card-hover border border-transparent hover:border-primary-200 dark:hover:border-primary-800">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-dark-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-dark-50 dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 dark:text-white mb-4">
              Explore by <span className="gradient-text">Category</span>
            </h2>
            <p className="text-lg text-dark-500">Browse opportunities across diverse industries</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 stagger-children">
            {categories.map((cat, i) => (
              <Link key={i} to={`/jobs?search=${cat.name}`}
                className="group flex flex-col items-center p-6 rounded-2xl bg-white dark:bg-dark-800 card-hover border border-transparent hover:border-primary-200 dark:hover:border-primary-800">
                <span className="text-4xl mb-3 group-hover:scale-125 transition-transform">{cat.emoji}</span>
                <h3 className="font-semibold text-dark-900 dark:text-white mb-1">{cat.name}</h3>
                <p className="text-xs text-dark-500">{cat.count} jobs</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-dark-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative p-12 rounded-3xl gradient-hero overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-purple-600/20"></div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
              <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
                Join thousands of professionals who found their dream job through HireHub.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup" className="px-8 py-3.5 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-100 transition-all hover:scale-105 flex items-center justify-center gap-2">
                  Find a Job <HiOutlineArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/signup" className="px-8 py-3.5 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
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
