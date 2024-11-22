import { db } from './database/database.mjs';

// Validation middleware
export const validateEventUser = (req, res, next) => {
    const { event_id, email } = req.body;
    if (!event_id || !email) {
        return res.status(400).json({ message: 'Event ID and email are required' });
    }
    next();
};

// Create
export const createEventUser = async (req, res) => {
    const { event_id, email } = req.body;
    try {
        await db.query(
            'INSERT INTO EventUsers (event_id, email) VALUES (?, ?)',
            [event_id, email]
        );
        res.status(201).json({ message: 'User registered for event successfully' });
    } catch (error) {
        console.error('Error registering user for event:', error);
        res.status(500).json({ message: 'Error registering user for event' });
    }
};

// Read all users for an event
export const getUsersByEvent = async (req, res) => {
    const { event_id } = req.params;
    try {
        const [users] = await db.query(
            'SELECT eu.*, up.full_name FROM EventUsers eu JOIN UserProfile up ON eu.email = up.email WHERE eu.event_id = ?',
            [event_id]
        );
        res.json(users);
    } catch (error) {
        console.error('Error fetching event users:', error);
        res.status(500).json({ message: 'Error fetching event users' });
    }
};

// Read all events for a user
export const getEventsByUser = async (req, res) => {
    const { email } = req.params;
    try {
        const [events] = await db.query(
            'SELECT eu.*, ed.event_name, ed.description FROM EventUsers eu JOIN EventDetails ed ON eu.event_id = ed.event_id WHERE eu.email = ?',
            [email]
        );
        res.json(events);
    } catch (error) {
        console.error('Error fetching user events:', error);
        res.status(500).json({ message: 'Error fetching user events' });
    }
};

// Delete
export const deleteEventUser = async (req, res) => {
    const { event_id, email } = req.params;
    try {
        await db.query(
            'DELETE FROM EventUsers WHERE event_id = ? AND email = ?',
            [event_id, email]
        );
        res.json({ message: 'User unregistered from event successfully' });
    } catch (error) {
        console.error('Error unregistering user from event:', error);
        res.status(500).json({ message: 'Error unregistering user from event' });
    }
};