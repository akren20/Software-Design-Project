import request from 'supertest';
import { expect } from 'chai';
import app from '../server.mjs';

describe('Auth API', () => {
  describe('POST /signup', () => {
    it('should signup a new user successfully', (done) => {
      request(app)
        .post('/signup')
        .send({ email: 'testuser@example.com', password: 'password123' })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'User registered successfully');
          done();
        });
    });

    it('should fail registration with existing email', (done) => {
      request(app)
        .post('/signup')
        .send({ email: 'arenaud@uh.edu', password: 'password123' }) // Using an existing email
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'Email already exists');
          done();
        });
    });
  });

  describe('POST /login', () => {
    it('should login an existing user successfully', (done) => {
      request(app)
        .post('/login')
        .send({ email: 'arenaud@uh.edu', password: 'password123' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('token');
          done();
        });
    });

    it('should fail login with invalid credentials', (done) => {
      request(app)
        .post('/login')
        .send({ email: 'nonexistent@example.com', password: 'wrongpassword' })
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'Invalid credentials');
          done();
        });
    });
  });
});