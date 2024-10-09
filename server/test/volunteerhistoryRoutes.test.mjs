import request from 'supertest';
import { expect } from 'chai';
import app from '../server.js';

describe('Volunteer History API', () => {
  
  it('should create a new volunteer history entry', async () => {
    const res = await request(app)
      .post('/volunteer-history')
      .send({
        eventName: 'Beach Cleanup',
        eventDescription: 'A community event to clean the beach.',
        location: 'Beach Park',
        requiredSkills: ['Teamwork', 'Leadership'],
        urgency: 'High',
        eventDate: '2024-11-10',
        participationStatus: 'Pending',
      });

    expect(res.statusCode).to.equal(201);
    expect(res.body.message).to.equal('Volunteer history entry created successfully');
    expect(res.body.entry).to.have.property('eventName', 'Beach Cleanup');
  });

  it('should not create a volunteer history entry with invalid data', async () => {
    const res = await request(app)
      .post('/volunteer-history')
      .send({
        eventName: '', // Invalid empty eventName
        eventDescription: 'This is a test description',
        location: 'Park',
        requiredSkills: 'Not an array', // Invalid type for requiredSkills
        urgency: 'Urgent', // Invalid urgency value
        eventDate: 'Invalid Date', // Invalid date format
        participationStatus: 'Unknown', // Invalid status
      });

    expect(res.statusCode).to.equal(400);
    expect(res.body.errors).to.be.an('array');
    expect(res.body.errors.length).to.be.greaterThan(0);
  });

  it('should retrieve all volunteer history entries', async () => {
    const res = await request(app).get('/volunteer-history');
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('should retrieve a specific volunteer history entry by event name', async () => {
    // Add an entry first to ensure it exists
    await request(app)
      .post('/volunteer-history')
      .send({
        eventName: 'Park Planting',
        eventDescription: 'Planting trees in the park.',
        location: 'City Park',
        requiredSkills: ['Environmentally Conscious', 'Gardening'],
        urgency: 'Medium',
        eventDate: '2024-12-12',
        participationStatus: 'Completed',
      });

    const res = await request(app).get('/volunteer-history/Park Planting');
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('eventName', 'Park Planting');
  });

  it('should return 404 for a non-existent volunteer history entry', async () => {
    const res = await request(app).get('/volunteer-history/NonExistentEvent');
    expect(res.statusCode).to.equal(404);
    expect(res.body.message).to.equal('Volunteer history entry not found');
  });

  it('should delete a volunteer history entry by event name', async () => {
    const res = await request(app).delete('/volunteer-history/Beach Cleanup');
    expect(res.statusCode).to.equal(200);
    expect(res.body.message).to.equal('Volunteer history entry deleted successfully');
  });

  it('should return 404 when trying to delete a non-existent volunteer history entry', async () => {
    const res = await request(app).delete('/volunteer-history/NonExistentEvent');
    expect(res.statusCode).to.equal(404);
    expect(res.body.message).to.equal('Volunteer history entry not found');
  });
});
