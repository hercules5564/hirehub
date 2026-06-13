import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCompanyAPI, getJobsAPI } from '../services/api';
import { formatSalary, timeAgo } from '../utils/helpers';
import { HiOutlineLocationMarker, HiOutlineGlobe, HiOutlineUsers, HiOutlineBriefcase } from 'react-icons/hi';
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

  if (loading) return <div className="min-h-screen bg-dark-50 dark:bg-dark-900 pt-20 flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div></div>;
  if (!company) return <div className="min-h-screen bg-dark-50 dark:bg-dark-900 pt-20 flex items-center justify-center"><p className="text-dark-500">Company not found</p></div>;

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <div className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-100 dark:border-dark-700 mb-6">
          <div className="flex items-center gap-5 mb-6">
            {company.logo ? <img src={company.logo} alt="" className="w-20 h-20 rounded-2xl object-cover" />
              : <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-white text-3xl font-bold">{company.companyName?.[0]}</div>}
            <div>
              <h1 className="text-2xl font-bold text-dark-900 dark:text-white">{company.companyName}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-dark-500 mt-1">
                <span className="flex items-center gap-1"><HiOutlineLocationMarker className="w-4 h-4" /> {company.location}</span>
                {company.industry && <span>• {company.industry}</span>}
                {company.companySize && <span className="flex items-center gap-1"><HiOutlineUsers className="w-4 h-4" /> {company.companySize} employees</span>}
              </div>
            </div>
          </div>
          {company.website && <a href={company.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 mb-4"><HiOutlineGlobe className="w-4 h-4" /> {company.website}</a>}
          <p className="text-dark-600 dark:text-dark-300 leading-relaxed">{company.description}</p>
        </div>

        <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-4">Open Positions ({jobs.length})</h2>
        <div className="space-y-4">
          {jobs.map((job) => (
            <Link key={job._id} to={`/jobs/${job._id}`} className="block bg-white dark:bg-dark-800 rounded-2xl p-5 border border-gray-100 dark:border-dark-700 card-hover">
              <h3 className="font-semibold text-dark-900 dark:text-white mb-1">{job.title}</h3>
              <div className="flex flex-wrap gap-3 text-sm text-dark-500">
                <span>{job.location}</span><span>{formatSalary(job.salary)}</span><span className="capitalize">{job.jobType}</span><span>{timeAgo(job.postedDate)}</span>
              </div>
            </Link>
          ))}
          {jobs.length === 0 && <p className="text-center text-dark-500 py-8">No open positions</p>}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
