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
    <div className="min-h-screen bg-[#030303] text-white pt-20 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-white/10 border-t-indigo-400 rounded-full animate-spin"></div>
    </div>
  );

  const statCards = [
    { icon: HiOutlineUsers, label: 'Total Users', value: stats?.totalUsers || 0 },
    { icon: HiOutlineBriefcase, label: 'Total Jobs', value: stats?.totalJobs || 0 },
    { icon: HiOutlineClipboardList, label: 'Applications', value: stats?.totalApplications || 0 },
    { icon: HiOutlineOfficeBuilding, label: 'Companies', value: stats?.totalCompanies || 0 },
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-20">
      {/* ===== Header band ===== */}
      <div className="relative overflow-hidden border-b border-white/[0.08]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-16 right-10 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 border border-white/[0.1] px-3 py-1 rounded-full mb-4">
            <HiOutlineShieldCheck className="w-4 h-4" /> Admin Console
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-balance text-white">
            Admin <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">Dashboard</span>
          </h1>
          <p className="text-white/60 max-w-xl text-balance">Platform overview and management at a glance.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <div key={i} className="group bg-white/[0.03] border border-white/[0.1] p-5 rounded-2xl hover:bg-white/[0.05] hover:border-white/[0.2] transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center mb-3 shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="text-sm text-white/60">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white/[0.03] border border-white/[0.1] rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 p-5 border-b border-white/[0.08]">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] flex-shrink-0">
                <HiOutlineUsers className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-white">Recent Users</h2>
            </div>
            <div className="divide-y divide-white/[0.08]">
              {users.length === 0 && (
                <div className="px-5 py-12 text-center">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-300">
                    <HiOutlineUserCircle className="w-7 h-7" />
                  </div>
                  <p className="text-sm text-white/60">No users to show yet.</p>
                </div>
              )}
              {users.map((u) => (
                <div key={u._id} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.05] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white text-sm font-semibold uppercase shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] flex-shrink-0">
                      {u.name?.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{u.name}</p>
                      <p className="text-xs text-white/50 truncate">{u.email} • <span className="capitalize">{u.role}</span></p>
                    </div>
                  </div>
                  <button onClick={() => toggleUser(u._id, u.isActive)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303] ${u.isActive ? 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25' : 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Jobs */}
          <div className="bg-white/[0.03] border border-white/[0.1] rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 p-5 border-b border-white/[0.08]">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] flex-shrink-0">
                <HiOutlineBriefcase className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-white">Recent Jobs</h2>
            </div>
            <div className="divide-y divide-white/[0.08]">
              {recentJobs.length === 0 && (
                <div className="px-5 py-12 text-center">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-300">
                    <HiOutlineBriefcase className="w-7 h-7" />
                  </div>
                  <p className="text-sm text-white/60">No jobs to show yet.</p>
                </div>
              )}
              {recentJobs.map((j) => (
                <div key={j._id} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.05] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-300 flex-shrink-0">
                      <HiOutlineOfficeBuilding className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{j.title}</p>
                      <p className="text-xs text-white/50 truncate">{j.companyId?.companyName} • {j.location}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 capitalize ${j.status === 'active' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/[0.06] text-white/70'}`}>
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
