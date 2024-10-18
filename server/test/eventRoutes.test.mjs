import request from 'supertest';
import { expect } from 'chai';
import app from '../server.mjs';

describe('Event Management API', () => {
  it('should create a new event', async () => {
    const newEvent = {
      eventName: 'Test Event',
      eventDescription: 'This is a test event',
      state: 'California',
      city: 'San Francisco',
      requiredSkills: ['Leadership', 'Communication'],
      urgency: 'High',
      eventDate: '2024-10-10',
      eventTime: '14:00',
    };

    const res = await request(app)
      .post('/events')
      .send(newEvent);

    console.log('Create event response:', res.body);

    expect(res.status).to.equal(201);
    expect(res.body.message).to.equal('Event created successfully');
  });

  it('should not create an event with invalid data', async () => {
    const res = await request(app)
      .post('/events')
      .send({
        eventName: '',
        eventDescription: 'This is a test event',
        state: '',
        city: '',
        requiredSkills: 'Not an array',
        urgency: 'Urgent',
        eventDate: 'Invalid Date',
        eventTime: '25:00',
      });

    expect(res.status).to.equal(400);
    expect(res.body.errors).to.be.an('array');
  });

  it('should not create an event with a past date and time', async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const res = await request(app)
      .post('/events')
      .send({
        eventName: 'Past Event',
        eventDescription: 'This event is in the past',
        state: 'California',
        city: 'Los Angeles',
        requiredSkills: ['Technical Writing'],
        urgency: 'Low',
        eventDate: pastDate.toISOString().split('T')[0],
        eventTime: '10:00',
      });

    expect(res.status).to.equal(400);
    expect(res.body.errors).to.be.an('array');
    expect(res.body.errors[0].msg).to.equal('Event date and time cannot be in the past.');
  });

  it('should retrieve all events', async () => {
    const res = await request(app).get('/events');
    expect(res.status).to.equal(200);
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
        eventTime: '16:30',
      });

    const res = await request(app).get('/events/Test Event 2');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('eventName', 'Test Event 2');
  });

  it('should return 404 for non-existent event', async () => {
    const res = await request(app).get('/events/NonExistentEvent');
    expect(res.status).to.equal(404);
    expect(res.body.message).to.equal('Event not found');
  });

  it('should delete an event by name', async () => {
    // First, create an event
    const newEvent = {
      eventName: 'Event to Delete',
      eventDescription: 'This event will be deleted',
      state: 'California',
      city: 'San Francisco',
      requiredSkills: ['Testing'],
      urgency: 'Low',
      eventDate: '2024-12-31',
      eventTime: '10:00'
    };

    await request(app)
      .post('/events')
      .send(newEvent);

    // Then, delete the event
    const res = await request(app)
      .delete(`/events/${newEvent.eventName}`);

    console.log('Delete event response:', res.body);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Event deleted successfully');

    // Verify that the event is actually deleted
    const getRes = await request(app).get(`/events/${newEvent.eventName}`);
    expect(getRes.status).to.equal(404);
  });

  it('should return 404 when trying to delete a non-existent event', async () => {
    const res = await request(app).delete('/events/NonExistentEvent');
    expect(res.status).to.equal(404);
    expect(res.body.message).to.equal('Event not found');
  });
});