import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getRecruiterJobsAPI } from '../services/api';
import {
  HiOutlineChartBar,
  HiOutlineBriefcase,
  HiOutlineCheckCircle,
  HiOutlineUsers,
  HiOutlineTrendingUp,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = ['#2457e6', '#93b4fd', '#1d46cf', '#15803d', '#64748b'];

const truncate = (str, n = 14) => {
  const s = str || 'Untitled';
  return s.length > n ? `${s.slice(0, n)}…` : s;
};

const RecruiterAnalytics = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { mode } = useSelector((s) => s.theme);
  const isDark = mode === 'dark';

  const axisColor = isDark ? '#8b949e' : '#64748b';
  const gridColor = isDark ? '#262c36' : '#e2e8f0';
  const tooltipStyle = {
    background: isDark ? '#161b22' : '#ffffff',
    border: `1px solid ${isDark ? '#262c36' : '#e2e8f0'}`,
    borderRadius: 8,
    color: isDark ? '#e6edf3' : '#0f172a',
    boxShadow: '0 4px 16px rgba(15,23,42,0.08)',
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getRecruiterJobsAPI();
        setJobs(res?.data?.jobs || []);
      } catch {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-ink-50 dark:bg-[#11161f] text-ink-700 dark:text-ink-300 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-ink-200 dark:border-[#262c36] border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin"></div>
      </div>
    );

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j?.status === 'active').length;
  const totalApplicants = jobs.reduce((acc, j) => acc + (j?.applicationsCount || 0), 0);
  const avgApplicants = totalJobs ? Math.round(totalApplicants / totalJobs) : 0;

  const statCards = [
    { icon: HiOutlineBriefcase, label: 'Total Jobs', value: totalJobs },
    { icon: HiOutlineCheckCircle, label: 'Active Jobs', value: activeJobs },
    { icon: HiOutlineUsers, label: 'Total Applicants', value: totalApplicants },
    { icon: HiOutlineTrendingUp, label: 'Avg Applicants / Job', value: avgApplicants },
  ];

  const barData = [...jobs]
    .sort((a, b) => (b?.applicationsCount || 0) - (a?.applicationsCount || 0))
    .slice(0, 8)
    .map((j) => ({
      name: truncate(j?.title),
      applicants: j?.applicationsCount || 0,
    }));

  const statusCounts = jobs.reduce((acc, j) => {
    const key = j?.status || 'unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(statusCounts)
    .map(([name, value]) => ({ name, value }))
    .filter((d) => d.value > 0);

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-[#11161f] text-ink-700 dark:text-ink-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-2">Insights</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink-900 dark:text-white">
            Recruiter Analytics
          </h1>
          <p className="text-ink-500 dark:text-ink-400 mt-2">Your hiring performance at a glance</p>
        </div>

        {totalJobs === 0 ? (
          <div className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl shadow-soft p-12 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-xl bg-ink-100 dark:bg-white/[0.06] text-ink-400 flex items-center justify-center mb-4">
              <HiOutlineChartBar className="w-7 h-7" />
            </div>
            <p className="text-ink-900 dark:text-white font-semibold">No analytics yet</p>
            <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">Post your first job to start tracking applicant trends.</p>
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((s, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-6 shadow-soft"
                >
                  <div className="w-11 h-11 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center mb-4">
                    <s.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <p className="text-3xl font-bold text-ink-900 dark:text-white">{s.value}</p>
                  <p className="text-sm text-ink-500 dark:text-ink-400">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Applicants per job */}
              <div className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl shadow-soft p-6">
                <h2 className="text-lg font-bold text-ink-900 dark:text-white mb-4">Applicants per job</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid stroke={gridColor} vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: axisColor, fontSize: 12 }}
                      stroke={gridColor}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: axisColor, fontSize: 12 }}
                      stroke={gridColor}
                    />
                    <Tooltip
                      cursor={{ fill: isDark ? '#ffffff0a' : '#0f172a08' }}
                      contentStyle={tooltipStyle}
                    />
                    <Bar dataKey="applicants" fill="#2457e6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Jobs by status */}
              <div className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl shadow-soft p-6">
                <h2 className="text-lg font-bold text-ink-900 dark:text-white mb-4">Jobs by status</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ color: axisColor, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecruiterAnalytics;
