import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecruiterJobs, removeJob } from '../redux/slices/jobSlice';
import { fetchMyCompanies } from '../redux/slices/companySlice';
import { fetchJobApplicants } from '../redux/slices/applicationSlice';
import { timeAgo } from '../utils/helpers';
import { HiOutlineBriefcase, HiOutlineUsers, HiOutlineChartBar, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';
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
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-dark-900 dark:text-white">Recruiter Dashboard</h1>
            <p className="text-dark-500 mt-1">Manage your jobs and hiring pipeline</p>
          </div>
          <Link to="/recruiter/jobs/new" className="btn-primary"><HiOutlinePlus className="w-5 h-5" /> Post New Job</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 stagger-children">
          {[
            { icon: HiOutlineBriefcase, label: 'Active Jobs', value: activeJobs, color: 'from-blue-500 to-indigo-600' },
            { icon: HiOutlineUsers, label: 'Total Applicants', value: totalApplicants, color: 'from-purple-500 to-pink-600' },
            { icon: HiOutlineChartBar, label: 'Total Jobs', value: recruiterJobs.length, color: 'from-emerald-500 to-teal-600' },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-100 dark:border-dark-700 card-hover">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-dark-900 dark:text-white">{s.value}</p>
              <p className="text-sm text-dark-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Setup prompt */}
        {myCompanies.length === 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 mb-6 animate-fade-in">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-2">Setup Required</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">Create a company profile before posting jobs.</p>
            <Link to="/recruiter/company" className="btn-primary text-sm">Create Company</Link>
          </div>
        )}

        {/* Jobs Table */}
        <div className="bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700 overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-gray-100 dark:border-dark-700">
            <h2 className="text-lg font-bold text-dark-900 dark:text-white">Your Jobs</h2>
          </div>
          {recruiterJobs.length === 0 ? (
            <div className="text-center py-12">
              <HiOutlineBriefcase className="w-12 h-12 mx-auto text-dark-300 mb-3" />
              <p className="text-dark-500">No jobs posted yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-50 dark:bg-dark-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-dark-500 uppercase">Job</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-dark-500 uppercase">Applicants</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-dark-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-dark-500 uppercase">Posted</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-dark-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-700">
                  {recruiterJobs.map((job) => (
                    <tr key={job._id} className="hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-dark-900 dark:text-white text-sm">{job.title}</p>
                        <p className="text-xs text-dark-500">{job.companyId?.companyName} • {job.location}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-dark-900 dark:text-white">{job.applicationsCount || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge text-xs ${job.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-dark-600 dark:text-dark-400'}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-dark-500">{timeAgo(job.postedDate)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/recruiter/jobs/${job._id}/applicants`} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 text-dark-500 hover:text-primary-600"><HiOutlineEye className="w-4 h-4" /></Link>
                          <Link to={`/recruiter/jobs/${job._id}/edit`} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 text-dark-500 hover:text-primary-600"><HiOutlinePencil className="w-4 h-4" /></Link>
                          <button onClick={() => handleDelete(job._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-dark-500 hover:text-red-600"><HiOutlineTrash className="w-4 h-4" /></button>
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
