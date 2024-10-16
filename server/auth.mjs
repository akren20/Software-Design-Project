import { check, validationResult } from 'express-validator';
//import UserProfile from '../client/src/pages/UserProfile';

const users = [
    { email: 'arenaud@uh.edu', password: 'arenaud' },
    { email: 'aalmasri@uh.edu', password: 'aalmasri' },
    { email: 'bdiaz@uh.edu', password: 'bdiazzz' },
    { email: 'wlamberth@uh.edu', password: 'wlamberth' },
    { email: 'admin@example.edu', password: 'adminPass123' },
    { email: 'volunteer@example.com', password: 'volunteer2024' }
];

export const validateRegistration = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
];

// Middleware for validating login data
export const validateLogin = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

// Function to handle user registration
export const registerUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  // Simulate registering a new user (we would save to DB here)
  users.push({ email, password });

  res.json({ msg: 'User registered successfully' });
};

// Function to handle user login
export const loginUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  // Simulate user authentication (you would check with DB here)
  const user = users.find(user => user.email === email && user.password === password);

  if (!user) {
    return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
  }

  // Simulate generating a token (JWT, etc.)
  res.json({ token: 'fake-jwt-token', msg: 'Login successful'});
};
