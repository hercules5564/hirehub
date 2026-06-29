import { useEffect, useState } from 'react';
import { getAdminStatsAPI } from '../services/api';
import { HiOutlineChartBar, HiOutlineUsers, HiOutlineBriefcase, HiOutlineClipboardList, HiOutlineOfficeBuilding } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#6366f1', '#f43f5e', '#f59e0b', '#10b981', '#8b5cf6'];

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAdminStatsAPI();
        setStats(res.data.stats);
      } catch (err) {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#030303] text-white pt-24 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-white/10 border-t-indigo-400 rounded-full animate-spin"></div>
    </div>
  );

  const totalUsers = stats?.totalUsers || 0;
  const candidates = stats?.candidates || 0;
  const recruiters = stats?.recruiters || 0;
  const totalJobs = stats?.totalJobs || 0;
  const activeJobs = stats?.activeJobs || 0;
  const totalApplications = stats?.totalApplications || 0;
  const totalCompanies = stats?.totalCompanies || 0;

  const admins = Math.max(0, totalUsers - candidates - recruiters);
  const inactiveJobs = Math.max(0, totalJobs - activeJobs);

  const statCards = [
    { icon: HiOutlineUsers, label: 'Total Users', value: totalUsers },
    { icon: HiOutlineBriefcase, label: 'Total Jobs', value: totalJobs },
    { icon: HiOutlineClipboardList, label: 'Applications', value: totalApplications },
    { icon: HiOutlineOfficeBuilding, label: 'Companies', value: totalCompanies },
  ];

  const roleData = [
    { name: 'Candidates', value: candidates },
    { name: 'Recruiters', value: recruiters },
    { name: 'Admins', value: admins },
  ].filter((d) => d.value > 0);

  const totalsData = [
    { name: 'Users', value: totalUsers },
    { name: 'Jobs', value: totalJobs },
    { name: 'Applications', value: totalApplications },
    { name: 'Companies', value: totalCompanies },
  ];

  const jobsStatusData = [
    { name: 'Active', value: activeJobs },
    { name: 'Other', value: inactiveJobs },
  ].filter((d) => d.value > 0);

  const tooltipStyle = { background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' };

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full mb-3">
            <HiOutlineChartBar className="w-4 h-4" /> Admin Console
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Platform <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">Analytics</span>
          </h1>
          <p className="text-white/60 mt-2">Growth and distribution</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/[0.1] p-5 rounded-2xl hover:bg-white/[0.05] hover:border-white/[0.2] transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center mb-3 shadow-[0_8px_24px_0_rgba(99,102,241,0.35)]">
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="text-sm text-white/60">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Users by role */}
          <div className="bg-white/[0.03] border border-white/[0.1] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Users by role</h2>
            {roleData.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-300">
                  <HiOutlineUsers className="w-7 h-7" />
                </div>
                <p className="text-sm text-white/60">No user data to show yet.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {roleData.map((entry, i) => (
                      <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ color: '#ffffffaa', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Platform totals */}
          <div className="bg-white/[0.03] border border-white/[0.1] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Platform totals</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={totalsData}>
                <CartesianGrid stroke="#ffffff14" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#ffffff66', fontSize: 12 }} stroke="#ffffff22" />
                <YAxis tick={{ fill: '#ffffff66', fontSize: 12 }} stroke="#ffffff22" allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#ffffff0a' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Jobs status */}
          <div className="bg-white/[0.03] border border-white/[0.1] rounded-2xl p-6 lg:col-span-2">
            <h2 className="text-lg font-bold text-white mb-4">Jobs status</h2>
            {jobsStatusData.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-300">
                  <HiOutlineBriefcase className="w-7 h-7" />
                </div>
                <p className="text-sm text-white/60">No job data to show yet.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={jobsStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {jobsStatusData.map((entry, i) => (
                      <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ color: '#ffffffaa', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
