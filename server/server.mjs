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

app.get('/users', getAllUsers);

app.get('/profiles', getAllUserProfiles); // Get all profiles
app.get('/profile/:email', getUserProfileByEmail); // Get profile by email
app.post('/profile', validateUserProfile, createUserProfile); // Create a new profile
app.post('/profile/:email', validateUserProfile, updateUserProfileByEmail); // Update a profile by email
app.delete('/profile/:email', deleteUserProfileByEmail); // Delete a profile by email
app.get('/profile', (req, res) => {
    const userEmail = req.user.email;
    const profile = getUserProfileByEmail(userEmail);
    
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ message: 'Profile not found' });
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