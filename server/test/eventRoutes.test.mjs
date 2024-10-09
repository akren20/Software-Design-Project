import request from 'supertest';
import { expect } from 'chai';
import app from '../server.mjs'; 

describe('Event Management API', () => {

  it('should create a new event', async () => {
    const res = await request(app)
      .post('/events')
      .send({
        eventName: 'Test Event',
        eventDescription: 'This is a test event',
        state: 'California',
        city: 'San Francisco',
        requiredSkills: ['Leadership', 'Communication'],
        urgency: 'High',
        eventDate: '2024-10-10',
        eventTime: '14:00', // Include eventTime
      });

    expect(res.statusCode).to.equal(201);
    expect(res.body.message).to.equal('Event created successfully');
  });

  it('should not create an event with invalid data', async () => {
    const res = await request(app)
      .post('/events')
      .send({
        eventName: '', // Empty eventName should trigger validation error
        eventDescription: 'This is a test event',
        state: '', // Missing state should trigger validation error
        city: '', // Missing city should trigger validation error
        requiredSkills: 'Not an array', // Invalid field type
        urgency: 'Urgent', // Invalid urgency value
        eventDate: 'Invalid Date', // Invalid date format
        eventTime: '25:00', // Invalid time format
      });

    expect(res.statusCode).to.equal(400);
    expect(res.body.errors).to.be.an('array');
  });

  it('should not create an event with a past date and time', async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // Set to yesterday

    const res = await request(app)
      .post('/events')
      .send({
        eventName: 'Past Event',
        eventDescription: 'This event is in the past',
        state: 'California',
        city: 'Los Angeles',
        requiredSkills: ['Technical Writing'],
        urgency: 'Low',
        eventDate: pastDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        eventTime: '10:00', // A time, but on a past date
      });

    expect(res.statusCode).to.equal(400);
    expect(res.body.errors).to.be.an('array');
    expect(res.body.errors[0].msg).to.equal('Event date and time cannot be in the past.');
  });

  it('should retrieve all events', async () => {
    const res = await request(app).get('/events');
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('should retrieve a single event by name', async () => {
    await request(app)
      .post('/events')
      .send({
        eventName: 'Test Event 2',
        eventDescription: 'Another test event',
        state: 'New York',
        city: 'New York City',
        requiredSkills: ['Technical Writing'],
        urgency: 'Low',
        eventDate: '2024-12-12',
        eventTime: '16:30', // Include eventTime
      });

    const res = await request(app).get('/events/Test Event 2');
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('eventName', 'Test Event 2');
  });

  it('should return 404 for non-existent event', async () => {
    const res = await request(app).get('/events/NonExistentEvent');
    expect(res.statusCode).to.equal(404);
    expect(res.body.message).to.equal('Event not found');
  });

  it('should delete an event by name', async () => {
    const res = await request(app).delete('/events/Test Event');
    expect(res.statusCode).to.equal(200);
    expect(res.body.message).to.equal('Event deleted successfully');
  });

  it('should return 404 when trying to delete a non-existent event', async () => {
    const res = await request(app).delete('/events/NonExistentEvent');
    expect(res.statusCode).to.equal(404);
    expect(res.body.message).to.equal('Event not found');
  });
});
