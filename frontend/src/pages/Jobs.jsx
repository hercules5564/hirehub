import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../redux/slices/jobSlice';
import { toggleSaveJob } from '../redux/slices/applicationSlice';
import useAuth from '../hooks/useAuth';
import useDebounce from '../hooks/useDebounce';
import { formatSalary, timeAgo } from '../utils/helpers';
import { JOB_TYPES, LOCATIONS } from '../utils/constants';
import { HiOutlineSearch, HiOutlineLocationMarker, HiOutlineCurrencyRupee, HiOutlineBriefcase, HiOutlineClock, HiOutlineBookmark, HiBookmark, HiOutlineFilter, HiOutlineX } from 'react-icons/hi';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900 pt-20">
      {/* Header */}
      <div className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-2">Find Your Perfect Job</h1>
          <p className="text-dark-500 mb-6">Browse {pagination?.total || 0} available positions</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search jobs, skills, companies..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-dark-50 dark:bg-dark-700 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 dark:border-dark-600 text-dark-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
              <HiOutlineFilter className="w-5 h-5" /> Filters
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-5 bg-dark-50 dark:bg-dark-700 rounded-xl animate-fade-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-dark-600 dark:text-dark-400 mb-1">Location</label>
                <select value={filters.location} onChange={(e) => { setFilters({ ...filters, location: e.target.value }); setPage(1); }}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-800 text-sm text-dark-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">All Locations</option>
                  {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-600 dark:text-dark-400 mb-1">Job Type</label>
                <select value={filters.jobType} onChange={(e) => { setFilters({ ...filters, jobType: e.target.value }); setPage(1); }}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-800 text-sm text-dark-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">All Types</option>
                  {JOB_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-600 dark:text-dark-400 mb-1">Min Experience (yrs)</label>
                <input type="number" min="0" value={filters.experienceMin} onChange={(e) => { setFilters({ ...filters, experienceMin: e.target.value }); setPage(1); }}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-800 text-sm text-dark-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-600 dark:text-dark-400 mb-1">Max Experience (yrs)</label>
                <input type="number" min="0" value={filters.experienceMax} onChange={(e) => { setFilters({ ...filters, experienceMax: e.target.value }); setPage(1); }}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-800 text-sm text-dark-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" placeholder="10" />
              </div>
              <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                <button onClick={clearFilters} className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                  <HiOutlineX className="w-4 h-4" /> Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-dark-800 rounded-2xl p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl skeleton"></div>
                  <div className="flex-1"><div className="h-4 skeleton w-3/4 mb-2"></div><div className="h-3 skeleton w-1/2"></div></div>
                </div>
                <div className="h-4 skeleton w-full mb-2"></div>
                <div className="h-4 skeleton w-2/3 mb-4"></div>
                <div className="flex gap-2"><div className="h-6 skeleton w-16 rounded-full"></div><div className="h-6 skeleton w-20 rounded-full"></div></div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <HiOutlineBriefcase className="w-16 h-16 mx-auto text-dark-300 dark:text-dark-600 mb-4" />
            <h3 className="text-xl font-semibold text-dark-700 dark:text-dark-300 mb-2">No jobs found</h3>
            <p className="text-dark-500 mb-4">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
              {jobs.map((job) => (
                <div key={job._id} className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700 card-hover group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {job.companyId?.logo ? (
                        <img src={job.companyId.logo} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-lg">
                          {job.companyId?.companyName?.[0] || 'C'}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-dark-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-1">
                          <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                        </h3>
                        <p className="text-sm text-dark-500">{job.companyId?.companyName}</p>
                      </div>
                    </div>
                    {isAuthenticated && (
                      <button onClick={() => handleSave(job._id)} className="text-dark-400 hover:text-primary-500 transition-colors">
                        {savedJobIds.includes(job._id) ? <HiBookmark className="w-5 h-5 text-primary-500" /> : <HiOutlineBookmark className="w-5 h-5" />}
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-dark-500">
                    <div className="flex items-center gap-1.5">
                      <HiOutlineLocationMarker className="w-4 h-4 flex-shrink-0" /> <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HiOutlineCurrencyRupee className="w-4 h-4 flex-shrink-0" /> <span>{formatSalary(job.salary)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HiOutlineClock className="w-4 h-4 flex-shrink-0" /> <span>{timeAgo(job.postedDate)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 capitalize">{job.jobType?.replace('-', ' ')}</span>
                    {job.skillsRequired?.slice(0, 2).map((s) => (
                      <span key={s} className="badge bg-gray-100 text-dark-600 dark:bg-dark-700 dark:text-dark-300">{s}</span>
                    ))}
                    {job.skillsRequired?.length > 2 && (
                      <span className="badge bg-gray-100 text-dark-500 dark:bg-dark-700 dark:text-dark-400">+{job.skillsRequired.length - 2}</span>
                    )}
                  </div>

                  <Link to={`/jobs/${job._id}`} className="block w-full text-center py-2.5 rounded-xl border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                    View Details
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center mt-10 gap-2">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-dark-600 text-sm font-medium disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">Previous</button>
                {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                  const p = i + 1;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${p === page ? 'gradient-primary text-white' : 'border border-gray-200 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700'}`}>{p}</button>
                  );
                })}
                <button onClick={() => setPage(Math.min(pagination.pages, page + 1))} disabled={page === pagination.pages}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-dark-600 text-sm font-medium disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Jobs;
