import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAsRead, markAllAsRead } from '../redux/slices/notificationSlice';
import { timeAgo } from '../utils/helpers';
import { HiOutlineBell, HiOutlineCheckCircle, HiOutlineSparkles, HiOutlineArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((s) => s.notifications);

  useEffect(() => { dispatch(fetchNotifications()); }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-24 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute -top-10 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full mb-3">
              <HiOutlineSparkles className="w-4 h-4" /> Activity
            </span>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] flex-shrink-0">
                <HiOutlineBell className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Notifi<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">cations</span>
                </h1>
                <p className="text-white/60 mt-0.5 flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300">
                    {unreadCount} unread
                  </span>
                </p>
              </div>
            </div>
          </div>
          {unreadCount > 0 && (
            <button onClick={() => dispatch(markAllAsRead())} className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 bg-white/[0.03] border border-white/[0.12] rounded-xl px-4 py-2 hover:bg-white/[0.06] hover:border-white/[0.2] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]">
              <HiOutlineCheckCircle className="w-4 h-4" /> Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)]">
              <HiOutlineBell className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
            <p className="text-white/60">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n._id} onClick={() => !n.isRead && dispatch(markAsRead(n._id))}
                className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${n.isRead
                  ? 'bg-white/[0.03] border-white/[0.1] hover:bg-white/[0.05] hover:border-white/[0.2]'
                  : 'bg-indigo-500/[0.08] border-indigo-400/30 hover:bg-indigo-500/[0.12] hover:border-indigo-400/50'}`}>
                {!n.isRead && (
                  <span className="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-rose-500"></span>
                )}
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${n.isRead
                    ? 'bg-white/[0.06] text-white/70'
                    : 'bg-gradient-to-br from-indigo-500 to-rose-500 text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)]'}`}>
                    <HiOutlineBell className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-white text-sm">{n.title}</p>
                      {!n.isRead && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-rose-500/15 text-rose-300">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/60 mt-1 leading-relaxed">{n.message}</p>
                    <p className="text-xs text-white/50 mt-2">{timeAgo(n.createdAt)}</p>
                  </div>
                  {n.link && (
                    <Link to={n.link} className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-300 hover:gap-2 hover:text-indigo-200 transition-all flex-shrink-0">
                      View <HiOutlineArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
