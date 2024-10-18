// server.mjs
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {
    validateEvent,
    createOrUpdateEvent,
    getAllEvents,
    getEventByName,
    deleteEventByName
} from './events.mjs'; // Import the event handlers

import {
    validateVolunteerHistoryEntry,
    createOrUpdateVolunteerHistoryEntry,
    getVolunteerHistory,
    getVolunteerHistoryByEventName,
    deleteVolunteerHistoryByEventName
} from './volunteerhistory.mjs';

import {
    validateNotification,
    getAllNotifications,
    createNotification,
    deleteNotificationById
} from './notification.mjs';

import {
    validateRegistration,
    validateLogin,
    registerUser,
    loginUser, 
    getAllUsers
} from './auth.mjs';

import {
    validateUserProfile,
    getAllUserProfiles,
    getUserProfileByEmail,
    createUserProfile,
    updateUserProfileByEmail,
    deleteUserProfileByEmail
} from './userProfile.mjs';

const app = express();

app.use(bodyParser.json());
app.use(cors());

const JWT_SECRET = 'your_secret_key';

// Route definitions
app.post('/events', validateEvent, createOrUpdateEvent);
app.get('/events', getAllEvents);
app.get('/events/:eventName', getEventByName);
app.delete('/events/:eventName', deleteEventByName);

app.post('/volunteer-history', validateVolunteerHistoryEntry, createOrUpdateVolunteerHistoryEntry);
app.get('/volunteer-history', getVolunteerHistory);
app.get('/volunteer-history/:eventName', getVolunteerHistoryByEventName);
app.delete('/volunteer-history/:eventName', deleteVolunteerHistoryByEventName);

app.get('/notifications', getAllNotifications);
app.post('/notifications', validateNotification, createNotification);
app.delete('/notifications/:id', deleteNotificationById);

app.post('/signup', validateRegistration, registerUser);
app.post('/login', validateLogin, loginUser);
app.post('/signup', registerUser);

app.post('/register', (req, res) => {
    const { email, password } = req.body;
  
    // (Add validation and user existence check)
  
    const newUser = { email, password }; // Store the new user
    // (Add logic to save user in a database or memory store)
  
    // Generate a JWT token
    const token = jwt.sign({ email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });
  
    // Send the token in response
    res.status(201).json({ message: 'User registered successfully', token });
  });
  
  // Middleware to authenticate token
  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

app.get('/users', getAllUsers);

app.get('/profiles', getAllUserProfiles); // Get all profiles
app.get('/profile/:email', getUserProfileByEmail); // Get profile by email
app.post('/profile', validateUserProfile, createUserProfile); // Create a new profile
app.post('/profile/:email', validateUserProfile, updateUserProfileByEmail); // Update a profile by email
app.delete('/profile/:email', deleteUserProfileByEmail); // Delete a profile by email
app.get('/profile', (req, res) => {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: 'Unauthorized access. Please log in.' });
    }
  
    const userEmail = req.user.email;
    const profile = getUserProfileByEmail(userEmail);
    
    if (profile) {
      // If the profile exists, return it
      res.json(profile);
    } else {
      // If the profile does not exist, create a new empty profile
      const newProfile = {
        email: userEmail,
        fullName: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zipCode: "",
        skills: [],
        preferences: "",
        availability: []
      };
      
      // Call createUserProfile to add the new profile
      createUserProfile(newProfile);
      
      // Return the newly created profile
      res.status(201).json(newProfile);
    }
  });

// Default route
app.use((req, res) => {
    res.status(200).send('Hello, this route is undefined');
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});

export default app;