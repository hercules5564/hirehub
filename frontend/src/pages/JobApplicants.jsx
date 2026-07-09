import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobApplicants, updateApplicationStatus } from '../redux/slices/applicationSlice';
import { timeAgo } from '../utils/helpers';
import { HiOutlineArrowLeft, HiOutlineUsers, HiOutlineMail, HiOutlinePhone, HiOutlineDocumentText, HiOutlineLocationMarker, HiOutlineClock, HiOutlineAdjustments, HiOutlineTrendingUp } from 'react-icons/hi';
import toast from 'react-hot-toast';

const STATUSES = ['applied', 'reviewing', 'shortlisted', 'interview', 'offered', 'rejected'];

const statusStyle = {
  applied: 'bg-ink-100 text-ink-600 dark:bg-white/[0.06] dark:text-ink-300',
  reviewing: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  shortlisted: 'bg-primary-50 text-primary-700 dark:bg-primary-600/15 dark:text-primary-300',
  interview: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400',
  offered: 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400',
  rejected: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  withdrawn: 'bg-ink-100 text-ink-600 dark:bg-white/[0.06] dark:text-ink-300',
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
    score >= 75 ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
      : score >= 50 ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
        : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400';

  const handleStatus = async (appId, status) => {
    try {
      await dispatch(updateApplicationStatus({ id: appId, data: { status } })).unwrap();
      toast.success('Status updated');
    } catch (err) {
      toast.error(err || 'Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link to="/recruiter/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 dark:text-ink-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <HiOutlineArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="mb-8">
          <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-3">Talent pipeline</p>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                <HiOutlineUsers className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-ink-900 dark:text-white">Your Applicants</h1>
                <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">{applicants.length} {applicants.length === 1 ? 'candidate' : 'candidates'} applied</p>
              </div>
            </div>
            {applicants.length > 0 && (
              <button onClick={() => setSortByMatch((v) => !v)}
                className={`inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg border transition-colors ${sortByMatch ? 'bg-primary-600 hover:bg-primary-700 text-white border-transparent' : 'border-ink-300 dark:border-[#262c36] text-ink-800 dark:text-ink-100 hover:bg-ink-50 dark:hover:bg-white/[0.04]'}`}>
                <HiOutlineTrendingUp className="w-4 h-4" /> {sortByMatch ? 'Ranked by AI match' : 'Rank by AI match'}
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-6 shadow-soft">
                <div className="flex items-start gap-4">
                  <div className="bg-ink-100 dark:bg-white/[0.06] animate-pulse w-12 h-12 rounded-full shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="bg-ink-100 dark:bg-white/[0.06] animate-pulse h-4 w-40 rounded"></div>
                    <div className="bg-ink-100 dark:bg-white/[0.06] animate-pulse h-3 w-64 rounded"></div>
                    <div className="bg-ink-100 dark:bg-white/[0.06] animate-pulse h-3 w-28 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : applicants.length === 0 ? (
          <div className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl shadow-soft text-center py-16 px-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-ink-100 dark:bg-white/[0.06] flex items-center justify-center text-ink-400">
              <HiOutlineUsers className="w-8 h-8" />
            </div>
            <p className="text-lg font-semibold text-ink-900 dark:text-white mb-1">No applications yet</p>
            <p className="text-sm text-ink-500 dark:text-ink-400">Candidates who apply to this job will show up here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applicants.map((app) => {
              const c = app.candidateId || {};
              return (
                <div key={app._id} className="bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-6 shadow-soft card-hover">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold shrink-0 overflow-hidden">
                        {c.profileImage ? <img src={c.profileImage} alt={c.name} className="w-full h-full object-cover" /> : (c.name?.[0]?.toUpperCase() || '?')}
                      </div>
                      <div>
                        <p className="font-semibold text-ink-900 dark:text-white">{c.name || 'Unknown candidate'}</p>
                        {c.location && <p className="inline-flex items-center gap-1 text-xs text-ink-500 dark:text-ink-400 mt-0.5"><HiOutlineLocationMarker className="w-3.5 h-3.5" /> {c.location}</p>}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-ink-600 dark:text-ink-400">
                          {c.email && <span className="inline-flex items-center gap-1"><HiOutlineMail className="w-3.5 h-3.5 text-ink-400" /> {c.email}</span>}
                          {c.phone && <span className="inline-flex items-center gap-1"><HiOutlinePhone className="w-3.5 h-3.5 text-ink-400" /> {c.phone}</span>}
                        </div>
                        {Array.isArray(c.skills) && c.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {c.skills.slice(0, 8).map((s, i) => (
                              <span key={i} className="px-2.5 py-1 rounded-md text-xs font-medium bg-ink-100 dark:bg-white/[0.06] text-ink-600 dark:text-ink-300">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                      {typeof app.matchScore === 'number' && (
                        <span title={app.matchInfo?.reasoning || ''}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${matchColor(app.matchScore)}`}>
                          {app.matchScore}% match
                        </span>
                      )}
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize ${statusStyle[app.status] || statusStyle.applied}`}>{app.status}</span>
                      <span className="inline-flex items-center gap-1 text-xs text-ink-500 dark:text-ink-400"><HiOutlineClock className="w-3.5 h-3.5" /> Applied {timeAgo(app.createdAt)}</span>
                      {(c.resumeUrl || app.resumeUrl) && (
                        <a href={c.resumeUrl || app.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                          <HiOutlineDocumentText className="w-3.5 h-3.5" /> View Resume
                        </a>
                      )}
                    </div>
                  </div>

                  {app.coverLetter && (
                    <p className="mt-4 text-sm text-ink-600 dark:text-ink-400 bg-ink-50 dark:bg-white/[0.02] border border-ink-200 dark:border-[#262c36] rounded-lg p-4 whitespace-pre-line">{app.coverLetter}</p>
                  )}

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-ink-200 dark:border-[#262c36]">
                    <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-700 dark:text-ink-300">
                      <HiOutlineAdjustments className="w-4 h-4 text-ink-400" /> Update status:
                    </label>
                    <select
                      value={STATUSES.includes(app.status) ? app.status : 'applied'}
                      onChange={(e) => handleStatus(app._id, e.target.value)}
                      disabled={app.status === 'withdrawn'}
                      className="px-3 py-1.5 rounded-lg border border-ink-300 dark:border-[#262c36] bg-white dark:bg-[#0d1117] text-ink-900 dark:text-ink-100 text-xs focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none capitalize disabled:opacity-60 transition [&>option]:bg-white dark:[&>option]:bg-[#161b22] [&>option]:text-ink-900 dark:[&>option]:text-white"
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
