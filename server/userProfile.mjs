import { check, validationResult } from 'express-validator';
import { db } from './database/database.mjs';

// Validation rules for user profile
export const validateUserProfile = [
  check('email').isString().isLength({ max: 50 }),
  check('fullName').isString().isLength({ min: 1, max: 50 }).withMessage('Full name must be between 1 and 50 characters.'),
  check('address1').isString().isLength({ max: 100 }).withMessage('Address1 must not exceed 100 characters.'),
  check('city').isString().isLength({ max: 50 }).withMessage('City must not exceed 50 characters.'),
  check('state').isString().isLength({ min: 2, max: 2 }).withMessage('State must be exactly 2 characters.'),
  check('zipCode').isPostalCode('US').withMessage('Invalid ZIP code format.'),
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
export const getUserProfileByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM UserProfile WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "An error occurred while fetching the profile" });
  }
};

// Create a new user profile
export const createUserProfile = async (profileData) => {
  const { email, fullName, address1, address2, city, state, zipCode, skills, preferences, availability } = profileData;

  try {
    await db.query(
      "INSERT INTO UserProfile (email, full_name, address1, address2, city, state_code, zip_code, skills, preferences, availability) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [email, fullName, address1, address2, city, state, zipCode, JSON.stringify(skills), JSON.stringify(preferences), JSON.stringify(availability)]
    );

    return profileData;
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw new Error("An error occurred while creating the profile");
  }
};

export const updateUserProfileByEmail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.params;
  const { fullName, address1, address2, city, state, zipCode, skills, preferences, availability } = req.body;

  try {
    // Check if the user profile exists
    const [rows] = await db.query("SELECT * FROM UserProfile WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update the profile with new values (or keep existing values if not provided)
    await db.query(
      `UPDATE UserProfile
       SET full_name = COALESCE(?, fullName),
           address1 = COALESCE(?, address1),
           address2 = COALESCE(?, address2),
           city = COALESCE(?, city),
           state_code = COALESCE(?, state),
           zip_code = COALESCE(?, zipCode),
           skills = COALESCE(?, skills),
           preferences = COALESCE(?, preferences),
           availability = COALESCE(?, availability)
       WHERE email = ?`,
      [fullName, address1, address2, city, state, zipCode, JSON.stringify(skills), JSON.stringify(preferences), JSON.stringify(availability), email]
    );

    const [updatedProfile] = await db.query("SELECT * FROM UserProfile WHERE email = ?", [email]);

    res.status(200).json({ message: "Profile updated successfully", profile: updatedProfile[0] });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "An error occurred while updating the profile" });
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