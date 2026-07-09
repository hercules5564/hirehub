import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminJobsAPI, moderateJobAPI, deleteAdminJobAPI } from '../services/api';
import { HiOutlineBriefcase, HiOutlineEye, HiOutlineTrash, HiOutlineSearch, HiOutlineOfficeBuilding } from 'react-icons/hi';
import toast from 'react-hot-toast';

const LIMIT = 15;
const STATUS_OPTIONS = ['active', 'closed', 'draft', 'moderated'];

const statusPillClass = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400';
    case 'moderated':
      return 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400';
    case 'draft':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400';
    case 'closed':
    default:
      return 'bg-ink-100 text-ink-600 dark:bg-white/[0.06] dark:text-ink-300';
  }
};

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAdminJobsAPI({ status, search, page, limit: LIMIT });
      setJobs(res.data?.jobs || []);
      setPagination(res.data?.pagination || { page: 1, pages: 1, total: 0 });
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [status, search, page]);

  const handleModerate = async (id, newStatus) => {
    const prev = jobs;
    setJobs((list) => list.map((j) => (j._id === id ? { ...j, status: newStatus } : j)));
    try {
      await moderateJobAPI(id, { status: newStatus });
      toast.success('Job status updated');
    } catch {
      setJobs(prev);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job permanently?')) return;
    try {
      await deleteAdminJobAPI(id);
      toast.success('Job deleted');
      load();
    } catch {
      toast.error('Failed to delete job');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-50 dark:bg-[#11161f] text-ink-700 dark:text-ink-300 pt-24 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-ink-200 dark:border-[#262c36] border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-[#11161f] text-ink-700 dark:text-ink-300 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-600/10 px-3 py-1 rounded-md mb-3">
            <HiOutlineBriefcase className="w-4 h-4" /> Admin Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white">
            Moderate Jobs
          </h1>
          <p className="text-ink-500 dark:text-ink-400 mt-2">Every job on the platform</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <select
            value={status}
            onChange={(e) => { setPage(1); setStatus(e.target.value); }}
            className="px-4 py-2.5 rounded-lg border border-ink-300 dark:border-[#262c36] bg-white dark:bg-[#0d1117] text-ink-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm transition [&>option]:bg-white dark:[&>option]:bg-[#161b22] [&>option]:text-ink-900 dark:[&>option]:text-white"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <div className="relative flex-1">
            <HiOutlineSearch className="w-4 h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
              placeholder="Search by title..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-ink-300 dark:border-[#262c36] bg-white dark:bg-[#0d1117] text-ink-900 dark:text-white placeholder-ink-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm transition"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#161b22] rounded-xl border border-ink-200 dark:border-[#262c36] overflow-hidden">
          {jobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-ink-100 dark:bg-white/[0.06] flex items-center justify-center text-ink-400">
                <HiOutlineBriefcase className="w-7 h-7" />
              </div>
              <p className="text-sm text-ink-500 dark:text-ink-400">No jobs match your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-ink-50 dark:bg-white/[0.03]">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider">Job</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider">Applicants</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-200 dark:divide-[#262c36]">
                  {jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-ink-50 dark:hover:bg-white/[0.03] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase flex-shrink-0">
                            {job.companyId?.companyName?.charAt(0) || <HiOutlineOfficeBuilding className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-ink-900 dark:text-white text-sm truncate">{job.title}</p>
                            <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5 truncate">{job.companyId?.companyName || 'Unknown'} • {job.location || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-ink-600 dark:text-ink-300 capitalize">{job.jobType || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-primary-50 dark:bg-primary-600/10 text-primary-700 dark:text-primary-300">
                          {job.applicationsCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={job.status || 'active'}
                          onChange={(e) => handleModerate(job._id, e.target.value)}
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize border-0 outline-none focus:ring-2 focus:ring-primary-500/40 cursor-pointer [&>option]:bg-white dark:[&>option]:bg-[#161b22] [&>option]:text-ink-900 dark:[&>option]:text-white ${statusPillClass(job.status)}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/jobs/${job._id}`}
                            className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-white/[0.06] text-ink-500 dark:text-ink-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            title="View job"
                          >
                            <HiOutlineEye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(job._id)}
                            className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-white/[0.06] text-ink-500 dark:text-ink-400 hover:text-danger transition-colors"
                            title="Delete job"
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

        {/* Pagination */}
        {jobs.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-ink-500 dark:text-ink-400">
              Page {pagination?.page || page} of {pagination?.pages || 1}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={(pagination?.page || page) <= 1}
                className="px-4 py-2 rounded-lg text-sm font-semibold border border-ink-300 dark:border-[#262c36] text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-white/[0.04] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={(pagination?.page || page) >= (pagination?.pages || 1)}
                className="px-4 py-2 rounded-lg text-sm font-semibold border border-ink-300 dark:border-[#262c36] text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-white/[0.04] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminJobs;
