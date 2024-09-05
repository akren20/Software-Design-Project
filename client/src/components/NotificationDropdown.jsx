import React, { useState, useEffect } from "react";
;
// Mock notifications data
const mockNotifications = [
  { id: 1, type: "Event Assignment", message: "You have been assigned to the Community Cleanup event." },
  { id: 2, type: "Reminder", message: "Don't forget to complete your profile." },
  { id: 3, type: "Update", message: "The Tech Workshop event details have been updated." },
];

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Manage dropdown state

  useEffect(() => {
    // Simulate fetching notifications from a backend service
    setNotifications(mockNotifications);
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
