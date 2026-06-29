import { useEffect, useState } from 'react';
import { getAdminUsersAPI, updateAdminUserAPI, deleteAdminUserAPI } from '../services/api';
import { HiOutlineShieldCheck, HiOutlineUsers, HiOutlineSearch, HiOutlineUserCircle, HiOutlineTrash, HiOutlineBadgeCheck, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import toast from 'react-hot-toast';

const LIMIT = 15;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [role, setRole] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getAdminUsersAPI({ role, search, page, limit: LIMIT });
        setUsers(res.data?.users || []);
        setPagination(res.data?.pagination || { page: 1, pages: 1, total: 0 });
      } catch {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [role, search, page]);

  const refetch = async () => {
    try {
      const res = await getAdminUsersAPI({ role, search, page, limit: LIMIT });
      setUsers(res.data?.users || []);
      setPagination(res.data?.pagination || { page: 1, pages: 1, total: 0 });
    } catch {
      toast.error('Failed to refresh users');
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateAdminUserAPI(id, { role: newRole });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role: newRole } : u)));
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    }
  };

  const toggleVerified = async (id, current) => {
    try {
      await updateAdminUserAPI(id, { isVerified: !current });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isVerified: !current } : u)));
      toast.success(!current ? 'User verified' : 'Verification removed');
    } catch {
      toast.error('Failed to update verification');
    }
  };

  const toggleActive = async (id, current) => {
    try {
      await updateAdminUserAPI(id, { isActive: !current });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isActive: !current } : u)));
      toast.success(!current ? 'User activated' : 'User deactivated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? This action cannot be undone.')) return;
    try {
      await deleteAdminUserAPI(id);
      toast.success('User deleted');
      await refetch();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const onRoleFilter = (e) => {
    setRole(e.target.value);
    setPage(1);
  };

  const onSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] text-white pt-24 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/10 border-t-indigo-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full mb-3">
            <HiOutlineShieldCheck className="w-4 h-4" /> Admin Console
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Manage <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">Users</span>
          </h1>
          <p className="text-white/60 mt-2">All registered accounts</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <select
            value={role}
            onChange={onRoleFilter}
            className="px-4 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.06] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none text-sm [&>option]:bg-[#0a0a0a] [&>option]:text-white"
          >
            <option value="">All Roles</option>
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
            <option value="admin">Admin</option>
          </select>
          <div className="relative flex-1 max-w-md">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={onSearch}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.06] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/[0.03] rounded-2xl border border-white/[0.1] overflow-hidden">
          {users.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-300">
                <HiOutlineUserCircle className="w-7 h-7" />
              </div>
              <p className="text-sm text-white/60">No users match your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/[0.04]">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">Verified</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-white/50 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.08]">
                  {users.map((u) => (
                    <tr key={u?._id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white text-sm font-semibold uppercase shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] flex-shrink-0">
                            {u?.name?.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{u?.name}</p>
                            <p className="text-xs text-white/50 truncate">{u?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={u?.role || 'candidate'}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-white/[0.1] bg-white/[0.06] text-white focus:ring-2 focus:ring-indigo-400/60 outline-none text-sm capitalize [&>option]:bg-[#0a0a0a] [&>option]:text-white"
                        >
                          <option value="candidate">Candidate</option>
                          <option value="recruiter">Recruiter</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleVerified(u._id, u?.isVerified)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize transition-colors ${u?.isVerified ? 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25' : 'bg-white/[0.06] text-white/70 hover:bg-white/[0.1]'}`}
                        >
                          <HiOutlineBadgeCheck className="w-3.5 h-3.5" />
                          {u?.isVerified ? 'Verified' : 'Unverified'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleActive(u._id, u?.isActive)}
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize transition-colors ${u?.isActive ? 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25' : 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25'}`}
                        >
                          {u?.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/50">
                        {u?.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleDelete(u._id)}
                            className="p-2 rounded-lg hover:bg-rose-500/15 text-white/60 hover:text-rose-300 transition-colors"
                            title="Delete user"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {users.length > 0 && (
          <div className="flex items-center justify-between mt-6 gap-4">
            <p className="text-sm text-white/50">
              {pagination?.total || 0} total {(pagination?.total || 0) === 1 ? 'user' : 'users'}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-white/[0.06] text-white/80 hover:bg-white/[0.1] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <HiOutlineChevronLeft className="w-4 h-4" /> Prev
              </button>
              <span className="text-sm text-white/60">
                Page {pagination?.page || page} of {pagination?.pages || 1}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination?.pages || 1, p + 1))}
                disabled={page >= (pagination?.pages || 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-white/[0.06] text-white/80 hover:bg-white/[0.1] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next <HiOutlineChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
