import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCompanyAPI, getJobsAPI } from '../services/api';
import { formatSalary, timeAgo } from '../utils/helpers';
import { HiOutlineLocationMarker, HiOutlineGlobe, HiOutlineUsers, HiOutlineBriefcase, HiOutlineOfficeBuilding, HiOutlineArrowRight, HiOutlineCash, HiOutlineClock } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const CompanyProfile = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [compRes, jobRes] = await Promise.all([getCompanyAPI(id), getJobsAPI({ search: '' })]);
        setCompany(compRes.data.company);
        setJobs(jobRes.data.jobs?.filter((j) => j.companyId?._id === id) || []);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300 flex items-center justify-center">
      <div className="w-10 h-10 border-[3px] border-ink-200 dark:border-[#262c36] border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin"></div>
    </div>
  );
  if (!company) return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-ink-100 dark:bg-white/[0.06] flex items-center justify-center text-ink-400">
          <HiOutlineOfficeBuilding className="w-8 h-8" />
        </div>
        <p className="text-ink-500 dark:text-ink-400 font-medium">Company not found</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300">
      {/* Company header */}
      <div className="border-b border-ink-200 dark:border-[#262c36] bg-ink-50 dark:bg-[#11161f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-6 sm:p-8 shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
              {company.logo ? <img src={company.logo} alt="" className="w-24 h-24 rounded-xl object-cover border border-ink-200 dark:border-[#262c36]" />
                : <div className="w-24 h-24 rounded-xl bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 text-4xl font-bold flex-shrink-0">{company.companyName?.[0]}</div>}
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white text-balance">{company.companyName}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-600 dark:text-ink-300 bg-ink-100 dark:bg-white/[0.06] px-2.5 py-1 rounded-md">
                    <HiOutlineLocationMarker className="w-4 h-4 text-ink-400" /> {company.location}
                  </span>
                  {company.industry && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-600/15 px-2.5 py-1 rounded-md">
                      <HiOutlineBriefcase className="w-4 h-4" /> {company.industry}
                    </span>
                  )}
                  {company.companySize && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-600 dark:text-ink-300 bg-ink-100 dark:bg-white/[0.06] px-2.5 py-1 rounded-md">
                      <HiOutlineUsers className="w-4 h-4 text-ink-400" /> {company.companySize} employees
                    </span>
                  )}
                </div>
              </div>
            </div>
            {company.website && (
              <a href={company.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors mb-5">
                <span className="w-9 h-9 rounded-lg bg-ink-100 dark:bg-white/[0.06] flex items-center justify-center text-ink-500 dark:text-ink-400">
                  <HiOutlineGlobe className="w-4.5 h-4.5" />
                </span>
                {company.website}
              </a>
            )}
            <p className="text-ink-600 dark:text-ink-400 leading-relaxed">{company.description}</p>
          </div>
        </div>
      </div>

      {/* Open positions */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-ink-900 dark:text-white">Open Positions</h2>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-600/15 px-2.5 py-1 rounded-md">
            <HiOutlineBriefcase className="w-4 h-4" /> {jobs.length} roles
          </span>
        </div>
        <div className="space-y-4">
          {jobs.map((job) => (
            <Link key={job._id} to={`/jobs/${job._id}`} className="group block bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-5 card-hover">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0">
                  <HiOutlineBriefcase className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-ink-900 dark:text-white mb-1.5 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-600 dark:text-ink-400">
                    <span className="inline-flex items-center gap-1"><HiOutlineLocationMarker className="w-4 h-4 text-ink-400" /> {job.location}</span>
                    <span className="inline-flex items-center gap-1"><HiOutlineCash className="w-4 h-4 text-ink-400" /> {formatSalary(job.salary)}</span>
                    <span className="inline-flex items-center gap-1 capitalize text-primary-600 dark:text-primary-400 font-medium">{job.jobType}</span>
                    <span className="inline-flex items-center gap-1"><HiOutlineClock className="w-4 h-4 text-ink-400" /> {timeAgo(job.postedDate)}</span>
                  </div>
                </div>
                <HiOutlineArrowRight className="w-5 h-5 text-ink-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 hidden sm:block" />
              </div>
            </Link>
          ))}
          {jobs.length === 0 && (
            <div className="text-center py-14 bg-white dark:bg-[#161b22] rounded-xl border border-dashed border-ink-200 dark:border-[#262c36]">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-ink-100 dark:bg-white/[0.06] flex items-center justify-center text-ink-400">
                <HiOutlineBriefcase className="w-8 h-8" />
              </div>
              <p className="text-ink-900 dark:text-white font-medium">No open positions</p>
              <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">Check back soon for new opportunities.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
