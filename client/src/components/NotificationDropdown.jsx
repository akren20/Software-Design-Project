import React, { useState, useEffect } from "react";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Fetch notifications from the backend
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:8080/notifications");
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Notifications
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50">
          <div className="py-2">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <strong>{notification.type}:</strong> {notification.message}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-700">No new notifications</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
 