import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecruiterJobsAPI, deleteJobAPI } from '../services/api';
import { timeAgo } from '../utils/helpers';
import {
  HiOutlineBriefcase,
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineEye,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const statusPill = (status) => {
  const base = 'px-2.5 py-1 rounded-md text-xs font-semibold capitalize';
  switch (status) {
    case 'active':
      return `${base} bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400`;
    case 'pending':
      return `${base} bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400`;
    case 'closed':
    case 'rejected':
      return `${base} bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400`;
    default:
      return `${base} bg-ink-100 text-ink-600 dark:bg-white/[0.06] dark:text-ink-300`;
  }
};

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await getRecruiterJobsAPI();
      setJobs(res?.data?.jobs || []);
    } catch {
      toast.error('Failed to load your jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job? This action cannot be undone.')) return;
    try {
      await deleteJobAPI(id);
      await load();
      toast.success('Job deleted');
    } catch {
      toast.error('Failed to delete job');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-50 dark:bg-[#11161f] text-ink-700 dark:text-ink-300 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-ink-200 dark:border-[#262c36] border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j?.status === 'active').length;
  const totalApplicants = jobs.reduce((acc, j) => acc + (j?.applicationsCount || 0), 0);

  const statCards = [
    { icon: HiOutlineChartBar, label: 'Total Jobs', value: totalJobs },
    { icon: HiOutlineCheckCircle, label: 'Active Jobs', value: activeJobs },
    { icon: HiOutlineUsers, label: 'Total Applicants', value: totalApplicants },
  ];

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-[#11161f] text-ink-700 dark:text-ink-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-2">Recruiter workspace</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-ink-900 dark:text-white">
              My Jobs
            </h1>
            <p className="text-ink-500 dark:text-ink-400 mt-2">Manage all your job postings</p>
          </div>
          <Link
            to="/recruiter/jobs/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-colors"
          >
            <HiOutlinePlus className="w-5 h-5" /> Post New Job
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {statCards.map((s, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-6 shadow-soft"
            >
              <div className="w-11 h-11 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center mb-4">
                <s.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <p className="text-3xl font-bold text-ink-900 dark:text-white">{s.value}</p>
              <p className="text-sm text-ink-500 dark:text-ink-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Jobs Table */}
        <div className="bg-white dark:bg-[#161b22] rounded-xl border border-ink-200 dark:border-[#262c36] shadow-soft overflow-hidden">
          <div className="p-6 border-b border-ink-200 dark:border-[#262c36] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0">
              <HiOutlineBriefcase className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-ink-900 dark:text-white">Your Jobs</h2>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-ink-100 dark:bg-white/[0.06] flex items-center justify-center text-ink-400">
                <HiOutlineBriefcase className="w-7 h-7" />
              </div>
              <p className="text-ink-900 dark:text-white font-semibold">No jobs posted yet</p>
              <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">Post your first role to start building your pipeline.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-ink-50 dark:bg-white/[0.02]">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider">Job</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider">Applicants</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider">Posted</th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-200 dark:divide-[#262c36]">
                  {jobs.map((job) => (
                    <tr key={job?._id} className="hover:bg-ink-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-ink-900 dark:text-white text-sm">{job?.title}</p>
                        <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
                          {job?.companyId?.companyName} • {job?.location}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-600/15 px-2.5 py-1 rounded-md">
                          <HiOutlineUsers className="w-4 h-4" />
                          {job?.applicationsCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={statusPill(job?.status)}>{job?.status || 'unknown'}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-ink-500 dark:text-ink-400">{timeAgo(job?.postedDate)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/recruiter/jobs/${job?._id}/applicants`}
                            title="View applicants"
                            className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-white/[0.06] text-ink-500 dark:text-ink-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          >
                            <HiOutlineEye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/recruiter/jobs/${job?._id}/edit`}
                            title="Edit job"
                            className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-white/[0.06] text-ink-500 dark:text-ink-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          >
                            <HiOutlinePencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(job?._id)}
                            title="Delete job"
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-ink-500 dark:text-ink-400 hover:text-danger dark:hover:text-red-400 transition-colors"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyJobs;
