"use client";

import { useEffect, useRef, useState } from "react";
import useDataStore from "../store/dataStore";
import useUIStore from "../store/uiStore";

const NotificationsSidebar = () => {
  const { showNotificationsSidebar, setShowNotificationsSidebar } =
    useUIStore();
  const {
    notifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    loadMoreNotifications,
    simulateLoadMoreNotifications,
    notificationPage,
    loadingNotifications,
  } = useDataStore();

  const scrollRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);

  const unreadNotifications = notifications.filter((n) => !n.read);

  const handleClose = () => {
    setShowNotificationsSidebar(false);
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (
        scrollTop + clientHeight >= scrollHeight - 5 &&
        !loadingNotifications &&
        hasMore
      ) {
        loadMoreNotifications();
        // Simulate API call
        setTimeout(() => {
          simulateLoadMoreNotifications();
          // Stop loading more after 3 pages for demo
          if (notificationPage >= 3) {
            setHasMore(false);
          }
        }, 1000);
      }
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, [loadingNotifications, hasMore, notificationPage]);

  if (!showNotificationsSidebar) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          showNotificationsSidebar ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Notifications
              </h2>
              {unreadNotifications.length > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary">
                  {unreadNotifications.length} unread
                </span>
              )}
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Actions */}
          {unreadNotifications.length > 0 && (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-primary hover:text-primary font-medium transition-colors"
              >
                Mark all as read
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg
                  className="w-12 h-12 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M15 17h5l-5 5v-5zM10.07 2.82l3.93 3.93-3.93 3.93-3.93-3.93 3.93-3.93z"
                  />
                </svg>
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read
                        ? "bg-blue-50 border-l-4 border-l-primary"
                        : ""
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {!notification.read ? (
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        ) : (
                          <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm ${
                            !notification.read
                              ? "font-medium text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {loadingNotifications && (
                  <div className="p-4 text-center">
                    <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span>Loading more notifications...</span>
                    </div>
                  </div>
                )}

                {/* End of notifications indicator */}
                {!hasMore && notifications.length > 10 && (
                  <div className="p-4 text-center">
                    <p className="text-sm text-gray-500">
                      You've reached the end of your notifications
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Total: {notifications.length} notifications</span>
              <span>Unread: {unreadNotifications.length}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationsSidebar;
