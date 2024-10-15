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
    loginUser
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

app.post('/register', validateRegistration, registerUser);
app.post('/login', validateLogin, loginUser);

app.get('/user-profiles', getAllUserProfiles); // Get all profiles
app.get('/profile/:id', getUserProfileByEmail); // Get a profile by email
app.post('/profile', validateUserProfile, createUserProfile); // Create a new profile
app.put('/profile/:id', validateUserProfile, updateUserProfileByEmail); // Update a profile by ID
app.delete('/profile/:id', deleteUserProfileByEmail); // Delete a profile by ID

// Default route
app.use((req, res) => {
    res.status(200).send('Hello, world!');
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});

export default app;