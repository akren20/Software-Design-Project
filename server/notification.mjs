import { db } from './database/database.mjs'; // Database connection
import { check, validationResult } from 'express-validator';

// Validation rules for creating notifications
export const validateNotification = [
  check('type')
    .isIn(['Event Assignment', 'Reminder', 'Update', 'General'])
    .withMessage('Invalid notification type.'),
  check('message')
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage('Message must be between 1 and 255 characters.')
];

// Get all notifications for a specific user
export const getNotificationsByUser = async (req, res) => {
  const { userEmail } = req.params;
  try {
    console.log(`Fetching notifications for: ${userEmail}`); // Debug email
    const [rows] = await db.query(
      `SELECT n.*, e.event_name, e.event_date 
       FROM Notifications n
       LEFT JOIN EventDetails e ON n.event_id = e.event_id
       WHERE n.user_email = ?
       ORDER BY n.created_at DESC`,
      [userEmail]
    );
    console.log(`Query result:`, rows); // Debug query result
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error in getNotificationsByUser:", error); // Debug errors
    res.status(500).json({ message: 'Error retrieving notifications', error });
  }
};

// Create a new notification
export const createNotification = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userEmail, eventId, type, message } = req.body;
  try {
    await db.query(
      `INSERT INTO Notifications (user_email, event_id, type, message) 
       VALUES (?, ?, ?, ?)`,
      [userEmail, eventId || null, type, message]
    );
    res.status(201).json({ message: 'Notification created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error });
  }
};

// Delete a notification by ID
export const deleteNotificationById = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(`DELETE FROM Notifications WHERE notification_id = ?`, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification', error });
  }
};

// Reminder Notification Logic (check every hour)
setInterval(async () => {
  try {
    const [events] = await db.query(`SELECT * FROM EventDetails WHERE event_date > NOW()`); // Fetch upcoming events
    const now = new Date();

    for (const event of events) {
      const hoursUntilEvent = (new Date(event.event_date) - now) / (1000 * 60 * 60);
      if (hoursUntilEvent <= 24 && hoursUntilEvent > 23) {
        const message = `Reminder: The event "${event.event_name}" is coming up in 24 hours!`;
        await db.query(
          `INSERT INTO Notifications (user_email, event_id, type, message)
           SELECT email, ? AS event_id, 'Reminder' AS type, ? AS message
           FROM UserProfile`,
          [event.event_id, message]
        );
        console.log("Reminder sent for event:", event.event_name);
      }
    }
  } catch (error) {
    console.error("Error generating reminders:", error);
  }
}, 3600000); // Runs every hour
