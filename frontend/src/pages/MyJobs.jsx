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
  const base = 'px-2.5 py-1 rounded-full text-xs font-semibold capitalize';
  switch (status) {
    case 'active':
      return `${base} bg-emerald-500/15 text-emerald-300`;
    case 'pending':
      return `${base} bg-amber-500/15 text-amber-300`;
    case 'closed':
    case 'rejected':
      return `${base} bg-rose-500/15 text-rose-300`;
    default:
      return `${base} bg-white/[0.06] text-white/70`;
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
      <div className="min-h-screen bg-[#030303] text-white pt-24 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/10 border-t-indigo-400 rounded-full animate-spin"></div>
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
    <div className="min-h-screen bg-[#030303] text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full mb-3">
              <HiOutlineBriefcase className="w-4 h-4" /> Recruiter Workspace
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              My <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">Jobs</span>
            </h1>
            <p className="text-white/60 mt-2">Manage all your job postings</p>
          </div>
          <Link
            to="/recruiter/jobs/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300"
          >
            <HiOutlinePlus className="w-5 h-5" /> Post New Job
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {statCards.map((s, i) => (
            <div
              key={i}
              className="bg-white/[0.03] border border-white/[0.1] p-5 rounded-2xl hover:bg-white/[0.05] hover:border-white/[0.2] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center mb-3 shadow-[0_8px_24px_0_rgba(99,102,241,0.35)]">
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="text-sm text-white/60">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Jobs Table */}
        <div className="bg-white/[0.03] rounded-2xl border border-white/[0.1] overflow-hidden">
          <div className="p-6 border-b border-white/[0.08] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] flex-shrink-0">
              <HiOutlineBriefcase className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white">Your Jobs</h2>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-300">
                <HiOutlineBriefcase className="w-7 h-7" />
              </div>
              <p className="text-white font-semibold">No jobs posted yet</p>
              <p className="text-sm text-white/60 mt-1">Post your first role to start building your pipeline.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/[0.04]">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">Job</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">Applicants</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">Posted</th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-white/50 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.08]">
                  {jobs.map((job) => (
                    <tr key={job?._id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-white text-sm">{job?.title}</p>
                        <p className="text-xs text-white/50 mt-0.5">
                          {job?.companyId?.companyName} • {job?.location}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-300 bg-indigo-500/15 px-2.5 py-1 rounded-full">
                          <HiOutlineUsers className="w-4 h-4" />
                          {job?.applicationsCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={statusPill(job?.status)}>{job?.status || 'unknown'}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/50">{timeAgo(job?.postedDate)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/recruiter/jobs/${job?._id}/applicants`}
                            title="View applicants"
                            className="p-2 rounded-lg hover:bg-white/[0.06] text-white/60 hover:text-indigo-300 transition-colors"
                          >
                            <HiOutlineEye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/recruiter/jobs/${job?._id}/edit`}
                            title="Edit job"
                            className="p-2 rounded-lg hover:bg-white/[0.06] text-white/60 hover:text-indigo-300 transition-colors"
                          >
                            <HiOutlinePencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(job?._id)}
                            title="Delete job"
                            className="p-2 rounded-lg hover:bg-rose-500/15 text-white/60 hover:text-rose-300 transition-colors"
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
