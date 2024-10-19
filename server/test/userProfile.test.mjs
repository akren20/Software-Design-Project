import request from 'supertest';
import { expect } from 'chai';
import app from '../server.mjs';

describe('User Profile API', () => {
  let token;

  // Before all tests, log in to get a token for authentication
  before((done) => {
    request(app)
      .post('/login')
      .send({ email: 'arenaud@uh.edu', password: 'password123' })
      .end((err, res) => {
        if (err) return done(err);
        token = res.body.token;
        done();
      });
  });

  describe('GET /profile/:email', () => {
    it('should get the profile of a logged-in user', (done) => {
      request(app)
        .get('/profile/arenaud@uh.edu')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('email', 'arenaud@uh.edu');
          done();
        });
    });

    it('should return 404 for a non-existent user', (done) => {
      request(app)
        .get('/profile/nonexistent@example.com')
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'Profile not found');
          done();
        });
    });
  });

  describe('POST /profile/:email', () => {
    /*it('should update an existing user profile', (done) => {
      request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ fullName: 'Updated Name' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'Profile updated successfully');
          expect(res.body.profile).to.have.property('fullName', 'Updated Name');
          done();
        });
    });*/
  });

  describe('DELETE /profile/:email', () => {
    it('should delete a user profile', (done) => {
      request(app)
        .delete('/profile/arenaud@uh.edu')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'Profile deleted successfully');
          done();
        });
    });
  });
});