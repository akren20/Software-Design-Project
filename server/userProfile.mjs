import { check, validationResult } from 'express-validator';

// Hardcoded user profile data
/*export const userProfiles = [
  {
    email: 'arenaud@uh.edu',
    fullName: "Arianne Renaud",
    address1: "12345 Main St",
    address2: "Apt 4B",
    city: "Houston",
    state: "TX",
    zipCode: "77001",
    skills: ["Communication", "Leadership"],
    preferences: "Remote work",
    availability: ["2024-10-08", "2024-10-12"],
  },
  {
    email: 'aalmasri@uh.edu',
    fullName: "Andrew Almasri",
    address1: "456 Oak Ave",
    address2: "",
    city: "Dallas",
    state: "TX",
    zipCode: "75201",
    skills: ["Technical Writing", "Project Management"],
    preferences: "In-office work",
    availability: ["2024-09-20", "2024-10-15"],
  },
  {
      email: 'bdiaz@uh.edu',
      fullName: "Brendan Diaz",
      address1: "789 Elm St",
      address2: "Suite 5",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      skills: ["Teamwork", "Leadership"],
      preferences: "Hybrid work",
      availability: ["2024-10-05", "2024-10-22"],
    },
    {
      email: 'wlamberth@uh.edu',
      fullName: "Wyatt Lamberth",
      address1: "101 Pine Dr",
      address2: "Apt 8A",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      skills: ["Communication", "Teamwork"],
      preferences: "Remote work",
      availability: ["2024-10-01", "2024-10-18"],
    },
    {
      email: 'ewilson@gmail.com',
      fullName: "Emma Wilson",
      address1: "202 Cedar Ln",
      address2: "Unit 3C",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      skills: ["Project Management", "Leadership"],
      preferences: "In-office work",
      availability: ["2024-09-25", "2024-10-15"],
    },
    {
      email: 'lbrown@gmail.com',
      fullName: "Liam Brown",
      address1: "303 Birch St",
      address2: "",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      skills: ["Technical Writing", "Leadership"],
      preferences: "Hybrid work",
      availability: ["2024-10-02", "2024-10-12"],
    },
    {
      email: 'omartinez@gmail.com',
      fullName: "Olivia Martinez",
      address1: "404 Maple Ave",
      address2: "Floor 2",
      city: "San Francisco",
      state: "CA",
      zipCode: "94101",
      skills: ["Communication", "Teamwork"],
      preferences: "Remote work",
      availability: ["2024-10-06", "2024-10-20"],
    },
    {
      email: 'ntaylor@gmail.com',
      fullName: "Noah Taylor",
      address1: "505 Cherry St",
      address2: "",
      city: "Phoenix",
      state: "AZ",
      zipCode: "85001",
      skills: ["Leadership", "Project Management"],
      preferences: "In-office work",
      availability: ["2024-10-10", "2024-10-18"],
    },
    {
      email: 'aanderson@gmail.com',
      fullName: "Ava Anderson",
      address1: "606 Walnut Rd",
      address2: "Apt 12C",
      city: "Denver",
      state: "CO",
      zipCode: "80201",
      skills: ["Teamwork", "Technical Writing"],
      preferences: "Remote work",
      availability: ["2024-10-03", "2024-10-22"],
    },
    {
      email: 'ethomas@gmail.com',
      fullName: "Ethan Thomas",
      address1: "707 Spruce Blvd",
      address2: "",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      skills: ["Communication", "Project Management"],
      preferences: "Hybrid work",
      availability: ["2024-10-05", "2024-10-14"],
    },
    {
      email: 'admin@example.edu',
      fullName: "Admin User",
      address1: "123 Admin St",
      address2: "",
      city: "Admin City",
      state: "AC",
      zipCode: "12345",
      skills: ["Administration", "Leadership"],
      preferences: "Remote work",
      availability: ["2024-10-15", "2024-10-25"],
    },
    {
      email: 'volunteer@example.com',
      fullName: "Volunteer User",
      address1: "789 Volunteer Rd",
      address2: "",
      city: "Volunteer City",
      state: "VC",
      zipCode: "67890",
      skills: ["Volunteering", "Teamwork"],
      preferences: "On-site work",
      availability: ["2024-10-10", "2024-10-20"],
    }
  ];  */

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
    res.status(500).json({ message: 'Error retrieving this users profile', error });
  }
};

// Get a specific user profile by email
export const getUserProfileByEmail = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: "Email parameter is required." });
  }

  try {
    const [rows] = await db.query('SELECT * FROM userProfile WHERE email = ?', [email]);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    // Log the error for debugging
    console.error('Error retrieving user profile:', error);
    res.status(500).json({ message: 'Error retrieving user profile', error });
  }
};

// Create a new user profile
export const createUserProfile = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, fullName, address1, address2, city, state, zipCode, skills, preferences, availability } = req.body;

    // Check if the email already exists in the database
    const [existingProfiles] = await db.query('SELECT * FROM userProfile WHERE email = ?', [email]);
    if (existingProfiles.length > 0) {
      return res.status(400).json({ message: "Profile with this email already exists" });
    }

    // Insert new user profile into the database
    const sql = `
      INSERT INTO userProfiles (email, fullName, address1, address2, city, state, zipCode, skills, preferences, availability)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const skillString = JSON.stringify(skills || []);
    const availabilityString = JSON.stringify(availability || []);

    await db.query(sql, [
      email,
      fullName || "",
      address1 || "",
      address2 || "",
      city || "",
      state || "",
      zipCode || "",
      skillString,
      preferences || "",
      availabilityString
    ]);

    // Send success response
    res.status(201).json({ message: "Profile created successfully" });
  } catch (error) {
    console.error("Error creating user profile:", error);
    res.status(500).json({ message: "An error occurred while creating the profile", error });
  }
};


// Update an existing user profile by email
export const updateUserProfileByEmail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.params;
  const { fullName, address1, address2, city, state, zipCode, skills, preferences, availability } = req.body;

  // Query to update the user profile in the database
  const sql = `
    UPDATE userProfiles 
    SET 
      fullName = COALESCE(?, fullName), 
      address1 = COALESCE(?, address1), 
      address2 = COALESCE(?, address2), 
      city = COALESCE(?, city), 
      state = COALESCE(?, state), 
      zipCode = COALESCE(?, zipCode), 
      skills = COALESCE(?, skills), 
      preferences = COALESCE(?, preferences), 
      availability = COALESCE(?, availability) 
    WHERE email = ?
  `;

  const values = [fullName, address1, address2, city, state, zipCode, skills, preferences, availability, email];

  try {
    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Fetch updated profile data to return in the response
    const [updatedProfile] = await db.query('SELECT * FROM userProfile WHERE email = ?', [email]);

    res.status(200).json({ message: "Profile updated successfully", profile: updatedProfile[0] });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "An error occurred while updating the profile", error });
  }
};


export const deleteUserProfileByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const [result] = await db.query('DELETE FROM userProfiles WHERE email = ?', [email]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting user profile:", error);
    res.status(500).json({ message: "An error occurred while deleting the profile", error });
  }
};