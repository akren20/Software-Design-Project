import { check, validationResult } from 'express-validator';

// Hardcoded user profile data
let userProfiles = [
    {
      id: 1,
      fullName: "Ashley Smith",
      address1: "123 Main St",
      address2: "Apt 4B",
      city: "Houston",
      state: "TX",
      zipCode: "77001",
      skills: ["Communication", "Leadership"],
      preferences: "Remote work",
      availability: ["2024-10-08", "2024-10-12"],
    },
    {
      id: 2,
      fullName: "James Johnson",
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
      id: 3,
      fullName: "Maria Garcia",
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
      id: 4,
      fullName: "Michael Davis",
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
      id: 5,
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
      id: 6,
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
      id: 7,
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
      id: 8,
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
      id: 9,
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
      id: 10,
      fullName: "Ethan Thomas",
      address1: "707 Spruce Blvd",
      address2: "",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      skills: ["Communication", "Project Management"],
      preferences: "Hybrid work",
      availability: ["2024-10-05", "2024-10-14"],
    }
  ];  

// Validation rules for user profile
export const validateUserProfile = [
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
export const getAllUserProfiles = (req, res) => {
  res.status(200).json(userProfiles);
};

// Get a specific user profile by ID
export const getUserProfileById = (req, res) => {
  const { id } = req.params;
  const profile = userProfiles.find(p => p.id === parseInt(id));

  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  res.status(200).json(profile);
};

// Create a new user profile
export const createUserProfile = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, address1, address2, city, state, zipCode, skills, preferences, availability } = req.body;

  const newUserProfile = {
    id: userProfiles.length + 1,
    fullName,
    address1,
    address2,
    city,
    state,
    zipCode,
    skills,
    preferences,
    availability,
  };

  userProfiles.push(newUserProfile);
  res.status(201).json({ message: "Profile created successfully", profile: newUserProfile });
};

// Update an existing user profile by ID
export const updateUserProfileById = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const profileIndex = userProfiles.findIndex(p => p.id === parseInt(id));

  if (profileIndex === -1) {
    return res.status(404).json({ message: "Profile not found" });
  }

  const { fullName, address1, address2, city, state, zipCode, skills, preferences, availability } = req.body;

  // Update the profile with the new values
  userProfiles[profileIndex] = {
    ...userProfiles[profileIndex],
    fullName,
    address1,
    address2,
    city,
    state,
    zipCode,
    skills,
    preferences,
    availability,
  };

  res.status(200).json({ message: "Profile updated successfully", profile: userProfiles[profileIndex] });
};

// Delete a user profile by ID
export const deleteUserProfileById = (req, res) => {
  const { id } = req.params;
  const profileIndex = userProfiles.findIndex(p => p.id === parseInt(id));

  if (profileIndex === -1) {
    return res.status(404).json({ message: "Profile not found" });
  }

  userProfiles.splice(profileIndex, 1);
  res.status(200).json({ message: "Profile deleted successfully" });
};