// volunteerHistory.mjs
import { check, validationResult } from 'express-validator';

let volunteerHistory = [
  {
    eventName: "Community Cleanup",
    eventDescription: "A community event to clean up the neighborhood.",
    location: "City Park",
    requiredSkills: ["Leadership", "Teamwork"],
    urgency: "High",
    eventDate: "2024-09-15",
    participationStatus: "Completed",
  },
  {
    eventName: "Tech Workshop",
    eventDescription: "A workshop for teaching technical skills to students.",
    location: "Community Center",
    requiredSkills: ["Technical Writing", "Communication"],
    urgency: "Medium",
    eventDate: "2024-10-01",
    participationStatus: "Pending",
  },
];

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

// Create or update a volunteer history entry
export const createOrUpdateVolunteerHistoryEntry = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { eventName, eventDescription, location, requiredSkills, urgency, eventDate, participationStatus } = req.body;
  const eventIndex = volunteerHistory.findIndex(event => event.eventName === eventName);

  if (eventIndex !== -1) {
    // Update existing entry
    volunteerHistory[eventIndex] = { eventName, eventDescription, location, requiredSkills, urgency, eventDate, participationStatus };
    return res.status(200).json({ message: 'Volunteer history entry updated successfully', entry: volunteerHistory[eventIndex] });
  } else {
    // Create new entry
    const newEntry = { eventName, eventDescription, location, requiredSkills, urgency, eventDate, participationStatus };
    volunteerHistory.push(newEntry);
    return res.status(201).json({ message: 'Volunteer history entry created successfully', entry: newEntry });
  }
};

// Retrieve all volunteer history entries
export const getVolunteerHistory = (req, res) => {
  res.status(200).json(volunteerHistory);
};

// Retrieve a specific volunteer history entry by event name
export const getVolunteerHistoryByEventName = (req, res) => {
  const { eventName } = req.params;
  const event = volunteerHistory.find(event => event.eventName === eventName);
  if (event) {
    return res.status(200).json(event);
  } else {
    return res.status(404).json({ message: 'Volunteer history entry not found' });
  }
};

// Delete a specific volunteer history entry by event name
export const deleteVolunteerHistoryByEventName = (req, res) => {
  const { eventName } = req.params;
  const eventIndex = volunteerHistory.findIndex(event => event.eventName === eventName);
  if (eventIndex !== -1) {
    volunteerHistory.splice(eventIndex, 1);
    return res.status(200).json({ message: 'Volunteer history entry deleted successfully' });
  } else {
    return res.status(404).json({ message: 'Volunteer history entry not found' });
  }
};
