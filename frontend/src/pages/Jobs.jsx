import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../redux/slices/jobSlice';
import { toggleSaveJob } from '../redux/slices/applicationSlice';
import useAuth from '../hooks/useAuth';
import useDebounce from '../hooks/useDebounce';
import { formatSalary, timeAgo } from '../utils/helpers';
import { JOB_TYPES, LOCATIONS } from '../utils/constants';
import { HiOutlineSearch, HiOutlineLocationMarker, HiOutlineCurrencyRupee, HiOutlineBriefcase, HiOutlineClock, HiOutlineBookmark, HiBookmark, HiOutlineFilter, HiOutlineX, HiOutlineArrowRight, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

const fieldClass = 'w-full px-3 py-2.5 rounded-lg bg-white dark:bg-[#0d1117] border border-ink-300 dark:border-[#262c36] text-sm text-ink-900 dark:text-white placeholder-ink-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition [&>option]:bg-white dark:[&>option]:bg-[#161b22] [&>option]:text-ink-900 dark:[&>option]:text-white';
const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-1.5';

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
    <div className="min-h-screen bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300">
      {/* ===== Header ===== */}
      <div className="border-b border-ink-200 dark:border-[#262c36] bg-ink-50 dark:bg-[#11161f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white text-balance">
            Find your next role
          </h1>
          <p className="text-ink-500 dark:text-ink-400 mt-1.5 mb-6">Browse {pagination?.total || 0} open positions</p>

          <div className="flex flex-col sm:flex-row gap-2.5 p-2 rounded-xl bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] shadow-soft">
            <div className="flex-1 relative">
              <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
              <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search jobs, skills, companies…"
                className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-transparent text-ink-900 dark:text-white placeholder-ink-400 outline-none" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold border border-ink-300 dark:border-[#262c36] text-ink-800 dark:text-ink-100 hover:bg-ink-50 dark:hover:bg-white/[0.04] transition-colors">
              <HiOutlineFilter className="w-5 h-5" /> Filters
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-3 p-5 rounded-xl bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] animate-fade-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className={labelClass}>Location</label>
                <select value={filters.location} onChange={(e) => { setFilters({ ...filters, location: e.target.value }); setPage(1); }} className={fieldClass}>
                  <option value="">All Locations</option>
                  {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Job Type</label>
                <select value={filters.jobType} onChange={(e) => { setFilters({ ...filters, jobType: e.target.value }); setPage(1); }} className={fieldClass}>
                  <option value="">All Types</option>
                  {JOB_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Min Experience (yrs)</label>
                <input type="number" min="0" value={filters.experienceMin} onChange={(e) => { setFilters({ ...filters, experienceMin: e.target.value }); setPage(1); }} className={fieldClass} placeholder="0" />
              </div>
              <div>
                <label className={labelClass}>Max Experience (yrs)</label>
                <input type="number" min="0" value={filters.experienceMax} onChange={(e) => { setFilters({ ...filters, experienceMax: e.target.value }); setPage(1); }} className={fieldClass} placeholder="10" />
              </div>
              <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                <button onClick={clearFilters} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white border border-ink-300 dark:border-[#262c36] hover:bg-ink-50 dark:hover:bg-white/[0.04] px-3.5 py-1.5 rounded-lg transition-colors">
                  <HiOutlineX className="w-4 h-4" /> Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== Jobs Grid ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl p-6 bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-lg skeleton"></div>
                  <div className="flex-1"><div className="h-4 skeleton w-3/4 mb-2"></div><div className="h-3 skeleton w-1/2"></div></div>
                </div>
                <div className="h-4 skeleton w-full mb-2"></div>
                <div className="h-4 skeleton w-2/3 mb-4"></div>
                <div className="flex gap-2"><div className="h-6 skeleton rounded-full w-16"></div><div className="h-6 skeleton rounded-full w-20"></div></div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-ink-100 dark:bg-white/[0.06] flex items-center justify-center text-ink-400">
              <HiOutlineBriefcase className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-ink-900 dark:text-white mb-1.5">No jobs found</h3>
            <p className="text-ink-500 dark:text-ink-400 mb-5">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="btn-primary">Clear filters</button>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <div key={job._id}
                  className="relative rounded-xl p-6 bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] card-hover group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {job.companyId?.logo ? (
                        <img src={job.companyId.logo} alt="" className="w-11 h-11 rounded-lg object-cover border border-ink-200 dark:border-[#262c36]" />
                      ) : (
                        <div className="w-11 h-11 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg flex-shrink-0">
                          {job.companyId?.companyName?.[0] || 'C'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-semibold text-ink-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                          <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                        </h3>
                        <p className="text-sm text-ink-500 dark:text-ink-400 truncate">{job.companyId?.companyName}</p>
                      </div>
                    </div>
                    {isAuthenticated && (
                      <button onClick={() => handleSave(job._id)} className="text-ink-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex-shrink-0">
                        {savedJobIds.includes(job._id) ? <HiBookmark className="w-5 h-5 text-primary-600 dark:text-primary-400" /> : <HiOutlineBookmark className="w-5 h-5" />}
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-ink-600 dark:text-ink-400">
                    <div className="flex items-center gap-1.5">
                      <HiOutlineLocationMarker className="w-4 h-4 flex-shrink-0 text-ink-400" /> <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HiOutlineCurrencyRupee className="w-4 h-4 flex-shrink-0 text-ink-400" /> <span>{formatSalary(job.salary)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HiOutlineClock className="w-4 h-4 flex-shrink-0 text-ink-400" /> <span>{timeAgo(job.postedDate)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-primary-50 dark:bg-primary-600/15 text-primary-700 dark:text-primary-300 capitalize">{job.jobType?.replace('-', ' ')}</span>
                    {job.skillsRequired?.slice(0, 2).map((s) => (
                      <span key={s} className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-ink-100 dark:bg-white/[0.06] text-ink-600 dark:text-ink-300">{s}</span>
                    ))}
                    {job.skillsRequired?.length > 2 && (
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-ink-100 dark:bg-white/[0.06] text-ink-500 dark:text-ink-400">+{job.skillsRequired.length - 2}</span>
                    )}
                  </div>

                  <Link to={`/jobs/${job._id}`} className="flex items-center justify-center gap-1.5 w-full text-center py-2.5 rounded-lg border border-ink-300 dark:border-[#262c36] text-ink-800 dark:text-ink-100 text-sm font-semibold hover:bg-ink-50 dark:hover:bg-white/[0.04] transition-colors group/btn">
                    View details <HiOutlineArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center items-center mt-12 gap-2">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                  className="flex items-center gap-1 px-3.5 py-2 rounded-lg border border-ink-300 dark:border-[#262c36] text-sm font-medium text-ink-700 dark:text-ink-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ink-50 dark:hover:bg-white/[0.04] transition-colors">
                  <HiOutlineChevronLeft className="w-4 h-4" /> Previous
                </button>
                {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                  const p = i + 1;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${p === page ? 'bg-primary-600 text-white' : 'border border-ink-300 dark:border-[#262c36] text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-white/[0.04]'}`}>{p}</button>
                  );
                })}
                <button onClick={() => setPage(Math.min(pagination.pages, page + 1))} disabled={page === pagination.pages}
                  className="flex items-center gap-1 px-3.5 py-2 rounded-lg border border-ink-300 dark:border-[#262c36] text-sm font-medium text-ink-700 dark:text-ink-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ink-50 dark:hover:bg-white/[0.04] transition-colors">
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
