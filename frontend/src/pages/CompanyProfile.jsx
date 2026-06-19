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
    <div className="min-h-screen bg-[#030303] text-white pt-24 flex items-center justify-center">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 animate-pulse flex items-center justify-center">
        <div className="w-6 h-6 border-[3px] border-white/40 border-t-white rounded-full animate-spin"></div>
      </div>
    </div>
  );
  if (!company) return (
    <div className="min-h-screen bg-[#030303] text-white pt-24 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-300">
          <HiOutlineOfficeBuilding className="w-8 h-8" />
        </div>
        <p className="text-white/60 font-medium">Company not found</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-20">
      {/* Decorative hero band */}
      <div className="relative h-44 sm:h-52 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 right-10 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" className="w-full h-12 fill-[#030303]"><path d="M0,60 C360,100 720,20 1440,60 L1440,100 L0,100 Z"></path></svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-12 -mt-20 relative z-10">
        {/* Company header card */}
        <div className="bg-white/[0.03] border border-white/[0.1] rounded-2xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
            {company.logo ? <img src={company.logo} alt="" className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white/[0.08]" />
              : <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white text-4xl font-bold ring-4 ring-white/[0.08]">{company.companyName?.[0]}</div>}
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-white text-balance">{company.companyName}</h1>
              <div className="flex flex-wrap items-center gap-2.5 mt-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 bg-white/[0.06] px-3 py-1.5 rounded-full">
                  <HiOutlineLocationMarker className="w-4 h-4 text-indigo-400" /> {company.location}
                </span>
                {company.industry && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 bg-indigo-500/15 px-3 py-1.5 rounded-full">
                    <HiOutlineBriefcase className="w-4 h-4" /> {company.industry}
                  </span>
                )}
                {company.companySize && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 bg-white/[0.06] px-3 py-1.5 rounded-full">
                    <HiOutlineUsers className="w-4 h-4 text-rose-300" /> {company.companySize} employees
                  </span>
                )}
              </div>
            </div>
          </div>
          {company.website && (
            <a href={company.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 hover:text-indigo-200 transition-colors mb-5 group">
              <span className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                <HiOutlineGlobe className="w-4.5 h-4.5" />
              </span>
              {company.website}
            </a>
          )}
          <p className="text-white/60 leading-relaxed">{company.description}</p>
        </div>

        {/* Open positions */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Open <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">Positions</span>
          </h2>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full">
            <HiOutlineBriefcase className="w-4 h-4" /> {jobs.length} roles
          </span>
        </div>
        <div className="space-y-4">
          {jobs.map((job) => (
            <Link key={job._id} to={`/jobs/${job._id}`} className="group block bg-white/[0.03] border border-white/[0.1] rounded-2xl p-5 hover:bg-white/[0.05] hover:border-white/[0.2] transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform flex-shrink-0">
                  <HiOutlineBriefcase className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-white mb-1.5 group-hover:text-indigo-300 transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-white/60">
                    <span className="inline-flex items-center gap-1"><HiOutlineLocationMarker className="w-4 h-4 text-indigo-400" /> {job.location}</span>
                    <span className="inline-flex items-center gap-1"><HiOutlineCash className="w-4 h-4 text-indigo-400" /> {formatSalary(job.salary)}</span>
                    <span className="inline-flex items-center gap-1 capitalize text-indigo-300 font-medium">{job.jobType}</span>
                    <span className="inline-flex items-center gap-1"><HiOutlineClock className="w-4 h-4 text-white/50" /> {timeAgo(job.postedDate)}</span>
                  </div>
                </div>
                <HiOutlineArrowRight className="w-5 h-5 text-white/50 group-hover:text-indigo-300 group-hover:translate-x-1 transition-all flex-shrink-0 hidden sm:block" />
              </div>
            </Link>
          ))}
          {jobs.length === 0 && (
            <div className="text-center py-14 bg-white/[0.03] rounded-2xl border border-dashed border-white/[0.1]">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-300">
                <HiOutlineBriefcase className="w-8 h-8" />
              </div>
              <p className="text-white/60 font-medium">No open positions</p>
              <p className="text-sm text-white/50 mt-1">Check back soon for new opportunities.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
