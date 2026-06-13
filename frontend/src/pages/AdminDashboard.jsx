import { useEffect, useState } from 'react';
import { getAdminStatsAPI, getAdminUsersAPI, updateAdminUserAPI, moderateJobAPI } from '../services/api';
import { HiOutlineUsers, HiOutlineBriefcase, HiOutlineOfficeBuilding, HiOutlineClipboardList, HiOutlineCheck, HiOutlineX, HiOutlineShieldCheck } from 'react-icons/hi';
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
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900 pt-20 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>
  );

  const statCards = [
    { icon: HiOutlineUsers, label: 'Total Users', value: stats?.totalUsers || 0, color: 'from-blue-500 to-indigo-600' },
    { icon: HiOutlineBriefcase, label: 'Total Jobs', value: stats?.totalJobs || 0, color: 'from-purple-500 to-pink-600' },
    { icon: HiOutlineClipboardList, label: 'Applications', value: stats?.totalApplications || 0, color: 'from-emerald-500 to-teal-600' },
    { icon: HiOutlineOfficeBuilding, label: 'Companies', value: stats?.totalCompanies || 0, color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-2 animate-fade-in">Admin Dashboard</h1>
        <p className="text-dark-500 mb-8">Platform overview and management</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
          {statCards.map((s, i) => (
            <div key={i} className="bg-white dark:bg-dark-800 p-5 rounded-2xl border border-gray-100 dark:border-dark-700 card-hover">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-dark-900 dark:text-white">{s.value}</p>
              <p className="text-sm text-dark-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-dark-700">
              <h2 className="font-bold text-dark-900 dark:text-white">Recent Users</h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-dark-700">
              {users.map((u) => (
                <div key={u._id} className="flex items-center justify-between px-5 py-3 hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-dark-900 dark:text-white">{u.name}</p>
                    <p className="text-xs text-dark-500">{u.email} • <span className="capitalize">{u.role}</span></p>
                  </div>
                  <button onClick={() => toggleUser(u._id, u.isActive)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${u.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Jobs */}
          <div className="bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-dark-700">
              <h2 className="font-bold text-dark-900 dark:text-white">Recent Jobs</h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-dark-700">
              {recentJobs.map((j) => (
                <div key={j._id} className="flex items-center justify-between px-5 py-3 hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-dark-900 dark:text-white">{j.title}</p>
                    <p className="text-xs text-dark-500">{j.companyId?.companyName} • {j.location}</p>
                  </div>
                  <span className={`badge text-xs ${j.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600'}`}>
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
