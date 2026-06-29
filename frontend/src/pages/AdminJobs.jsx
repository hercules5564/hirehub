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
      return 'bg-emerald-500/15 text-emerald-300';
    case 'moderated':
      return 'bg-rose-500/15 text-rose-300';
    case 'draft':
      return 'bg-amber-500/15 text-amber-300';
    case 'closed':
    default:
      return 'bg-white/[0.06] text-white/70';
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
      <div className="min-h-screen bg-[#030303] text-white pt-24 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/10 border-t-indigo-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full mb-3">
            <HiOutlineBriefcase className="w-4 h-4" /> Admin Console
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Moderate <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">Jobs</span>
          </h1>
          <p className="text-white/60 mt-2">Every job on the platform</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <select
            value={status}
            onChange={(e) => { setPage(1); setStatus(e.target.value); }}
            className="px-4 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.06] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none text-sm [&>option]:bg-[#0a0a0a] [&>option]:text-white"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <div className="relative flex-1">
            <HiOutlineSearch className="w-4 h-4 text-white/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
              placeholder="Search by title..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.06] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/[0.03] rounded-2xl border border-white/[0.1] overflow-hidden">
          {jobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-300">
                <HiOutlineBriefcase className="w-7 h-7" />
              </div>
              <p className="text-sm text-white/60">No jobs match your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/[0.04]">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">Job</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">Applicants</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-white/50 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.08]">
                  {jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white text-sm font-semibold uppercase shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] flex-shrink-0">
                            {job.companyId?.companyName?.charAt(0) || <HiOutlineOfficeBuilding className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-white text-sm truncate">{job.title}</p>
                            <p className="text-xs text-white/50 mt-0.5 truncate">{job.companyId?.companyName || 'Unknown'} • {job.location || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-white/70 capitalize">{job.jobType || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300">
                          {job.applicationsCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={job.status || 'active'}
                          onChange={(e) => handleModerate(job._id, e.target.value)}
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize border-0 outline-none focus:ring-2 focus:ring-indigo-400/60 cursor-pointer [&>option]:bg-[#0a0a0a] [&>option]:text-white ${statusPillClass(job.status)}`}
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
                            className="p-2 rounded-lg hover:bg-white/[0.06] text-white/60 hover:text-indigo-300 transition-colors"
                            title="View job"
                          >
                            <HiOutlineEye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(job._id)}
                            className="p-2 rounded-lg hover:bg-rose-500/15 text-white/60 hover:text-rose-300 transition-colors"
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
            <p className="text-sm text-white/50">
              Page {pagination?.page || page} of {pagination?.pages || 1}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={(pagination?.page || page) <= 1}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-white/[0.1] bg-white/[0.06] text-white/80 hover:bg-white/[0.1] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={(pagination?.page || page) >= (pagination?.pages || 1)}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-white/[0.1] bg-white/[0.06] text-white/80 hover:bg-white/[0.1] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
