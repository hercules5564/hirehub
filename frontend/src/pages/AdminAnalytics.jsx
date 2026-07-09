import { useEffect, useState } from 'react';
import { getAdminStatsAPI } from '../services/api';
import { HiOutlineChartBar, HiOutlineUsers, HiOutlineBriefcase, HiOutlineClipboardList, HiOutlineOfficeBuilding } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#2457e6', '#93b4fd', '#1d46cf', '#15803d', '#b45309'];

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
    <div className="min-h-screen bg-ink-50 dark:bg-[#11161f] text-ink-700 dark:text-ink-300 pt-24 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-ink-200 dark:border-[#262c36] border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin"></div>
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

  const tooltipStyle = { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, color: '#111827', fontSize: 12 };

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-[#11161f] text-ink-700 dark:text-ink-300 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-600/10 px-3 py-1 rounded-md mb-3">
            <HiOutlineChartBar className="w-4 h-4" /> Admin Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white">
            Platform Analytics
          </h1>
          <p className="text-ink-500 dark:text-ink-400 mt-2">Growth and distribution</p>
        </div>

        {/* Stat cards */}
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

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Users by role */}
          <div className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-6">
            <h2 className="text-lg font-bold text-ink-900 dark:text-white mb-4">Users by role</h2>
            {roleData.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-ink-100 dark:bg-white/[0.06] flex items-center justify-center text-ink-400">
                  <HiOutlineUsers className="w-7 h-7" />
                </div>
                <p className="text-sm text-ink-500 dark:text-ink-400">No user data to show yet.</p>
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
                  <Legend wrapperStyle={{ color: '#6b7280', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Platform totals */}
          <div className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-6">
            <h2 className="text-lg font-bold text-ink-900 dark:text-white mb-4">Platform totals</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={totalsData}>
                <CartesianGrid stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} stroke="#e5e7eb" />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} stroke="#e5e7eb" allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(36,87,230,0.06)' }} />
                <Bar dataKey="value" fill="#2457e6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Jobs status */}
          <div className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-6 lg:col-span-2">
            <h2 className="text-lg font-bold text-ink-900 dark:text-white mb-4">Jobs status</h2>
            {jobsStatusData.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-ink-100 dark:bg-white/[0.06] flex items-center justify-center text-ink-400">
                  <HiOutlineBriefcase className="w-7 h-7" />
                </div>
                <p className="text-sm text-ink-500 dark:text-ink-400">No job data to show yet.</p>
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
                  <Legend wrapperStyle={{ color: '#6b7280', fontSize: 12 }} />
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
