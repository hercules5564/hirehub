import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminCompaniesAPI, deleteAdminCompanyAPI } from '../services/api';
import {
  HiOutlineOfficeBuilding,
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlineSearch,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const LIMIT = 12;

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getAdminCompaniesAPI({ search, page, limit: LIMIT });
        setCompanies(res?.data?.companies || []);
        setPagination(res?.data?.pagination || { page: 1, pages: 1, total: 0 });
      } catch (err) {
        toast.error('Failed to load companies');
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [search, page]);

  const refetch = async () => {
    try {
      const res = await getAdminCompaniesAPI({ search, page, limit: LIMIT });
      setCompanies(res?.data?.companies || []);
      setPagination(res?.data?.pagination || { page: 1, pages: 1, total: 0 });
    } catch {
      toast.error('Failed to load companies');
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm('Delete this company? This action cannot be undone.')) return;
    try {
      await deleteAdminCompanyAPI(id);
      toast.success('Company deleted');
      await refetch();
    } catch {
      toast.error('Failed to delete company');
    }
  };

  const handleSearch = (e) => {
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
            <HiOutlineOfficeBuilding className="w-4 h-4" /> Admin Console
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Manage{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
              Companies
            </span>
          </h1>
          <p className="text-white/60 mt-2">Registered employers</p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <HiOutlineSearch className="w-5 h-5 text-white/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search companies..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.06] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none text-sm"
          />
        </div>

        {/* Grid / Empty */}
        {companies.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-300">
              <HiOutlineOfficeBuilding className="w-7 h-7" />
            </div>
            <p className="text-white/60">No companies found.</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {companies.map((company) => (
                <div
                  key={company?._id}
                  className="bg-white/[0.03] border border-white/[0.1] rounded-2xl p-5 hover:border-white/[0.2] transition-all duration-300 flex flex-col"
                >
                  {/* Top row */}
                  <div className="flex items-center gap-3 mb-4">
                    {company?.logo ? (
                      <img
                        src={company.logo}
                        alt={company?.companyName || 'Company'}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-white/[0.1]"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white text-lg font-semibold uppercase shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] flex-shrink-0">
                        {company?.companyName?.charAt(0) || '?'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">
                        {company?.companyName || 'Unnamed Company'}
                      </p>
                      {company?.industry && (
                        <p className="text-xs text-white/50 truncate">{company.industry}</p>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 text-sm text-white/70 min-w-0">
                      <HiOutlineLocationMarker className="w-4 h-4 text-white/40 flex-shrink-0" />
                      <span className="truncate">{company?.location || 'No location'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/70 min-w-0">
                      <HiOutlineMail className="w-4 h-4 text-white/40 flex-shrink-0" />
                      <span className="truncate">
                        {company?.recruiterId?.email || 'No owner'}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/[0.08]">
                    <Link
                      to={`/company/${company?._id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-300 hover:text-indigo-200 transition-colors"
                    >
                      <HiOutlineEye className="w-4 h-4" /> View
                    </Link>
                    <button
                      onClick={() => handleDelete(company?._id)}
                      className="p-2 rounded-lg hover:bg-rose-500/15 text-white/60 hover:text-rose-300 transition-colors"
                      aria-label="Delete company"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {(pagination?.pages || 1) > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={(pagination?.page || page) <= 1}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-white/[0.06] text-white/70 hover:bg-white/[0.1] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <HiOutlineChevronLeft className="w-4 h-4" /> Prev
                </button>
                <span className="text-sm text-white/60">
                  Page {pagination?.page || page} of {pagination?.pages || 1}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={(pagination?.page || page) >= (pagination?.pages || 1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-white/[0.06] text-white/70 hover:bg-white/[0.1] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next <HiOutlineChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCompanies;
