import express from 'express';
//import { userProfiles } from './userProfile.mjs';
import { getAllEvents, getEventByName } from './events.mjs'; // Import event functions
import { db } from './database/database.mjs';
import { getUserProfileByEmail } from './userProfile.mjs';

const router = express.Router();

export function calculateMatchingScore(volunteer, event) {
  let score = 0;

  // Match skills
  const matchedSkills = (volunteer.skills || []).filter((skill) =>
    (event.requiredSkills || []).includes(skill)
  );
  score += matchedSkills.length * 2; // Each matched skill adds 2 points

  // Match availability
  const eventDateTime = new Date(event.dateTime || 0);
  const availableDates = (volunteer.availability || []).map((date) => new Date(date));
  if (availableDates.some((date) => date.toDateString() === eventDateTime.toDateString())) {
    score += 3; // Available on the event date adds 3 points
  }

  // Match preferences
  const workType =
    typeof event.location === 'string' && event.location.toLowerCase() === 'remote'
      ? 'remote'
      : 'in-person';
  if ((volunteer.preferences || '').toLowerCase().includes(workType)) {
    score += 2; // Matching work type preference adds 2 points
  }

  // Match location
  if (typeof event.location === 'string') {
    const [eventCity, eventState] = event.location.split(', ');
    if (
      volunteer.city?.toLowerCase() === eventCity?.toLowerCase() &&
      volunteer.state?.toLowerCase() === eventState?.toLowerCase()
    ) {
      score += 2; // Same city and state adds 2 points
    }
  }

  // Match urgency
  const urgencyScores = { Low: 1, Medium: 2, High: 3, Critical: 4 };
  score += urgencyScores[event.urgency] || 0;

  return score;
}

router.get('/matches/:email', async (req, res) => {
  try {
      const { email } = req.params;
      console.log('Fetching user profile for:', email);

      // Get user profile by email from the database
      const [profileRows] = await db.query(
          "SELECT * FROM UserProfile WHERE email = ?",
          [email]
      );

      if (profileRows.length === 0) {
          return res.status(404).json({ message: "Volunteer not found" });
      }

      const volunteer = profileRows[0];
      console.log('Volunteer profile:', volunteer);

      // Get all events from the database
      const events = getAllEvents();
      console.log('Total events fetched:', events.length);

      // Calculate match scores for each event
      const matchedEvents = events.map((event) => ({
          ...event,
          matchScore: calculateMatchingScore(volunteer, event),
      })).sort((a, b) => b.matchScore - a.matchScore);

      res.status(200).json(matchedEvents);
  } catch (error) {
      console.error('Error fetching matches:', error);
      res.status(500).json({ message: 'Error processing matches' });
  }
});

  router.post('/match', async (req, res) => {
    const { volunteerId, eventId } = req.body;
    console.log('Match request received:', { volunteerId, eventId });
  
    if (!volunteerId || !eventId) {
      return res.status(400).json({ message: 'Volunteer ID and Event ID are required' });
    }
  
    try {
      await db.query(
        'INSERT INTO VolunteerHistory (email, event_name, participation_status) VALUES (?, ?, ?)',
        [volunteerId, eventId, 'Pending']
      );
      res.status(201).json({ message: 'Volunteer matched to event successfully' });
    } catch (error) {
      console.error('Error saving match:', error);
      res.status(500).json({ message: 'Error saving match' });
    }
  });
  
  
  router.get('/volunteers/:eventName', (req, res) => {
    console.log('GET /volunteers/:eventName called');
    const { eventName } = req.params;
    console.log('Searching for event:', eventName);
    const event = getEventByName({ params: { eventName } });
    
    if (!event) {
      console.log('Event not found');
      return res.status(404).json({ error: 'Event not found' });
    }
    
    console.log('Event found:', event);
    console.log('Total user profiles:', userProfiles.length);
    
    const matchedVolunteers = userProfiles.map(volunteer => ({
      ...volunteer,
      matchScore: calculateMatchingScore(volunteer, event)
    })).sort((a, b) => b.matchScore - a.matchScore);
    
    console.log('Matched volunteers:', matchedVolunteers);
    res.json(matchedVolunteers);
  });
  
  export default router;
  