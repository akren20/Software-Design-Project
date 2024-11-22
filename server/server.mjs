// server.mjs
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { db } from './database/database.mjs';
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
    validateAdminRegistration,
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
    deleteUserProfileByEmail,
    deleteUserCredentialsByEmail
} from './userProfile.mjs';
import eventMatchingRoutes from './eventMatching.mjs';

const app = express();
export const JWT_SECRET = 'asdffdsa';
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

const authorizeAdmin = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        // Verify admin status from database
        const [user] = await db.query(
            `SELECT r.role_name 
             FROM UserCredentials u
             JOIN Roles r ON u.role_id = r.role_id
             WHERE u.email = ?`,
            [req.user.email]
        );

        if (!user.length || (user[0].role_name !== 'Admin' && user[0].role_name !== 'admin')) {
            return res.status(403).json({ 
                message: 'Access denied: Admin privileges required'
            });
        }

        next();
    } catch (error) {
        console.error('Admin verification failed:', error);
        return res.status(500).json({ message: 'Error verifying admin status' });
    }
};

// Authentication routes (unprotected)
app.post('/signup', validateRegistration, registerUser);
app.post('/login', validateLogin, loginUser);
app.post('/admin/register', validateAdminRegistration, registerUser);

// Check auth status route
app.get('/auth/status', authenticateToken, (req, res) => {
    res.json({
        isAuthenticated: true,
        user: {
            email: req.user.email,
            role: req.user.role
        }
    });
});

// Admin routes
app.get('/admin/dashboard', authenticateToken, authorizeAdmin, (req, res) => {
    res.status(200).json({
        message: 'Welcome to the admin dashboard',
        adminEmail: req.user.email,
        access: 'full',
        features: [
            'User Management',
            'Event Management',
            'System Settings',
            'Analytics'
        ]
    });
});
app.use('/api', authenticateToken, eventMatchingRoutes);

// Event routes
app.post('/events', authenticateToken, validateEvent, createOrUpdateEvent);
app.get('/events', getAllEvents);
app.get('/events/:eventName', getEventByName);
app.delete('/events/:eventName', authenticateToken, deleteEventByName);

// Volunteer history routes
app.post('/volunteer-history', authenticateToken, validateVolunteerHistoryEntry, createOrUpdateVolunteerHistoryEntry);
app.get('/volunteer-history', authenticateToken, getVolunteerHistory);
app.get('/volunteer-history/:eventName', authenticateToken, getVolunteerHistoryByEventName);
app.delete('/volunteer-history/:eventName', authenticateToken, deleteVolunteerHistoryByEventName);

// Notification routes
app.get('/notifications', authenticateToken, getAllNotifications);
app.post('/notifications', authenticateToken, validateNotification, createNotification);
app.delete('/notifications/:id', authenticateToken, deleteNotificationById);

// User profile routes
app.get('/profiles', authenticateToken, authorizeAdmin, getAllUserProfiles);
app.get('/profile/:email', authenticateToken, getUserProfileByEmail);
app.post('/profile', authenticateToken, validateUserProfile, createUserProfile);
app.put('/profile/:email', authenticateToken, validateUserProfile, updateUserProfileByEmail);
app.delete('/profile/:email', authenticateToken, authorizeAdmin, deleteUserProfileByEmail);
app.delete('/credentials/:email', authenticateToken, authorizeAdmin, deleteUserCredentialsByEmail);

// Protected profile route
app.get('/profile', authenticateToken, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const profile = await getUserProfileByEmail(userEmail);
        
        if (profile) {
            res.json(profile);
        } else {
            const newProfile = {
                email: userEmail,
                fullName: '',
                address1: '',
                address2: '',
                city: '',
                state: '',
                zipCode: '',
                skills: [],
                preferences: '',
                availability: []
            };
            
            const createdProfile = await createUserProfile(newProfile);
            res.status(201).json(createdProfile);
        }
    } catch (error) {
        console.error("Error handling profile request:", error);
        res.status(500).json({ message: "Error processing profile request" });
    }
});

// Event matching routes
app.use('/api', authenticateToken, eventMatchingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});

export default app;