import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyCompanies, createCompany, updateCompany, removeCompany } from '../redux/slices/companySlice';
import { HiOutlineArrowLeft, HiOutlineOfficeBuilding, HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineSparkles, HiOutlineLocationMarker } from 'react-icons/hi';
import toast from 'react-hot-toast';

const inputClass =
  'w-full px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none text-sm [&>option]:bg-[#0a0a0a] [&>option]:text-white';
const labelClass = 'block text-sm font-medium text-white/70 mb-1';

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
    <div className="relative min-h-screen bg-[#030303] text-white pt-24 overflow-hidden">
      {/* Decorative aurora background */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
      <div className="pointer-events-none absolute top-1/3 -right-24 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/recruiter/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-indigo-300 mb-6 transition-colors group">
          <HiOutlineArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] shrink-0">
              <HiOutlineOfficeBuilding className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full mb-2">
                <HiOutlineSparkles className="w-3.5 h-3.5" /> Recruiter
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">Companies</span></h1>
              <p className="text-sm text-white/60">Create and manage company profiles for your job listings</p>
            </div>
          </div>
          {!showForm && (
            <button onClick={startCreate} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]"><HiOutlinePlus className="w-5 h-5" /> New Company</button>
          )}
        </div>

        {/* Existing companies list */}
        {!showForm && (
          <div className="space-y-4">
            {loading && myCompanies.length === 0 ? (
              <div className="space-y-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/[0.1] rounded-2xl p-5 flex items-center gap-4">
                    <div className="bg-white/[0.06] animate-pulse w-12 h-12 rounded-xl shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="bg-white/[0.06] animate-pulse h-4 w-1/3 rounded"></div>
                      <div className="bg-white/[0.06] animate-pulse h-3 w-1/2 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : myCompanies.length === 0 ? (
              <div className="relative bg-white/[0.03] border border-white/[0.1] rounded-2xl text-center py-16 px-6 overflow-hidden">
                <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
                <div className="relative w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center">
                  <HiOutlineOfficeBuilding className="w-8 h-8 text-white" />
                </div>
                <h3 className="relative text-lg font-semibold text-white mb-1">No companies yet</h3>
                <p className="relative text-white/60 mb-6">You haven't created a company yet</p>
                <button onClick={startCreate} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300 mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]"><HiOutlinePlus className="w-5 h-5" /> Create your first company</button>
              </div>
            ) : (
              <div className="space-y-4">
              {myCompanies.map((c) => (
                <div key={c._id} className="group bg-white/[0.03] border border-white/[0.1] rounded-2xl p-5 hover:bg-white/[0.05] hover:border-white/[0.2] transition-all duration-300 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white font-semibold shrink-0 overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
                      {c.logo ? <img src={c.logo} alt={c.companyName} className="w-full h-full object-cover" /> : (c.companyName?.[0]?.toUpperCase() || '?')}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{c.companyName}</p>
                      <p className="inline-flex items-center gap-1 text-xs text-white/50 truncate"><HiOutlineLocationMarker className="w-3.5 h-3.5 shrink-0" />{c.location}{c.industry ? ` • ${c.industry}` : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => startEdit(c)} className="p-2.5 rounded-xl hover:bg-white/[0.06] text-white/60 hover:text-indigo-300 transition-colors"><HiOutlinePencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(c._id)} className="p-2.5 rounded-xl hover:bg-rose-500/15 text-white/60 hover:text-rose-300 transition-colors"><HiOutlineTrash className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        )}

        {/* Create / edit form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/[0.1] rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3 pb-2 border-b border-white/[0.08]">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-lg shrink-0">
                {editingId ? <HiOutlinePencil className="w-5 h-5" /> : <HiOutlinePlus className="w-5 h-5" />}
              </div>
              <h2 className="text-lg font-bold text-white">{editingId ? 'Edit Company' : 'New Company'}</h2>
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
              <button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]">
                {submitting ? 'Saving...' : editingId ? 'Update Company' : 'Create Company'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }} className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium border border-white/[0.12] text-white/80 hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ManageCompany;
