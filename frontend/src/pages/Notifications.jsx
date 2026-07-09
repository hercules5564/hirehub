import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAsRead, markAllAsRead } from '../redux/slices/notificationSlice';
import { timeAgo } from '../utils/helpers';
import { HiOutlineBell, HiOutlineCheckCircle, HiOutlineArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((s) => s.notifications);

  useEffect(() => { dispatch(fetchNotifications()); }, [dispatch]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300">
      {/* Header */}
      <div className="border-b border-ink-200 dark:border-[#262c36] bg-ink-50 dark:bg-[#11161f]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0">
                <HiOutlineBell className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white">Notifications</h1>
                <p className="text-ink-500 dark:text-ink-400 mt-0.5 flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-primary-50 dark:bg-primary-600/10 text-primary-700 dark:text-primary-400">
                    {unreadCount} unread
                  </span>
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button onClick={() => dispatch(markAllAsRead())} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-700 dark:text-ink-200 border border-ink-300 dark:border-[#262c36] rounded-lg px-4 py-2 hover:bg-white dark:hover:bg-white/[0.04] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40">
                <HiOutlineCheckCircle className="w-4 h-4" /> Mark all read
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-ink-100 dark:bg-white/[0.06] flex items-center justify-center text-ink-400">
              <HiOutlineBell className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-ink-900 dark:text-white mb-1.5">No notifications</h3>
            <p className="text-ink-500 dark:text-ink-400">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n._id} onClick={() => !n.isRead && dispatch(markAsRead(n._id))}
                className={`group relative p-4 sm:p-5 rounded-xl border transition-colors cursor-pointer ${n.isRead
                  ? 'bg-white dark:bg-[#161b22] border-ink-200 dark:border-[#262c36] hover:bg-ink-50 dark:hover:bg-white/[0.04]'
                  : 'bg-primary-50 dark:bg-primary-600/10 border-primary-200 dark:border-primary-700/50 hover:bg-primary-100/70 dark:hover:bg-primary-600/15'}`}>
                {!n.isRead && (
                  <span className="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-primary-600"></span>
                )}
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${n.isRead
                    ? 'bg-ink-100 dark:bg-white/[0.06] text-ink-500 dark:text-ink-400'
                    : 'bg-primary-50 dark:bg-primary-600/10 text-primary-600 dark:text-primary-400'}`}>
                    <HiOutlineBell className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-ink-900 dark:text-white text-sm">{n.title}</p>
                      {!n.isRead && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-primary-50 dark:bg-primary-600/10 text-primary-700 dark:text-primary-400">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-ink-600 dark:text-ink-400 mt-1 leading-relaxed">{n.message}</p>
                    <p className="text-xs text-ink-400 mt-2">{timeAgo(n.createdAt)}</p>
                  </div>
                  {n.link && (
                    <Link to={n.link} className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors flex-shrink-0">
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
