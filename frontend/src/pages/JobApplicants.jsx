import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobApplicants, updateApplicationStatus } from '../redux/slices/applicationSlice';
import { timeAgo } from '../utils/helpers';
import { HiOutlineArrowLeft, HiOutlineUsers, HiOutlineMail, HiOutlinePhone, HiOutlineDocumentText, HiOutlineLocationMarker, HiOutlineSparkles, HiOutlineClock, HiOutlineAdjustments } from 'react-icons/hi';
import toast from 'react-hot-toast';

const STATUSES = ['applied', 'reviewing', 'shortlisted', 'interview', 'offered', 'rejected'];

const statusStyle = {
  applied: 'bg-indigo-500/15 text-indigo-300',
  reviewing: 'bg-amber-500/15 text-amber-300',
  shortlisted: 'bg-violet-500/15 text-violet-300',
  interview: 'bg-sky-500/15 text-sky-300',
  offered: 'bg-emerald-500/15 text-emerald-300',
  rejected: 'bg-rose-500/15 text-rose-300',
  withdrawn: 'bg-white/[0.06] text-white/70',
};

const JobApplicants = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { applicants, loading } = useSelector((s) => s.applications);
  const [sortByMatch, setSortByMatch] = useState(false);

  useEffect(() => {
    dispatch(fetchJobApplicants({ jobId: id, sort: sortByMatch ? 'match' : undefined }));
  }, [dispatch, id, sortByMatch]);

  const matchColor = (score) =>
    score >= 75 ? 'bg-emerald-500/15 text-emerald-300'
      : score >= 50 ? 'bg-amber-500/15 text-amber-300'
        : 'bg-rose-500/15 text-rose-300';

  const handleStatus = async (appId, status) => {
    try {
      await dispatch(updateApplicationStatus({ id: appId, data: { status } })).unwrap();
      toast.success('Status updated');
    } catch (err) {
      toast.error(err || 'Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-24">
      {/* Decorative gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 left-0 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-0 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/recruiter/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-indigo-300 mb-6 transition-colors">
          <HiOutlineArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full mb-4">
            <HiOutlineSparkles className="w-4 h-4" /> Talent Pipeline
          </span>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] shrink-0">
                <HiOutlineUsers className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">Applicants</span></h1>
                <p className="text-sm text-white/60 mt-1">{applicants.length} {applicants.length === 1 ? 'candidate' : 'candidates'} applied</p>
              </div>
            </div>
            {applicants.length > 0 && (
              <button onClick={() => setSortByMatch((v) => !v)}
                className={`inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303] ${sortByMatch ? 'bg-gradient-to-r from-indigo-500 to-rose-500 text-white border-transparent shadow-[0_8px_24px_0_rgba(99,102,241,0.35)]' : 'bg-white/[0.06] text-white/80 border-white/[0.12] hover:bg-white/[0.1]'}`}>
                <HiOutlineSparkles className="w-4 h-4" /> {sortByMatch ? 'Ranked by AI match' : 'Rank by AI match'}
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.1] rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white/[0.06] animate-pulse w-12 h-12 rounded-full shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="bg-white/[0.06] animate-pulse h-4 w-40 rounded"></div>
                    <div className="bg-white/[0.06] animate-pulse h-3 w-64 rounded"></div>
                    <div className="bg-white/[0.06] animate-pulse h-3 w-28 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : applicants.length === 0 ? (
          <div className="bg-white/[0.03] border border-white/[0.1] rounded-2xl text-center py-16 px-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center">
              <HiOutlineUsers className="w-8 h-8 text-white" />
            </div>
            <p className="text-lg font-semibold text-white mb-1">No applications yet</p>
            <p className="text-sm text-white/60">Candidates who apply to this job will show up here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applicants.map((app) => {
              const c = app.candidateId || {};
              return (
                <div key={app._id} className="group bg-white/[0.03] border border-white/[0.1] rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/[0.2] transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white font-semibold shrink-0 overflow-hidden shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] group-hover:scale-110 transition-transform">
                        {c.profileImage ? <img src={c.profileImage} alt={c.name} className="w-full h-full object-cover" /> : (c.name?.[0]?.toUpperCase() || '?')}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{c.name || 'Unknown candidate'}</p>
                        {c.location && <p className="inline-flex items-center gap-1 text-xs text-white/50 mt-0.5"><HiOutlineLocationMarker className="w-3.5 h-3.5" /> {c.location}</p>}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-white/60">
                          {c.email && <span className="inline-flex items-center gap-1"><HiOutlineMail className="w-3.5 h-3.5 text-indigo-400" /> {c.email}</span>}
                          {c.phone && <span className="inline-flex items-center gap-1"><HiOutlinePhone className="w-3.5 h-3.5 text-indigo-400" /> {c.phone}</span>}
                        </div>
                        {Array.isArray(c.skills) && c.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {c.skills.slice(0, 8).map((s, i) => (
                              <span key={i} className="px-2.5 py-1 rounded-full text-xs bg-indigo-500/15 text-indigo-300">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                      {typeof app.matchScore === 'number' && (
                        <span title={app.matchInfo?.reasoning || ''}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${matchColor(app.matchScore)}`}>
                          <HiOutlineSparkles className="w-3.5 h-3.5" /> {app.matchScore}% match
                        </span>
                      )}
                      <span className={`px-2.5 py-1 rounded-full text-xs capitalize ${statusStyle[app.status] || statusStyle.applied}`}>{app.status}</span>
                      <span className="inline-flex items-center gap-1 text-xs text-white/50"><HiOutlineClock className="w-3.5 h-3.5" /> Applied {timeAgo(app.createdAt)}</span>
                      {(c.resumeUrl || app.resumeUrl) && (
                        <a href={c.resumeUrl || app.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-300 hover:text-indigo-200 hover:gap-2 transition-all">
                          <HiOutlineDocumentText className="w-3.5 h-3.5" /> View Resume
                        </a>
                      )}
                    </div>
                  </div>

                  {app.coverLetter && (
                    <p className="mt-4 text-sm text-white/60 bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 whitespace-pre-line">{app.coverLetter}</p>
                  )}

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.08]">
                    <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70">
                      <HiOutlineAdjustments className="w-4 h-4 text-indigo-400" /> Update status:
                    </label>
                    <select
                      value={STATUSES.includes(app.status) ? app.status : 'applied'}
                      onChange={(e) => handleStatus(app._id, e.target.value)}
                      disabled={app.status === 'withdrawn'}
                      className="px-3 py-1.5 rounded-xl border border-white/[0.1] bg-white/[0.06] text-white text-xs focus:ring-2 focus:ring-indigo-400/60 outline-none capitalize disabled:opacity-60 transition-shadow [&>option]:bg-[#0a0a0a] [&>option]:text-white"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} className="capitalize">{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicants;
