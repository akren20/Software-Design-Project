import { db } from './database/database.mjs';
import { check } from 'express-validator';

export const validateVolunteerHistoryEntry = [
  check('email').isEmail(),
  check('eventName').isString().isLength({ min: 1, max: 100 }),
  check('eventDescription').isString().isLength({ min: 1, max: 500 }),
  check('location').isString().isLength({ min: 1, max: 255 }),
  check('requiredSkills').custom(value => {
    try {
      if (typeof value === 'string') {
        JSON.parse(value);
      }
      return true;
    } catch (error) {
      throw new Error('Required skills must be valid JSON');
    }
  }),
  check('urgency').isIn(['Low', 'Medium', 'High', 'Critical']),
  check('eventDate').isISO8601(),
  check('participationStatus').isIn(['Completed', 'Pending', 'Cancelled'])
];

export const getVolunteerHistory = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        vh.*,
        up.full_name as volunteer_name,
        ed.state_code,
        s.state_name,
        ed.city
      FROM VolunteerHistory vh
      LEFT JOIN UserProfile up ON vh.email = up.email
      LEFT JOIN EventDetails ed ON vh.event_name = ed.event_name
      LEFT JOIN States s ON ed.state_code = s.state_code
      ORDER BY vh.created_at DESC
    `);

    const history = rows.map(entry => ({
      ...entry,
      required_skills: typeof entry.required_skills === 'string'
        ? JSON.parse(entry.required_skills)
        : entry.required_skills
    }));

    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching volunteer history:', error);
    res.status(500).json({ message: 'Error retrieving volunteer history', error: error.message });
  }
};

export const getVolunteerHistoryByEventName = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        vh.*,
        up.full_name as volunteer_name,
        ed.state_code,
        s.state_name,
        ed.city
      FROM VolunteerHistory vh
      LEFT JOIN UserProfile up ON vh.email = up.email
      LEFT JOIN EventDetails ed ON vh.event_name = ed.event_name
      LEFT JOIN States s ON ed.state_code = s.state_code
      WHERE vh.event_name = ?
    `, [req.params.eventName]);

    const history = rows.map(entry => ({
      ...entry,
      required_skills: typeof entry.required_skills === 'string'
        ? JSON.parse(entry.required_skills)
        : entry.required_skills
    }));

    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching volunteer history:', error);
    res.status(500).json({ message: 'Error retrieving volunteer history', error: error.message });
  }
};

export const getVolunteerHistoryByEmail = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        vh.*,
        up.full_name as volunteer_name,
        ed.state_code,
        s.state_name,
        ed.city
      FROM VolunteerHistory vh
      LEFT JOIN UserProfile up ON vh.email = up.email
      LEFT JOIN EventDetails ed ON vh.event_name = ed.event_name
      LEFT JOIN States s ON ed.state_code = s.state_code
      WHERE vh.email = ?
    `, [req.params.email]);

    const history = rows.map(entry => ({
      ...entry,
      required_skills: typeof entry.required_skills === 'string'
        ? JSON.parse(entry.required_skills)
        : entry.required_skills
    }));

    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching volunteer history:', error);
    res.status(500).json({ message: 'Error retrieving volunteer history', error: error.message });
  }
};

export const createOrUpdateVolunteerHistoryEntry = async (req, res) => {
  try {
    const {
      email,
      eventName,
      eventDescription,
      location,
      requiredSkills,
      urgency,
      eventDate,
      participationStatus
    } = req.body;

    // Check if entry exists
    const [existing] = await db.query(
      'SELECT * FROM VolunteerHistory WHERE email = ? AND event_name = ?',
      [email, eventName]
    );

    if (existing.length > 0) {
      await db.query(`
        UPDATE VolunteerHistory 
        SET event_description = ?,
            location = ?,
            required_skills = ?,
            urgency = ?,
            event_date = ?,
            participation_status = ?
        WHERE email = ? AND event_name = ?
      `, [
        eventDescription,
        location,
        JSON.stringify(requiredSkills),
        urgency,
        eventDate,
        participationStatus,
        email,
        eventName
      ]);

      res.status(200).json({ message: 'Volunteer history entry updated successfully' });
    } else {
      await db.query(`
        INSERT INTO VolunteerHistory (
          email,
          event_name,
          event_description,
          location,
          required_skills,
          urgency,
          event_date,
          participation_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        email,
        eventName,
        eventDescription,
        location,
        JSON.stringify(requiredSkills),
        urgency,
        eventDate,
        participationStatus
      ]);

      res.status(201).json({ message: 'Volunteer history entry created successfully' });
    }
  } catch (error) {
    console.error('Error saving volunteer history:', error);
    res.status(500).json({ message: 'Error saving volunteer history entry', error: error.message });
  }
};

export const deleteVolunteerHistoryByEventName = async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM VolunteerHistory WHERE event_name = ?', 
      [req.params.eventName]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Volunteer history entry not found' });
    }

    res.status(200).json({ message: 'Volunteer history entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting volunteer history:', error);
    res.status(500).json({ message: 'Error deleting volunteer history entry', error: error.message });
  }
};