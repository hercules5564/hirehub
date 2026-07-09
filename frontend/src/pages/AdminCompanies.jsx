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
      <div className="min-h-screen bg-ink-50 dark:bg-[#11161f] text-ink-700 dark:text-ink-300 pt-24 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-ink-200 dark:border-[#262c36] border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-[#11161f] text-ink-700 dark:text-ink-300 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-600/10 px-3 py-1 rounded-md mb-3">
            <HiOutlineOfficeBuilding className="w-4 h-4" /> Admin Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white">
            Manage Companies
          </h1>
          <p className="text-ink-500 dark:text-ink-400 mt-2">Registered employers</p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <HiOutlineSearch className="w-5 h-5 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search companies..."
            className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-ink-300 dark:border-[#262c36] bg-white dark:bg-[#0d1117] text-ink-900 dark:text-white placeholder-ink-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm transition"
          />
        </div>

        {/* Grid / Empty */}
        {companies.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-ink-100 dark:bg-white/[0.06] flex items-center justify-center text-ink-400">
              <HiOutlineOfficeBuilding className="w-7 h-7" />
            </div>
            <p className="text-ink-500 dark:text-ink-400">No companies found.</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {companies.map((company) => (
                <div
                  key={company?._id}
                  className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-5 hover:border-primary-300 dark:hover:border-primary-600/40 transition-colors flex flex-col"
                >
                  {/* Top row */}
                  <div className="flex items-center gap-3 mb-4">
                    {company?.logo ? (
                      <img
                        src={company.logo}
                        alt={company?.companyName || 'Company'}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-ink-200 dark:border-[#262c36]"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 text-lg font-semibold uppercase flex-shrink-0">
                        {company?.companyName?.charAt(0) || '?'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-ink-900 dark:text-white truncate">
                        {company?.companyName || 'Unnamed Company'}
                      </p>
                      {company?.industry && (
                        <p className="text-xs text-ink-500 dark:text-ink-400 truncate">{company.industry}</p>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300 min-w-0">
                      <HiOutlineLocationMarker className="w-4 h-4 text-ink-400 flex-shrink-0" />
                      <span className="truncate">{company?.location || 'No location'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300 min-w-0">
                      <HiOutlineMail className="w-4 h-4 text-ink-400 flex-shrink-0" />
                      <span className="truncate">
                        {company?.recruiterId?.email || 'No owner'}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-ink-200 dark:border-[#262c36]">
                    <Link
                      to={`/company/${company?._id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                    >
                      <HiOutlineEye className="w-4 h-4" /> View
                    </Link>
                    <button
                      onClick={() => handleDelete(company?._id)}
                      className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-white/[0.06] text-ink-500 dark:text-ink-400 hover:text-danger transition-colors"
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border border-ink-300 dark:border-[#262c36] text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-white/[0.04] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <HiOutlineChevronLeft className="w-4 h-4" /> Prev
                </button>
                <span className="text-sm text-ink-500 dark:text-ink-400">
                  Page {pagination?.page || page} of {pagination?.pages || 1}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={(pagination?.page || page) >= (pagination?.pages || 1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border border-ink-300 dark:border-[#262c36] text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-white/[0.04] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
