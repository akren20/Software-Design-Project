// notification.mjs
import { check, validationResult } from 'express-validator';

let notifications = [
  { id: 1, type: "Event Assignment", message: "You have been assigned to the Community Cleanup event." },
  { id: 2, type: "Reminder", message: "Don't forget to complete your profile." },
  { id: 3, type: "Update", message: "The Tech Workshop event details have been updated." },
];

let events = [
  { id: 1, title: "Community Cleanup", date: new Date(Date.now() + 86400000), isUpdated: false },
  { id: 2, title: "Tech Workshop", date: new Date(Date.now() + 43200000), isUpdated: true },
];

// Validation rules for notifications
export const validateNotification = [
  check('type').isIn(['Event Assignment', 'Reminder', 'Update']).withMessage('Invalid notification type.'),
  check('message').isString().isLength({ min: 1, max: 255 }).withMessage('Message must be between 1 and 255 characters.')
];

// Get all notifications
export const getAllNotifications = (req, res) => {
  res.status(200).json(notifications);
};

// Create a new notification
export const createNotification = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { type, message } = req.body;
  const newNotification = { id: notifications.length + 1, type, message };
  notifications.push(newNotification);
  res.status(201).json({ message: "Notification created successfully", notification: newNotification });
};

// Delete a notification by ID
export const deleteNotificationById = (req, res) => {
  const { id } = req.params;
  const notificationIndex = notifications.findIndex(n => n.id === parseInt(id));
  
  if (notificationIndex === -1) {
    return res.status(404).json({ message: "Notification not found" });
  }

  notifications.splice(notificationIndex, 1);
  res.status(200).json({ message: "Notification deleted successfully" });
};

// Reminder Notification Logic (check every hour)
setInterval(() => {
  const now = new Date();
  events.forEach(event => {
    const hoursUntilEvent = (event.date - now) / (1000 * 60 * 60);

    // Check if the event is within the reminder period (e.g., 24 hours)
    if (hoursUntilEvent <= 24 && hoursUntilEvent > 23) {
      const reminderNotification = {
        id: notifications.length + 1,
        type: "Reminder",
        message: `Reminder: The event "${event.title}" is coming up in 24 hours!`,
      };
      notifications.push(reminderNotification);
      console.log("Reminder sent:", reminderNotification);
    }
  });
}, 3600000); // Runs every hour

// Update Notification Logic (check every 5 minutes)
setInterval(() => {
  events.forEach(event => {
    if (event.isUpdated) {
      const updateNotification = {
        id: notifications.length + 1,
        type: "Update",
        message: `The event "${event.title}" has been updated. Please check the latest details.`,
      };
      notifications.push(updateNotification);
      console.log("Update notification sent:", updateNotification);

      // Reset the update flag after notifying
      event.isUpdated = false;
    }
  });
}, 300000); // Runs every 5 minutes
