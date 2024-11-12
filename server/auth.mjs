import { check, validationResult } from 'express-validator';
import { createUserProfile } from './userProfile.mjs';
import { db } from './database/database.mjs';

export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM UserCredentials");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: "An error occurred while retrieving users" });
  }
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
export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const [existingUser] = await db.query(
      "SELECT * FROM UserCredentials WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Add the new user to the database
    await db.query(
      "INSERT INTO UserCredentials (email, password_hash) VALUES (?, ?)",
      [email, password] // Note: Store password securely with hashing in production
    );

    // Define the empty profile
    const emptyProfile = {
      email,
      full_name: "",
      address1: "",
      address2: "",
      city: "",
      state_code: "",
      zip_code: "",
      skills: [],
      preferences: [],
      availability: [],
    };

    // Call the createUserProfile function to save the profile
    const newUserProfile = await createUserProfile(emptyProfile);

    return res.status(201).json({
      message: "User registered successfully",
      profile: newUserProfile,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "An error occurred during registration" });
  }
};


// Function to handle user login
export const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const [user] = await db.query('SELECT * FROM UserCredentials WHERE email = ? AND password_hash = ?', [email, password]);

    if (user.length === 0) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    // Generate JWT token for authenticated user with a hardcoded secret key

    res.json({ token:'fake-jwt-token' , msg: 'Login successful' });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: 'An error occurred while logging in', error });
  }
};