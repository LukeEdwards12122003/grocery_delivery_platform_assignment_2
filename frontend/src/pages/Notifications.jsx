
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Notifications = () => {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingId, setMarkingId] = useState(null);

  // Load notifications for the logged-in user
  useEffect(() => {
    let cancelled = false;

    const fetchNotifications = async () => {
      setLoading(true);
      setError('');

      try {
        if (!user?.token) {
          throw new Error('Please log in to view notifications.');
        }

        const response = await axiosInstance.get(
          '/api/notifications',
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        );

        if (!cancelled) {
          setNotifications(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            'Unable to load notifications. Please try again.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchNotifications();

    return () => {
      cancelled = true;
    };
  }, [user?.token]);

  // Mark an individual notification as read
  const markAsRead = async (notificationId) => {
    setMarkingId(notificationId);
    setError('');

    try {
      await axiosInstance.patch(
        `/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      setError('Unable to mark notification as read.');
    } finally {
      setMarkingId(null);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Notifications
        </h1>

        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
          {unreadCount} Unread
        </span>
      </div>

      {loading && (
        <p className="text-gray-600">
          Loading notifications...
        </p>
      )}

      {error && (
        <p role="alert" className="text-red-600 mb-4">
          {error}
        </p>
      )}

      {!loading && notifications.length === 0 && (
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-gray-600">
            You have no notifications yet.
          </p>
        </div>
      )}

      {!loading && notifications.map((notification) => (
        <div
          key={notification._id}
          className={`p-5 mb-4 rounded shadow border ${
            notification.isRead
              ? 'bg-gray-100 border-gray-200'
              : 'bg-blue-50 border-blue-300'
          }`}
        >
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="font-semibold">
                {notification.eventType.replaceAll('_', ' ')}
              </p>

              <p className="mt-2">
                {notification.message}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                {new Date(
                  notification.createdAt
                ).toLocaleString()}
              </p>
            </div>

            <div>
              {notification.isRead ? (
                <span className="text-green-600 font-medium">
                  Read
                </span>
              ) : (
                <button
                  onClick={() => markAsRead(notification._id)}
                  disabled={markingId === notification._id}
                  className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {markingId === notification._id
                    ? 'Updating...'
                    : 'Mark as Read'}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
