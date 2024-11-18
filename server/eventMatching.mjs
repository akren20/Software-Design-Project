import express from 'express';
//import { userProfiles } from './userProfile.mjs';
import { getAllEvents, getEventByName } from './events.mjs'; // Import event functions

const router = express.Router();

// Helper function to calculate matching score
export function calculateMatchingScore(volunteer, event) {
  let score = 0;
  
  // Match skills
  const matchedSkills = volunteer.skills.filter(skill => event.requiredSkills.includes(skill));
  score += matchedSkills.length * 2; // Each matched skill adds 2 points
  
  // Match availability
  const eventDateTime = new Date(event.dateTime);
  const availableDates = volunteer.availability.map(date => new Date(date));
  if (availableDates.some(date => date.toDateString() === eventDateTime.toDateString())) {
    score += 3; // Available on the event date adds 3 points
  }
  
  // Match preferences (assuming event has a workType property, adjust if needed)
  const workType = event.location.toLowerCase() === 'remote' ? 'remote' : 'in-person';
  if (volunteer.preferences.toLowerCase().includes(workType)) {
    score += 2; // Matching work type preference adds 2 points
  }
  
  // Match location
  const [eventCity, eventState] = event.location.split(', ');
  if (volunteer.city.toLowerCase() === eventCity.toLowerCase() && volunteer.state.toLowerCase() === eventState.toLowerCase()) {
    score += 2; // Same city and state adds 2 points
  }
  
  // Match urgency (convert urgency to numeric value)
  const urgencyScores = { 'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4 };
  score += urgencyScores[event.urgency] || 0;
  
  return score;
}
router.get('/matches/:email', (req, res) => {
    console.log('GET /matches/:email called');
    const { email } = req.params;
    console.log('Searching for volunteer with email:', email);
    const volunteer = userProfiles.find(profile => profile.email === email);
    
    if (!volunteer) {
      console.log('Volunteer not found');
      return res.status(404).json({ error: 'Volunteer not found' });
    }
    
    console.log('Volunteer found:', volunteer);
    const events = getAllEvents();
    console.log('Total events:', events.length);
    
    const matchedEvents = events.map(event => ({
      ...event,
      matchScore: calculateMatchingScore(volunteer, event)
    })).sort((a, b) => b.matchScore - a.matchScore);
    
    console.log('Matched events:', matchedEvents);
    res.json(matchedEvents);
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
  