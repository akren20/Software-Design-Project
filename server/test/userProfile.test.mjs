import request from 'supertest';
import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.mjs';

chai.use(chaiHttp);
const { expect } = chai;

describe('User Profile API', () => {
  let token;

  // Before all tests, log in to get a token for authentication
  before((done) => {
    chai.request(server)
      .post('/login')
      .send({ email: 'arenaud@uh.edu', password: 'password123' })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  describe('GET /profile/:email', () => {
    it('should get the profile of a logged-in user', (done) => {
      chai.request(server)
        .get('/profile/arenaud@uh.edu')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('email', 'arenaud@uh.edu');
          done();
        });
    });

    it('should return 404 for a non-existent user', (done) => {
      chai.request(server)
        .get('/profile/nonexistent@example.com')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message', 'Profile not found');
          done();
        });
    });
  });

  describe('POST /profile/:email', () => {
    it('should update an existing user profile', (done) => {
      chai.request(server)
        .post('/profile/arenaud@uh.edu')
        .set('Authorization', `Bearer ${token}`)
        .send({ fullName: 'Updated Name' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Profile updated successfully');
          expect(res.body.profile).to.have.property('fullName', 'Updated Name');
          done();
        });
    });
  });

  describe('DELETE /profile/:email', () => {
    it('should delete a user profile', (done) => {
      chai.request(server)
        .delete('/profile/arenaud@uh.edu')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Profile deleted successfully');
          done();
        });
    });
  });
});