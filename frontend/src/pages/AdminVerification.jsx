import { useEffect, useState } from 'react';
import { getAdminUsersAPI, updateAdminUserAPI } from '../services/api';
import {
  HiOutlineShieldCheck,
  HiOutlineShieldExclamation,
  HiOutlineCheckCircle,
  HiOutlineCheck,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminVerification = () => {
  const [pending, setPending] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [verifyingId, setVerifyingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAdminUsersAPI({ limit: 100 });
        const users = res?.data?.users || [];
        setPending(users.filter((u) => u?.isVerified !== true));
      } catch {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const verifyUser = async (id) => {
    setVerifyingId(id);
    try {
      await updateAdminUserAPI(id, { isVerified: true });
      setPending((prev) => prev.filter((u) => u._id !== id));
      toast.success('User verified');
    } catch {
      toast.error('Failed to verify user');
    } finally {
      setVerifyingId(null);
    }
  };

  const rolePill = (role) => {
    if (role === 'recruiter') return 'bg-indigo-500/15 text-indigo-300';
    if (role === 'candidate') return 'bg-emerald-500/15 text-emerald-300';
    return 'bg-white/[0.06] text-white/70';
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#030303] text-white pt-24 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/10 border-t-indigo-400 rounded-full animate-spin"></div>
      </div>
    );

  const filtered =
    roleFilter === 'all'
      ? pending
      : pending.filter((u) => u?.role === roleFilter);

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full mb-3">
          <HiOutlineShieldCheck className="w-4 h-4" /> Admin Console
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Pending{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
            Verification
          </span>
        </h1>
        <p className="text-white/60 mt-2">Approve new accounts</p>

        {/* Stat + filter */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="bg-white/[0.03] border border-white/[0.1] p-5 rounded-2xl hover:bg-white/[0.05] hover:border-white/[0.2] transition-all duration-300 w-full sm:w-64">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center mb-3 shadow-[0_8px_24px_0_rgba(99,102,241,0.35)]">
              <HiOutlineShieldExclamation className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-white">{pending.length}</p>
            <p className="text-sm text-white/60">Pending</p>
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.06] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none text-sm [&>option]:bg-[#0a0a0a] [&>option]:text-white"
          >
            <option value="all">All roles</option>
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </div>

        {/* Table / empty state */}
        {filtered.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 text-indigo-300 flex items-center justify-center mb-4">
              <HiOutlineCheckCircle className="w-7 h-7" />
            </div>
            <p className="text-white/60">All caught up — no pending verifications.</p>
          </div>
        ) : (
          <div className="mt-8 bg-white/[0.03] rounded-2xl border border-white/[0.1] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-white/[0.04]">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.08]">
                  {filtered.map((u) => (
                    <tr key={u._id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white text-sm font-semibold uppercase shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] flex-shrink-0">
                            {u.name?.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{u.name}</p>
                            <p className="text-xs text-white/50 truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${rolePill(
                            u.role
                          )}`}
                        >
                          {u.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/70">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => verifyUser(u._id)}
                          disabled={verifyingId === u._id}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                        >
                          <HiOutlineCheck className="w-4 h-4" />
                          {verifyingId === u._id ? 'Verifying…' : 'Verify'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVerification;
