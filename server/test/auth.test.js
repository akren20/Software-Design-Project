import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const { expect } = chai;
describe('Auth API', () => {
    describe('POST /signup', () => {
      it('should register a new user successfully', (done) => {
        chai.request(server)
          .post('/signup')
          .send({ email: 'testuser@example.com', password: 'password123' })
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('message', 'User registered successfully');
            done();
          });
      });
  
      it('should fail registration with existing email', (done) => {
        chai.request(server)
          .post('/signup')
          .send({ email: 'arenaud@uh.edu', password: 'password123' }) // Use an existing email
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message', 'Email already exists');
            done();
          });
      });
    });
  
    describe('POST /login', () => {
      it('should login an existing user successfully', (done) => {
        chai.request(server)
          .post('/login')
          .send({ email: 'arenaud@uh.edu', password: 'password123' })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('token');
            done();
          });
      });
  
      it('should fail login with invalid credentials', (done) => {
        chai.request(server)
          .post('/login')
          .send({ email: 'nonexistent@example.com', password: 'wrongpassword' })
          .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('message', 'Invalid credentials');
            done();
          });
      });
    });
  });