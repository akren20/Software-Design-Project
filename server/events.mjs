import { db } from './database/database.mjs';
import { check, validationResult } from 'express-validator';

// Validation middleware
export const validateEvent = [
  check('eventName').isString().isLength({ min: 1, max: 255 }),
  check('description').isString(),
  check('stateCode').isString().isLength({ min: 2, max: 2 }),
  check('city').isString().isLength({ min: 1, max: 100 }),
  check('location').isString().isLength({ min: 1, max: 255 }),
  check('requiredSkills').isArray(),
  check('urgency').isIn(['Low', 'Medium', 'High']),
  check('eventDate').isISO8601()
];

export const getAllEvents = async (req, res) => {
  console.log('getAllEvents called');
  res.setHeader('Content-Type', 'application/json');
  
  try {
    console.log('Executing database query...');
    const [rows] = await db.query(`
      SELECT 
        e.event_id,
        e.event_name,
        e.description,
        e.state_code,
        s.state_name,
        e.city,
        e.location,
        e.required_skills,
        e.urgency,
        e.event_date,
        COUNT(DISTINCT vh.email) as volunteer_count
      FROM EventDetails e
      LEFT JOIN States s ON e.state_code = s.state_code
      LEFT JOIN VolunteerHistory vh ON e.event_name = vh.event_name
      GROUP BY 
        e.event_id,
        e.event_name,
        e.description,
        e.state_code,
        s.state_name,
        e.city,
        e.location,
        e.required_skills,
        e.urgency,
        e.event_date
      ORDER BY e.event_date DESC
    `);

    console.log('Raw database response:', rows);

    if (!rows) {
      console.log('No rows returned, sending empty array');
      return res.json([]);
    }

    // Clean and transform the data
    const events = rows.map(event => ({
      event_id: event.event_id,
      event_name: event.event_name,
      description: event.description,
      state_code: event.state_code,
      state_name: event.state_name,
      city: event.city,
      location: event.location || `${event.city}, ${event.state_name}`,
      required_skills: typeof event.required_skills === 'string' 
        ? JSON.parse(event.required_skills || '[]') 
        : (event.required_skills || []),
      urgency: event.urgency,
      event_date: event.event_date,
      volunteer_count: event.volunteer_count,
      status: new Date(event.event_date) > new Date() ? 'Upcoming' : 'Completed'
    }));

    console.log('Processed events:', events);
    return res.json(events);
  } catch (error) {
    console.error('Error in getAllEvents:', error);
    return res.status(500).json({ 
      message: 'Error retrieving events', 
      error: error.message 
    });
  }
};

export const getEventByName = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        e.event_id,
        e.event_name,
        e.description,
        e.state_code,
        s.state_name,
        e.city,
        e.location,
        e.required_skills,
        e.urgency,
        e.event_date,
        COUNT(DISTINCT vh.email) as registered_volunteers
      FROM EventDetails e
      LEFT JOIN States s ON e.state_code = s.state_code
      LEFT JOIN VolunteerHistory vh ON e.event_name = vh.event_name
      WHERE e.event_name = ?
      GROUP BY 
        e.event_id,
        e.event_name,
        e.description,
        e.state_code,
        s.state_name,
        e.city,
        e.location,
        e.required_skills,
        e.urgency,
        e.event_date
    `, [req.params.eventName]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const event = {
      ...rows[0],
      required_skills: typeof rows[0].required_skills === 'string'
        ? JSON.parse(rows[0].required_skills || '[]')
        : (rows[0].required_skills || []),
      location: rows[0].location || `${rows[0].city}, ${rows[0].state_name}`,
      status: new Date(rows[0].event_date) > new Date() ? 'Upcoming' : 'Completed'
    };

    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ 
      message: 'Error retrieving event', 
      error: error.message 
    });
  }
};

export const createOrUpdateEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    eventName,
    description,
    stateCode,
    city,
    location,
    requiredSkills,
    urgency,
    eventDate,
  } = req.body;

  try {
    // Check if event exists
    const [existing] = await db.query(
      'SELECT * FROM EventDetails WHERE event_name = ?', 
      [eventName]
    );

    if (existing.length > 0) {
      // Update existing event
      await db.query(`
        UPDATE EventDetails 
        SET description = ?,
            state_code = ?,
            city = ?,
            location = ?,
            required_skills = ?,
            urgency = ?,
            event_date = ?
        WHERE event_name = ?
      `, [
        description,
        stateCode,
        city,
        location,
        JSON.stringify(requiredSkills),
        urgency,
        eventDate,
        eventName
      ]);

      res.status(200).json({ message: 'Event updated successfully' });
    } else {
      // Create new event
      await db.query(`
        INSERT INTO EventDetails (
          event_name,
          description,
          state_code,
          city,
          location,
          required_skills,
          urgency,
          event_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        eventName,
        description,
        stateCode,
        city,
        location,
        JSON.stringify(requiredSkills),
        urgency,
        eventDate
      ]);

      res.status(201).json({ message: 'Event created successfully' });
    }
  } catch (error) {
    console.error('Error saving event:', error);
    res.status(500).json({ 
      message: 'Error saving event', 
      error: error.message 
    });
  }
};

export const deleteEventByName = async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM EventDetails WHERE event_name = ?', 
      [req.params.eventName]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ 
      message: 'Error deleting event', 
      error: error.message 
    });
  }
};