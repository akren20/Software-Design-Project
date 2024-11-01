import { check, validationResult } from 'express-validator';
import { createUserProfile } from './userProfile.mjs';
import db from "./server.mjs"

const users = [
    { email: 'arenaud@uh.edu', password: 'arenaud' },
    { email: 'aalmasri@uh.edu', password: 'aalmasri' },
    { email: 'bdiaz@uh.edu', password: 'bdiazzz' },
    { email: 'wlamberth@uh.edu', password: 'wlamberth' },
    { email: 'admin@example.edu', password: 'adminPass123' },
    { email: 'volunteer@example.com', password: 'volunteer2024' }
];

export const getAllUsers = (req, res) => {
  const sql = "SELECT * FROM UserCredentials"; // Adjust this to your actual table name
  
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed', details: err });
    }
    res.status(200).json(data); // Send the database data as JSON
  });
};

export const validateRegistration = [
  check('email').isEmail().withMessage('Please include a valid email'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
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

  const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Add the new user
    users.push({ email, password });

    const emptyProfile = {
      email: email,
      fullName: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      skills: [],
      preferences: "", //change to []
      availability: []
  };
  createUserProfile({ body: emptyProfile }, res);

  res.status(201).json({ message: 'User registered successfully' });
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