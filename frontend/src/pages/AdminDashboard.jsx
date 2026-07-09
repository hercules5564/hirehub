import { useEffect, useState } from 'react';
import { getAdminStatsAPI, getAdminUsersAPI, updateAdminUserAPI, moderateJobAPI } from '../services/api';
import { HiOutlineUsers, HiOutlineBriefcase, HiOutlineOfficeBuilding, HiOutlineClipboardList, HiOutlineCheck, HiOutlineX, HiOutlineShieldCheck, HiOutlineSparkles, HiOutlineUserCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAdminStatsAPI();
        setStats(res.data.stats);
        setUsers(res.data.recentUsers || []);
        setRecentJobs(res.data.recentJobs || []);
      } catch (err) { toast.error('Failed to load stats'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const toggleUser = async (id, isActive) => {
    try {
      await updateAdminUserAPI(id, { isActive: !isActive });
      setUsers(users.map((u) => u._id === id ? { ...u, isActive: !isActive } : u));
      toast.success('User updated');
    } catch { toast.error('Failed'); }
  };

  if (loading) return (
    <div className="min-h-screen bg-ink-50 dark:bg-[#11161f] text-ink-700 dark:text-ink-300 pt-20 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-ink-200 dark:border-[#262c36] border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin"></div>
    </div>
  );

  const statCards = [
    { icon: HiOutlineUsers, label: 'Total Users', value: stats?.totalUsers || 0 },
    { icon: HiOutlineBriefcase, label: 'Total Jobs', value: stats?.totalJobs || 0 },
    { icon: HiOutlineClipboardList, label: 'Applications', value: stats?.totalApplications || 0 },
    { icon: HiOutlineOfficeBuilding, label: 'Companies', value: stats?.totalCompanies || 0 },
  ];

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-[#11161f] text-ink-700 dark:text-ink-300 pt-20">
      {/* ===== Header band ===== */}
      <div className="border-b border-ink-200 dark:border-[#262c36] bg-white dark:bg-[#161b22]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-600/10 px-3 py-1 rounded-md mb-4">
            <HiOutlineShieldCheck className="w-4 h-4" /> Admin Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-balance text-ink-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-ink-500 dark:text-ink-400 max-w-xl text-balance">Platform overview and management at a glance.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <div key={i} className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] p-5 rounded-xl">
              <div className="w-11 h-11 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center mb-3">
                <s.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <p className="text-3xl font-bold text-ink-900 dark:text-white">{s.value}</p>
              <p className="text-sm text-ink-500 dark:text-ink-400">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 p-5 border-b border-ink-200 dark:border-[#262c36]">
              <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0">
                <HiOutlineUsers className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-ink-900 dark:text-white">Recent Users</h2>
            </div>
            <div className="divide-y divide-ink-200 dark:divide-[#262c36]">
              {users.length === 0 && (
                <div className="px-5 py-12 text-center">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-ink-100 dark:bg-white/[0.06] flex items-center justify-center text-ink-400">
                    <HiOutlineUserCircle className="w-7 h-7" />
                  </div>
                  <p className="text-sm text-ink-500 dark:text-ink-400">No users to show yet.</p>
                </div>
              )}
              {users.map((u) => (
                <div key={u._id} className="flex items-center justify-between px-5 py-3 hover:bg-ink-50 dark:hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase flex-shrink-0">
                      {u.name?.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink-900 dark:text-white truncate">{u.name}</p>
                      <p className="text-xs text-ink-500 dark:text-ink-400 truncate">{u.email} • <span className="capitalize">{u.role}</span></p>
                    </div>
                  </div>
                  <button onClick={() => toggleUser(u._id, u.isActive)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#161b22] ${u.isActive ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20' : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Jobs */}
          <div className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 p-5 border-b border-ink-200 dark:border-[#262c36]">
              <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0">
                <HiOutlineBriefcase className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-ink-900 dark:text-white">Recent Jobs</h2>
            </div>
            <div className="divide-y divide-ink-200 dark:divide-[#262c36]">
              {recentJobs.length === 0 && (
                <div className="px-5 py-12 text-center">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-ink-100 dark:bg-white/[0.06] flex items-center justify-center text-ink-400">
                    <HiOutlineBriefcase className="w-7 h-7" />
                  </div>
                  <p className="text-sm text-ink-500 dark:text-ink-400">No jobs to show yet.</p>
                </div>
              )}
              {recentJobs.map((j) => (
                <div key={j._id} className="flex items-center justify-between px-5 py-3 hover:bg-ink-50 dark:hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-ink-100 dark:bg-white/[0.06] flex items-center justify-center text-ink-500 dark:text-ink-400 flex-shrink-0">
                      <HiOutlineOfficeBuilding className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink-900 dark:text-white truncate">{j.title}</p>
                      <p className="text-xs text-ink-500 dark:text-ink-400 truncate">{j.companyId?.companyName} • {j.location}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-md text-xs font-semibold flex-shrink-0 capitalize ${j.status === 'active' ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-ink-100 text-ink-600 dark:bg-white/[0.06] dark:text-ink-300'}`}>
                    {j.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
