import { useEffect, useState } from 'react';
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

const COLORS = ['#6366f1', '#f43f5e', '#f59e0b', '#10b981', '#8b5cf6'];

const truncate = (str, n = 14) => {
  const s = str || 'Untitled';
  return s.length > n ? `${s.slice(0, n)}…` : s;
};

const RecruiterAnalytics = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen bg-[#030303] text-white pt-24 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/10 border-t-indigo-400 rounded-full animate-spin"></div>
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
    <div className="min-h-screen bg-[#030303] text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full mb-3">
            <HiOutlineChartBar className="w-4 h-4" /> Insights
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Recruiter{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
              Analytics
            </span>
          </h1>
          <p className="text-white/60 mt-2">Your hiring performance at a glance</p>
        </div>

        {totalJobs === 0 ? (
          <div className="bg-white/[0.03] border border-white/[0.1] rounded-2xl p-12 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 text-indigo-300 flex items-center justify-center mb-4">
              <HiOutlineChartBar className="w-7 h-7" />
            </div>
            <p className="text-white font-semibold">No analytics yet</p>
            <p className="text-sm text-white/60 mt-1">Post your first job to start tracking applicant trends.</p>
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((s, i) => (
                <div
                  key={i}
                  className="bg-white/[0.03] border border-white/[0.1] p-5 rounded-2xl hover:bg-white/[0.05] hover:border-white/[0.2] transition-all duration-300"
                >
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
              {/* Applicants per job */}
              <div className="bg-white/[0.03] border border-white/[0.1] rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Applicants per job</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid stroke="#ffffff14" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#ffffff66', fontSize: 12 }}
                      stroke="#ffffff22"
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: '#ffffff66', fontSize: 12 }}
                      stroke="#ffffff22"
                    />
                    <Tooltip
                      cursor={{ fill: '#ffffff0a' }}
                      contentStyle={{
                        background: '#0a0a0a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 12,
                        color: '#fff',
                      }}
                    />
                    <Bar dataKey="applicants" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Jobs by status */}
              <div className="bg-white/[0.03] border border-white/[0.1] rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Jobs by status</h2>
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
                    <Tooltip
                      contentStyle={{
                        background: '#0a0a0a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 12,
                        color: '#fff',
                      }}
                    />
                    <Legend wrapperStyle={{ color: '#ffffff99', fontSize: 12 }} />
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
