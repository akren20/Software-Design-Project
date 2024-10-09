import request from 'supertest';
import { expect } from 'chai';
import app from '../server.mjs';

describe('Login API', () => {
  it('should log in a user with valid credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: 'volunteer@example.com',
        password: 'volunteer2024'
      });
      
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('token'); // Corrected to Chai syntax
    expect(res.body.msg).to.equal('Login successful'); // Corrected to Chai syntax
  });

  it('should not log in a user with invalid credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: 'user@example.com',
        password: 'wrongpassword'
      });
      
    expect(res.statusCode).to.equal(400);
    expect(res.body.errors[0].msg).to.equal('Invalid credentials'); // Corrected to Chai syntax
  });

  it('should return validation errors for missing email and password', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: '',
        password: ''
      });
      
      expect(res.statusCode).to.equal(400);
      expect(res.body.errors).to.have.lengthOf(1); // Two validation errors
  });
});