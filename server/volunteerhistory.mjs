// volunteerHistory.mjs
// volunteerHistory.mjs
import { db } from './database/database.mjs';
import { check, validationResult } from 'express-validator';

// Validation rules for volunteer history entries
export const validateVolunteerHistoryEntry = [
  check('eventName').isString().isLength({ min: 1, max: 100 }).withMessage('Event name is required and must be between 1 and 100 characters.'),
  check('eventDescription').isString().isLength({ min: 1, max: 500 }).withMessage('Event description is required and must be between 1 and 500 characters.'),
  check('location').isString().withMessage('Location is required.'),
  check('requiredSkills').isArray().withMessage('Required skills must be an array.'),
  check('urgency').isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Urgency must be one of: Low, Medium, High, Critical.'),
  check('eventDate').isISO8601().withMessage('Event date must be a valid date in ISO 8601 format.'),
  check('participationStatus').isIn(['Completed', 'Pending', 'Cancelled']).withMessage('Status must be one of: Completed, Pending, or Cancelled.')
];

// Retrieve all volunteer history entries
export const getVolunteerHistory = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT email, event_name, event_description, location, required_skills, urgency, event_date, participation_status FROM VolunteerHistory');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving volunteer history entries', error });
  }
};
// Retrieve a specific volunteer history entry by event name
export const getVolunteerHistoryByEventName = async (req, res) => {
  const { eventName } = req.params;
  try {
    const [rows] = await db.query('SELECT email, event_name, event_description, location, required_skills, urgency, event_date, participation_status FROM VolunteerHistory WHERE event_name = ?', [eventName]);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: 'Volunteer history entry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving volunteer history entry', error });
  }
};


// Create or update a volunteer history entry
export const createOrUpdateVolunteerHistoryEntry = async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { eventName, eventDescription, location, requiredSkills, urgency, eventDate, participationStatus } = req.body;
  try { 
    const [existingEntry] = await db.query('SELECT * FROM VolunteerHistory WHERE event_name = ?', [eventName]);
    if (existingEntry.length > 0) {
      // Update the existing entry
      await db.query(
        'UPDATE VolunteerHistory SET event_description = ?, location = ?, required_skills = ?, urgency = ?, event_date = ?, participation_status = ? WHERE event_name = ?',
        [eventDescription, location, JSON.stringify(requiredSkills), urgency, eventDate, participationStatus, eventName]
      );
      res.status(200).json({ message: 'Volunteer history entry updated successfully' });
    } else {
      // Insert a new entry
      await db.query(
        'INSERT INTO VolunteerHistory (email, event_name, event_description, location, required_skills, urgency, event_date, participation_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        ['bdiaz@uh.edu', eventName, eventDescription, location, JSON.stringify(requiredSkills), urgency, eventDate, participationStatus]
      );
      res.status(201).json({ message: 'Volunteer history entry created successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating or updating volunteer history entry', error });
  }
};

// Delete a specific volunteer history entry by event name
export const deleteVolunteerHistoryByEventName = async (req, res) => {
  const { eventName } = req.params;
  try {
    const [result] = await db.query('DELETE FROM VolunteerHistory WHERE event_name = ?', [eventName]);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Volunteer history entry deleted successfully' });
    } else {
      res.status(404).json({ message: 'Volunteer history entry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting volunteer history entry', error });
  }
};
