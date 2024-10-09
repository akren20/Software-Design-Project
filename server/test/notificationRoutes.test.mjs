import request from 'supertest';
import { expect } from 'chai';
import app from '../server.js';

describe('Notification API', () => {

  it('should retrieve all notifications', async () => {
    const res = await request(app).get('/notifications');
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('should create a new notification', async () => {
    const res = await request(app)
      .post('/notifications')
      .send({
        type: "Event Assignment",
        message: "You have been assigned to the Tree Planting event."
      });

    expect(res.statusCode).to.equal(201);
    expect(res.body.message).to.equal("Notification created successfully");
  });

  it('should validate notification data and return errors for invalid input', async () => {
    const res = await request(app)
      .post('/notifications')
      .send({
        type: "Invalid Type",
        message: ""
      });

    expect(res.statusCode).to.equal(400);
    expect(res.body.errors).to.be.an('array');
  });

  it('should delete a notification by ID', async () => {
    const res = await request(app).delete('/notifications/1');
    expect(res.statusCode).to.equal(200);
    expect(res.body.message).to.equal("Notification deleted successfully");
  });

  it('should return 404 when deleting a non-existent notification', async () => {
    const res = await request(app).delete('/notifications/999');
    expect(res.statusCode).to.equal(404);
    expect(res.body.message).to.equal("Notification not found");
  });
});
