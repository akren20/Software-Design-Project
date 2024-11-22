import { check, validationResult } from 'express-validator';
import { db } from './database/database.mjs';

// Validation rules for user profile
export const validateUserProfile = [
  check('email').isString().isLength({ max: 50 }),
  check('full_name').isString().isLength({ min: 1, max: 50 }).withMessage('Full name must be between 1 and 50 characters.'),
  check('address1').isString().isLength({ max: 100 }).withMessage('Address1 must not exceed 100 characters.'),
  check('city').isString().isLength({ max: 50 }).withMessage('City must not exceed 50 characters.'),
  check('state_code').isString().isLength({ min: 2, max: 13 }),
  check('zip_code').isPostalCode('US').withMessage('Invalid ZIP code format.'),
  check('skills').isArray().withMessage('Skills must be an array of strings.'),
  check('preferences').isString().optional().withMessage('Preferences must be a string.'),
  check('availability').isArray().withMessage('Availability must be an array of dates.'),
];

// Get all user profiles
export const getAllUserProfiles = async (req, res) => {
  try {
    const [profiles] = await db.query('SELECT * FROM UserProfile');
    res.status(200).json(profiles);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving this users profile', error });
  }
};

// Get a specific user profile by email
export const getUserProfileByEmail = async (email) => {
  console.log('Searching for user profile with email:', email);
  try {
    const [rows] = await db.query(
      "SELECT * FROM UserProfile WHERE email = ?",
      [email]
    );

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Create a new user profile
export const createUserProfile = async (profileData) => {
  const { 
    email, 
    full_name, 
    address1, 
    address2, 
    city, 
    state_code, 
    zip_code, 
    skills, 
    preferences = '', // Default to empty string if undefined
    availability = [] // Default to empty array if undefined
  } = profileData;

  try {
    if (!email) {
      throw new Error("Email is required");
    }

    const [result] = await db.query(
      "INSERT INTO UserProfile (email, full_name, address1, address2, city, state_code, zip_code, skills, preferences, availability) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        email, 
        full_name, 
        address1, 
        address2, 
        city, 
        state_code, 
        zip_code, 
        skills ? JSON.stringify(skills) : '[]', // Ensure skills is a valid JSON string
        preferences ? JSON.stringify(preferences): '[]', // Ensure preferences is a string
        availability ? JSON.stringify(availability) : '[]' // Ensure availability is a valid JSON string
      ]
    );

    return { message: "Profile created successfully", id: result.insertId };
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

export const updateUserProfileByEmail = async (email, profileData) => {
  const { 
    full_name, 
    address1, 
    address2, 
    city, 
    state_code, 
    zip_code, 
    skills, 
    preferences = '', 
    availability = [] 
  } = profileData;

  try {
    // Check if the user profile exists
    const [rows] = await db.query("SELECT * FROM UserProfile WHERE email = ?", [email]);
    if (rows.length === 0) {
      throw new Error("Profile not found");
    }

    // Update the profile with new values (or keep existing values if not provided)
    await db.query(
      `UPDATE UserProfile
       SET full_name  = COALESCE(?, full_name),
           address1 = COALESCE(?, address1),
           address2 = COALESCE(?, address2),
           city = COALESCE(?, city),
           state_code = COALESCE(?, state_code),
           zip_code = COALESCE(?, zip_code),
           skills = COALESCE(CAST(? AS JSON), skills),
          preferences = COALESCE(CAST(? AS JSON), preferences),
          availability = COALESCE(CAST(? AS JSON), availability)
       WHERE email = ?`,
      [
        full_name, 
        address1, 
        address2, 
        city, 
        state_code, 
        zip_code, 
        JSON.stringify(skills || null),         // Convert to JSON if applicable
        JSON.stringify(preferences || null),
        JSON.stringify(availability || null),
        email
      ]
    );
    
    const [updatedProfile] = await db.query("SELECT * FROM UserProfile WHERE email = ?", [email]);

    return { message: "Profile updated successfully", profile: updatedProfile[0] };
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const deleteUserProfileByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    // Check if the profile exists
    const [rows] = await db.query("SELECT * FROM UserProfile WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Delete the profile
    await db.query("DELETE FROM UserProfile WHERE email = ?", [email]);

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ message: "An error occurred while deleting the profile" });
  }
};

export const deleteUserCredentialsByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    // Check if the credentials exist for the given email
    const [rows] = await db.query("SELECT * FROM UserCredentials WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Credentials not found" });
    }

    // Delete the credentials
    await db.query("DELETE FROM UserCredentials WHERE email = ?", [email]);

    res.status(200).json({ message: "Credentials deleted successfully" });
  } catch (error) {
    console.error("Error deleting credentials:", error);
    res.status(500).json({ message: "An error occurred while deleting the credentials" });
  }
};
