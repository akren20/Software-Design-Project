import { check, validationResult } from 'express-validator';

let events = []; // In-memory event storage

export const validateEvent = [
    check('eventName').isString().isLength({ min: 1, max: 100 }).withMessage('Event name is required and must be between 1 and 100 characters.'),
    check('eventDescription').isString().isLength({ min: 1, max: 500 }).withMessage('Event description is required and must be between 1 and 500 characters.'),
    check('state').isString().withMessage('State is required.'),
    check('city').isString().withMessage('City is required.'),
    check('requiredSkills').isArray().withMessage('Required skills must be an array.'),
    check('urgency').isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Urgency must be one of: Low, Medium, High, Critical.'),
    check('eventDate')
    .isISO8601().withMessage('Event date must be a valid date in ISO 8601 format.'),
    check('eventTime')
    .matches(/^([01]\d|2[0-3]):?([0-5]\d)$/).withMessage('Event time must be a valid time in HH:mm format.')
    .custom((value, { req }) => {
        const eventDateTime = new Date(`${req.body.eventDate}T${value}:00`);
        const now = new Date();
        if (eventDateTime < now) {
            throw new Error('Event date and time cannot be in the past.');
        }
        return true;
    }),
];

export const createOrUpdateEvent = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { eventName, eventDescription, state, city, requiredSkills, urgency, eventDate, eventTime } = req.body;
    const location = `${city}, ${state}`;
    const dateTime = `${eventDate} ${eventTime}`;

    const eventIndex = events.findIndex(event => event.eventName === eventName);

    if (eventIndex !== -1) {
        // Update existing event
        events[eventIndex] = { eventName, eventDescription, location, requiredSkills, urgency, dateTime };
        return res.status(200).json({ message: 'Event updated successfully', event: events[eventIndex] });
    } else {
        // Create new event
        const newEvent = { eventName, eventDescription, location, requiredSkills, urgency, dateTime };
        events.push(newEvent);
        return res.status(201).json({ message: 'Event created successfully', event: newEvent });
    }
};

export const getAllEvents = (req, res) => {
    res.status(200).json(events);
};

export const getEventByName = (req, res) => {
    const { eventName } = req.params;
    const event = events.find(event => event.eventName === eventName);
    if (event) {
        return res.status(200).json(event);
    } else {
        return res.status(404).json({ message: 'Event not found' });
    }
};

export const deleteEventByName = (req, res) => {
    const { eventName } = req.params;
    const eventIndex = events.findIndex(event => event.eventName === eventName);
    if (eventIndex !== -1) {
        events.splice(eventIndex, 1);
        return res.status(200).json({ message: 'Event deleted successfully' });
    } else {
        return res.status(404).json({ message: 'Event not found' });
    }
};
