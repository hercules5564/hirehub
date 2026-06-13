import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAsRead, markAllAsRead } from '../redux/slices/notificationSlice';
import { timeAgo } from '../utils/helpers';
import { HiOutlineBell, HiOutlineCheckCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((s) => s.notifications);

  useEffect(() => { dispatch(fetchNotifications()); }, [dispatch]);

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-dark-900 dark:text-white">Notifications</h1>
            <p className="text-dark-500 mt-1">{unreadCount} unread</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={() => dispatch(markAllAsRead())} className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              <HiOutlineCheckCircle className="w-4 h-4" /> Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <HiOutlineBell className="w-16 h-16 mx-auto text-dark-300 mb-4" />
            <h3 className="text-xl font-semibold text-dark-700 dark:text-dark-300 mb-2">No notifications</h3>
            <p className="text-dark-500">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-2 stagger-children">
            {notifications.map((n) => (
              <div key={n._id} onClick={() => !n.isRead && dispatch(markAsRead(n._id))}
                className={`p-4 rounded-2xl border transition-colors cursor-pointer ${n.isRead
                  ? 'bg-white dark:bg-dark-800 border-gray-100 dark:border-dark-700'
                  : 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${n.isRead ? 'bg-transparent' : 'bg-primary-500'}`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-dark-900 dark:text-white text-sm">{n.title}</p>
                    <p className="text-sm text-dark-500 mt-0.5">{n.message}</p>
                    <p className="text-xs text-dark-400 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                  {n.link && <Link to={n.link} className="text-xs text-primary-600 font-medium hover:text-primary-700 flex-shrink-0">View</Link>}
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
