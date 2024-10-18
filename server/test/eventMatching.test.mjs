import request from 'supertest';
import { expect } from 'chai';
import app from '../server.mjs';
import { userProfiles } from '../userProfile.mjs';
import { getAllEventsData } from '../events.mjs';

console.log('Current user profiles:', userProfiles);
console.log('Current events:', getAllEventsData());

describe('Matching API', () => {
  describe('GET /api/matches/:email', () => {
    it('should return matched events for a volunteer', async () => {
      const testEmail = 'wlamberth@uh.edu'; // Use an email that exists in userProfiles
      console.log('Testing with email:', testEmail);
      
      const response = await request(app)
        .get(`/api/matches/${testEmail}`)
        .expect(200);

      console.log('Response body:', response.body);
      expect(response.body).to.be.an('array');
      if (response.body.length > 0) {
        expect(response.body[0]).to.have.property('eventName');
        expect(response.body[0]).to.have.property('matchScore').that.is.a('number');
      }
    });

    it('should return 404 if volunteer is not found', async () => {
      const response = await request(app)
        .get('/api/matches/nonexistent@example.com')
        .expect(404);

      console.log('Response body:', response.body);
      expect(response.body).to.deep.equal({ error: 'Volunteer not found' });
    });
  });

  describe('GET /api/volunteers/:eventName', () => {
    it('should return matched volunteers for an event', async () => {
      // First, create a test event
      const testEvent = {
        eventName: 'Test Event for Matching',
        eventDescription: 'This is a test event for matching volunteers',
        state: 'California',
        city: 'San Francisco',
        requiredSkills: ['Leadership', 'Communication'],
        urgency: 'High',
        eventDate: '2025-10-18',
        eventTime: '14:00',
      };

      await request(app)
        .post('/events')
        .send(testEvent);

      const response = await request(app)
        .get(`/api/volunteers/${encodeURIComponent(testEvent.eventName)}`)
        .expect(200);

      console.log('Response body:', response.body);
      expect(response.body).to.be.an('array');
      if (response.body.length > 0) {
        expect(response.body[0]).to.have.property('email');
        expect(response.body[0]).to.have.property('matchScore').that.is.a('number');
      }
    });

    it('should return 404 if event is not found', async () => {
      const response = await request(app)
        .get('/api/volunteers/NonexistentEvent')
        .expect(404);

      console.log('Response body:', response.body);
      expect(response.body).to.deep.equal({ error: 'Event not found' });
    });
  });
});

console.log('Current user profiles after tests:', userProfiles);
console.log('Current events after tests:', getAllEventsData());