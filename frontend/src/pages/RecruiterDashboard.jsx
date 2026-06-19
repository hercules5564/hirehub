import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecruiterJobs, removeJob } from '../redux/slices/jobSlice';
import { fetchMyCompanies } from '../redux/slices/companySlice';
import { fetchJobApplicants } from '../redux/slices/applicationSlice';
import { timeAgo } from '../utils/helpers';
import { HiOutlineBriefcase, HiOutlineUsers, HiOutlineChartBar, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineEye, HiOutlineSparkles, HiOutlineExclamationCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';

const RecruiterDashboard = () => {
  const dispatch = useDispatch();
  const { recruiterJobs, loading } = useSelector((s) => s.jobs);
  const { myCompanies } = useSelector((s) => s.companies);
  const [showPostModal, setShowPostModal] = useState(false);

  useEffect(() => { dispatch(fetchRecruiterJobs()); dispatch(fetchMyCompanies()); }, [dispatch]);

  const totalApplicants = recruiterJobs.reduce((acc, j) => acc + (j.applicationsCount || 0), 0);
  const activeJobs = recruiterJobs.filter((j) => j.status === 'active').length;

  const handleDelete = async (id) => {
    if (!confirm('Delete this job?')) return;
    try { await dispatch(removeJob(id)).unwrap(); toast.success('Job deleted'); }
    catch (err) { toast.error(err || 'Failed'); }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full mb-3">
              <HiOutlineSparkles className="w-4 h-4" /> Recruiter Workspace
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white text-balance">
              Recruiter <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">Dashboard</span>
            </h1>
            <p className="text-white/60 mt-2">Manage your jobs and hiring pipeline</p>
          </div>
          <Link to="/recruiter/jobs/new" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]"><HiOutlinePlus className="w-5 h-5" /> Post New Job</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {[
            { icon: HiOutlineBriefcase, label: 'Active Jobs', value: activeJobs },
            { icon: HiOutlineUsers, label: 'Total Applicants', value: totalApplicants },
            { icon: HiOutlineChartBar, label: 'Total Jobs', value: recruiterJobs.length },
          ].map((s, i) => (
            <div key={i} className="group relative overflow-hidden bg-white/[0.03] p-6 rounded-2xl border border-white/[0.1] hover:bg-white/[0.05] hover:border-white/[0.2] transition-all duration-300">
              <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500/10 blur-2xl transition-all duration-500"></div>
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <p className="relative text-3xl font-bold text-white">{s.value}</p>
              <p className="relative text-sm text-white/60">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Setup prompt */}
        {myCompanies.length === 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <HiOutlineExclamationCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-300 mb-1">Setup Required</h3>
              <p className="text-sm text-amber-200/80">Create a company profile before posting jobs.</p>
            </div>
            <Link to="/recruiter/company" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]">Create Company</Link>
          </div>
        )}

        {/* Jobs Table */}
        <div className="bg-white/[0.03] rounded-2xl border border-white/[0.1] overflow-hidden">
          <div className="p-6 border-b border-white/[0.08] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)]">
              <HiOutlineBriefcase className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white">Your Jobs</h2>
          </div>
          {recruiterJobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/15 flex items-center justify-center">
                <HiOutlineBriefcase className="w-8 h-8 text-indigo-300" />
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
                  {recruiterJobs.map((job) => (
                    <tr key={job._id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-white text-sm">{job.title}</p>
                        <p className="text-xs text-white/50 mt-0.5">{job.companyId?.companyName} • {job.location}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-300 bg-indigo-500/15 px-2.5 py-1 rounded-full">
                          <HiOutlineUsers className="w-4 h-4" />{job.applicationsCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${job.status === 'active' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/[0.06] text-white/70'}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/50">{timeAgo(job.postedDate)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/recruiter/jobs/${job._id}/applicants`} className="p-2 rounded-lg hover:bg-white/[0.06] text-white/60 hover:text-indigo-300 transition-colors"><HiOutlineEye className="w-4 h-4" /></Link>
                          <Link to={`/recruiter/jobs/${job._id}/edit`} className="p-2 rounded-lg hover:bg-white/[0.06] text-white/60 hover:text-indigo-300 transition-colors"><HiOutlinePencil className="w-4 h-4" /></Link>
                          <button onClick={() => handleDelete(job._id)} className="p-2 rounded-lg hover:bg-rose-500/15 text-white/60 hover:text-rose-300 transition-colors"><HiOutlineTrash className="w-4 h-4" /></button>
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

export default RecruiterDashboard;
