import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../redux/slices/jobSlice';
import { toggleSaveJob } from '../redux/slices/applicationSlice';
import useAuth from '../hooks/useAuth';
import useDebounce from '../hooks/useDebounce';
import { formatSalary, timeAgo } from '../utils/helpers';
import { JOB_TYPES, LOCATIONS } from '../utils/constants';
import { HiOutlineSearch, HiOutlineLocationMarker, HiOutlineCurrencyRupee, HiOutlineBriefcase, HiOutlineClock, HiOutlineBookmark, HiBookmark, HiOutlineFilter, HiOutlineX, HiOutlineSparkles, HiOutlineArrowRight, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { motion } from 'motion/react';
import { GenerativeArtScene } from '@/components/ui/anomalous-matter-hero';

const accentText = 'bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300';
const gradientBtn = 'bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:shadow-[0_8px_32px_0_rgba(244,63,94,0.4)] hover:scale-105 transition-all duration-300';
const fieldClass = 'w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-indigo-400/60 [&>option]:bg-[#0a0a0a] [&>option]:text-white';

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({ location: '', jobType: '', salaryMin: '', salaryMax: '', experienceMin: '', experienceMax: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();
  const { jobs, pagination, loading } = useSelector((s) => s.jobs);
  const { savedJobIds } = useSelector((s) => s.applications);
  const { isAuthenticated } = useAuth();
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    const params = { page, limit: 12 };
    if (debouncedSearch) params.search = debouncedSearch;
    if (filters.location) params.location = filters.location;
    if (filters.jobType) params.jobType = filters.jobType;
    if (filters.salaryMin) params.salaryMin = filters.salaryMin;
    if (filters.salaryMax) params.salaryMax = filters.salaryMax;
    if (filters.experienceMin) params.experienceMin = filters.experienceMin;
    if (filters.experienceMax) params.experienceMax = filters.experienceMax;
    dispatch(fetchJobs(params));
  }, [dispatch, debouncedSearch, filters, page]);

  const handleSave = (jobId) => { if (isAuthenticated) dispatch(toggleSaveJob(jobId)); };
  const clearFilters = () => { setFilters({ location: '', jobType: '', salaryMin: '', salaryMax: '', experienceMin: '', experienceMax: '' }); setSearch(''); };

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* ===== Header with anomalous-matter 3D scene ===== */}
      <div className="relative overflow-hidden border-b border-white/[0.06] pt-24 pb-12">
        {/* WebGL flow-field / shader orb */}
        <GenerativeArtScene color="#818cf8" />
        {/* Readability overlay (darker toward the search bar) */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#030303]/50 via-[#030303]/40 to-[#030303] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/70 bg-white/[0.03] border border-white/[0.1] backdrop-blur-sm px-3 py-1 rounded-full mb-4">
            <HiOutlineSparkles className="w-4 h-4 text-indigo-300" /> Explore Openings
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-balance">
            Find Your <span className={accentText}>Perfect Job</span>
          </h1>
          <p className="text-white/60 mb-7">Browse {pagination?.total || 0} available positions</p>

          <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-white/[0.04] border border-white/[0.14] backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
            <div className="flex-1 relative">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search jobs, skills, companies..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303] ${gradientBtn}`}>
              <HiOutlineFilter className="w-5 h-5" /> Filters
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.1] backdrop-blur-md animate-fade-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">Location</label>
                <select value={filters.location} onChange={(e) => { setFilters({ ...filters, location: e.target.value }); setPage(1); }} className={fieldClass}>
                  <option value="">All Locations</option>
                  {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">Job Type</label>
                <select value={filters.jobType} onChange={(e) => { setFilters({ ...filters, jobType: e.target.value }); setPage(1); }} className={fieldClass}>
                  <option value="">All Types</option>
                  {JOB_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">Min Experience (yrs)</label>
                <input type="number" min="0" value={filters.experienceMin} onChange={(e) => { setFilters({ ...filters, experienceMin: e.target.value }); setPage(1); }} className={fieldClass} placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">Max Experience (yrs)</label>
                <input type="number" min="0" value={filters.experienceMax} onChange={(e) => { setFilters({ ...filters, experienceMax: e.target.value }); setPage(1); }} className={fieldClass} placeholder="10" />
              </div>
              <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                <button onClick={clearFilters} className="inline-flex items-center gap-1 text-sm font-semibold text-white/80 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.12] px-4 py-2 rounded-full transition-colors">
                  <HiOutlineX className="w-4 h-4" /> Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== Jobs Grid ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl p-6 bg-white/[0.03] border border-white/[0.08]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.06] animate-pulse"></div>
                  <div className="flex-1"><div className="h-4 bg-white/[0.06] rounded animate-pulse w-3/4 mb-2"></div><div className="h-3 bg-white/[0.06] rounded animate-pulse w-1/2"></div></div>
                </div>
                <div className="h-4 bg-white/[0.06] rounded animate-pulse w-full mb-2"></div>
                <div className="h-4 bg-white/[0.06] rounded animate-pulse w-2/3 mb-4"></div>
                <div className="flex gap-2"><div className="h-6 bg-white/[0.06] rounded-full animate-pulse w-16"></div><div className="h-6 bg-white/[0.06] rounded-full animate-pulse w-20"></div></div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-[0_8px_32px_0_rgba(99,102,241,0.3)]">
              <HiOutlineBriefcase className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
            <p className="text-white/60 mb-5">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className={`px-6 py-2.5 rounded-xl font-semibold ${gradientBtn}`}>Clear Filters</button>
          </div>
        ) : (
          <>
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              initial="hidden"
              animate="show"
            >
              {jobs.map((job) => (
                <motion.div key={job._id}
                  variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }}
                  className="relative rounded-2xl p-6 bg-white/[0.03] border border-white/[0.1] hover:bg-white/[0.05] hover:border-white/[0.2] transition-all duration-300 group overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500/10 blur-2xl transition-all duration-500 pointer-events-none"></div>
                  <div className="relative flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {job.companyId?.logo ? (
                        <img src={job.companyId.logo} alt="" className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                          {job.companyId?.companyName?.[0] || 'C'}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                          <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                        </h3>
                        <p className="text-sm text-white/50">{job.companyId?.companyName}</p>
                      </div>
                    </div>
                    {isAuthenticated && (
                      <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.8 }} onClick={() => handleSave(job._id)} className="text-white/50 hover:text-indigo-300 transition-colors">
                        {savedJobIds.includes(job._id) ? <HiBookmark className="w-5 h-5 text-indigo-300" /> : <HiOutlineBookmark className="w-5 h-5" />}
                      </motion.button>
                    )}
                  </div>

                  <div className="relative space-y-2 mb-4 text-sm text-white/60">
                    <div className="flex items-center gap-1.5">
                      <HiOutlineLocationMarker className="w-4 h-4 flex-shrink-0 text-indigo-400" /> <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HiOutlineCurrencyRupee className="w-4 h-4 flex-shrink-0 text-indigo-400" /> <span>{formatSalary(job.salary)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HiOutlineClock className="w-4 h-4 flex-shrink-0 text-indigo-400" /> <span>{timeAgo(job.postedDate)}</span>
                    </div>
                  </div>

                  <div className="relative flex flex-wrap gap-1.5 mb-5">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/15 text-indigo-300 capitalize">{job.jobType?.replace('-', ' ')}</span>
                    {job.skillsRequired?.slice(0, 2).map((s) => (
                      <span key={s} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/[0.06] text-white/70">{s}</span>
                    ))}
                    {job.skillsRequired?.length > 2 && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/[0.06] text-white/60">+{job.skillsRequired.length - 2}</span>
                    )}
                  </div>

                  <Link to={`/jobs/${job._id}`} className="relative flex items-center justify-center gap-1.5 w-full text-center py-2.5 rounded-xl border border-white/[0.12] text-white/80 text-sm font-semibold hover:bg-white/[0.06] hover:text-white transition-colors group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]">
                    View Details <HiOutlineArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center items-center mt-12 gap-2">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl border border-white/[0.1] bg-white/[0.04] text-sm font-medium text-white/70 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/[0.08] hover:text-white transition-colors">
                  <HiOutlineChevronLeft className="w-4 h-4" /> Previous
                </button>
                {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                  const p = i + 1;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${p === page ? `${gradientBtn} scale-105` : 'border border-white/[0.1] bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white'}`}>{p}</button>
                  );
                })}
                <button onClick={() => setPage(Math.min(pagination.pages, page + 1))} disabled={page === pagination.pages}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl border border-white/[0.1] bg-white/[0.04] text-sm font-medium text-white/70 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/[0.08] hover:text-white transition-colors">
                  Next <HiOutlineChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Jobs;
