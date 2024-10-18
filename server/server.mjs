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
} from './events.mjs';
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
import eventMatchingRoutes from './eventMatching.mjs'; // Event matching functionality


const app = express();
app.use(bodyParser.json());
app.use(cors());

// Event management routes
app.post('/events', validateEvent, createOrUpdateEvent);
app.get('/events', getAllEvents);
app.get('/events/:eventName', getEventByName);
app.delete('/events/:eventName', deleteEventByName);

// Volunteer history routes
app.post('/volunteer-history', validateVolunteerHistoryEntry, createOrUpdateVolunteerHistoryEntry);
app.get('/volunteer-history', getVolunteerHistory);
app.get('/volunteer-history/:eventName', getVolunteerHistoryByEventName);
app.delete('/volunteer-history/:eventName', deleteVolunteerHistoryByEventName);

// Notification routes
app.get('/notifications', getAllNotifications);
app.post('/notifications', validateNotification, createNotification);
app.delete('/notifications/:id', deleteNotificationById);

// Authentication routes
app.post('/register', validateRegistration, registerUser);
app.post('/login', validateLogin, loginUser);

// User profile routes
app.get('/user-profiles', getAllUserProfiles);
app.get('/profile/:id', getUserProfileByEmail);
app.post('/profile', validateUserProfile, createUserProfile);
app.put('/profile/:id', validateUserProfile, updateUserProfileByEmail);
app.delete('/profile/:id', deleteUserProfileByEmail);

// Event matching routes
app.use('/api', eventMatchingRoutes); // Changed from '/api/matching' to '/api'


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
