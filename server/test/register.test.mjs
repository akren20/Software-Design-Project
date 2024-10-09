import request from 'supertest';
import { expect } from 'chai';
import app from '../server.mjs';

describe('Register API', () => {
    it('should register a user with valid credentials', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          email: 'newuser@example.com',
          password: 'newUserPass123'
        });
        
      expect(res.statusCode).to.equal(200);
      expect(res.body.msg).to.equal('User registered successfully');
    });
  
    it('should not register a user with an invalid email', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          email: 'not-an-email',
          password: 'somePassword123'
        });
        
      expect(res.statusCode).to.equal(400);
      expect(res.body.errors[0].msg).to.equal('Please include a valid email');
    });
  
    it('should not register a user with a short password', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          email: 'shortpassword@example.com',
          password: '123'
        });
        
      expect(res.statusCode).to.equal(400);
      expect(res.body.errors[0].msg).to.equal('Password must be 6 or more characters');
    });
  
    it('should return validation errors for missing fields', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          email: '',
          password: ''
        });
        
      expect(res.statusCode).to.equal(400);
      expect(res.body.errors.length).to.equal(2); // One for email, one for password
      expect(res.body.errors[0].msg).to.equal('Please include a valid email');
      expect(res.body.errors[1].msg).to.equal('Password must be 6 or more characters');
    });
  });