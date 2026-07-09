import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyCompanies, createCompany, updateCompany, removeCompany } from '../redux/slices/companySlice';
import { HiOutlineArrowLeft, HiOutlineOfficeBuilding, HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineLocationMarker } from 'react-icons/hi';
import toast from 'react-hot-toast';

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-ink-300 dark:border-[#262c36] bg-white dark:bg-[#0d1117] text-ink-900 dark:text-ink-100 placeholder-ink-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm transition [&>option]:bg-white dark:[&>option]:bg-[#161b22] [&>option]:text-ink-900 dark:[&>option]:text-white';
const labelClass = 'block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5';

const emptyForm = {
  companyName: '',
  location: '',
  description: '',
  website: '',
  industry: '',
  companySize: '',
  founded: '',
  logo: '',
};

const SIZES = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

const ManageCompany = () => {
  const dispatch = useDispatch();
  const { myCompanies, loading } = useSelector((s) => s.companies);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchMyCompanies());
  }, [dispatch]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const startCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const startEdit = (company) => {
    setForm({
      companyName: company.companyName || '',
      location: company.location || '',
      description: company.description || '',
      website: company.website || '',
      industry: company.industry || '',
      companySize: company.companySize || '',
      founded: company.founded || '',
      logo: company.logo || '',
    });
    setEditingId(company._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this company? Jobs linked to it may be affected.')) return;
    try {
      await dispatch(removeCompany(id)).unwrap();
      toast.success('Company deleted');
    } catch (err) {
      toast.error(err || 'Failed to delete');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName.trim() || !form.location.trim() || !form.description.trim()) {
      toast.error('Company name, location and description are required');
      return;
    }

    const payload = {
      companyName: form.companyName.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      website: form.website.trim(),
      industry: form.industry.trim(),
      companySize: form.companySize,
      founded: form.founded ? Number(form.founded) : undefined,
      logo: form.logo.trim(),
    };

    setSubmitting(true);
    try {
      if (editingId) {
        await dispatch(updateCompany({ id: editingId, data: payload })).unwrap();
        toast.success('Company updated');
      } else {
        await dispatch(createCompany(payload)).unwrap();
        toast.success('Company created');
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      toast.error(err || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link to="/recruiter/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 dark:text-ink-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors group">
          <HiOutlineArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
              <HiOutlineOfficeBuilding className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-1">Recruiter</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white">Your Companies</h1>
              <p className="text-sm text-ink-500 dark:text-ink-400">Create and manage company profiles for your job listings</p>
            </div>
          </div>
          {!showForm && (
            <button onClick={startCreate} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-colors"><HiOutlinePlus className="w-5 h-5" /> New Company</button>
          )}
        </div>

        {/* Existing companies list */}
        {!showForm && (
          <div className="space-y-4">
            {loading && myCompanies.length === 0 ? (
              <div className="space-y-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-5 flex items-center gap-4">
                    <div className="bg-ink-100 dark:bg-white/[0.06] animate-pulse w-12 h-12 rounded-lg shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="bg-ink-100 dark:bg-white/[0.06] animate-pulse h-4 w-1/3 rounded"></div>
                      <div className="bg-ink-100 dark:bg-white/[0.06] animate-pulse h-3 w-1/2 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : myCompanies.length === 0 ? (
              <div className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl shadow-soft text-center py-16 px-6">
                <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-ink-100 dark:bg-white/[0.06] flex items-center justify-center text-ink-400">
                  <HiOutlineOfficeBuilding className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-ink-900 dark:text-white mb-1">No companies yet</h3>
                <p className="text-ink-500 dark:text-ink-400 mb-6">You haven't created a company yet</p>
                <button onClick={startCreate} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-colors mx-auto"><HiOutlinePlus className="w-5 h-5" /> Create your first company</button>
              </div>
            ) : (
              <div className="space-y-4">
              {myCompanies.map((c) => (
                <div key={c._id} className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-5 shadow-soft card-hover flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold shrink-0 overflow-hidden">
                      {c.logo ? <img src={c.logo} alt={c.companyName} className="w-full h-full object-cover" /> : (c.companyName?.[0]?.toUpperCase() || '?')}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-ink-900 dark:text-white truncate">{c.companyName}</p>
                      <p className="inline-flex items-center gap-1 text-xs text-ink-500 dark:text-ink-400 truncate"><HiOutlineLocationMarker className="w-3.5 h-3.5 shrink-0" />{c.location}{c.industry ? ` • ${c.industry}` : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => startEdit(c)} className="p-2.5 rounded-lg hover:bg-ink-100 dark:hover:bg-white/[0.06] text-ink-500 dark:text-ink-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"><HiOutlinePencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(c._id)} className="p-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-ink-500 dark:text-ink-400 hover:text-danger dark:hover:text-red-400 transition-colors"><HiOutlineTrash className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        )}

        {/* Create / edit form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl shadow-soft p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3 pb-2 border-b border-ink-200 dark:border-[#262c36]">
              <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                {editingId ? <HiOutlinePencil className="w-5 h-5" /> : <HiOutlinePlus className="w-5 h-5" />}
              </div>
              <h2 className="text-lg font-bold text-ink-900 dark:text-white">{editingId ? 'Edit Company' : 'New Company'}</h2>
            </div>

            <div>
              <label className={labelClass}>Company Name *</label>
              <input type="text" value={form.companyName} onChange={update('companyName')} maxLength={100} placeholder="e.g. Acme Technologies" className={inputClass} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Location *</label>
                <input type="text" value={form.location} onChange={update('location')} placeholder="e.g. Mumbai, India" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Industry</label>
                <input type="text" value={form.industry} onChange={update('industry')} placeholder="e.g. Software / IT" className={inputClass} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Company Size</label>
                <select value={form.companySize} onChange={update('companySize')} className={inputClass}>
                  <option value="">Select size</option>
                  {SIZES.map((s) => (
                    <option key={s} value={s}>{s} employees</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Founded Year</label>
                <input type="number" value={form.founded} onChange={update('founded')} placeholder="e.g. 2015" className={inputClass} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Website</label>
                <input type="url" value={form.website} onChange={update('website')} placeholder="https://example.com" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Logo URL</label>
                <input type="url" value={form.logo} onChange={update('logo')} placeholder="https://.../logo.png" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Description *</label>
              <textarea rows={5} value={form.description} onChange={update('description')} maxLength={2000} placeholder="Tell candidates about your company, culture, and mission..." className={`${inputClass} resize-none`} />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? 'Saving...' : editingId ? 'Update Company' : 'Create Company'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }} className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-semibold border border-ink-300 dark:border-[#262c36] text-ink-800 dark:text-ink-100 hover:bg-ink-50 dark:hover:bg-white/[0.04] transition-colors">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ManageCompany;
