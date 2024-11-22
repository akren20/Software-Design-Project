import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './database/database.mjs';
import {
    validateEvent,
    createOrUpdateEvent,
    getAllEvents,
    getEventByName,
    deleteEventByName
} from './events.mjs';
import {
    validateEventUser,
    createEventUser,
    getUsersByEvent,
    getEventsByUser,
    deleteEventUser
} from './EventUsers.mjs';
import {
    validateVolunteerHistoryEntry,
    createOrUpdateVolunteerHistoryEntry,
    getVolunteerHistory,
    getVolunteerHistoryByEventName,
    getVolunteerHistoryByEmail,
    deleteVolunteerHistoryByEventName
} from './volunteerhistory.mjs';
import {
    validateNotification,
    getNotificationsByUser,
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
export const JWT_SECRET = 'asdffdsa';
const PORT = process.env.PORT || 8080;

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Source', 'Accept', 'Accept-Encoding', 'Accept-Language'],
    exposedHeaders: ['Content-Type'],
    credentials: true,
    optionsSuccessStatus: 200
  };

// Basic middleware - order is important
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Force JSON for API routes
app.use('/api', (req, res, next) => {
  res.set('Content-Type', 'application/json');
  next();
});

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
        const [user] = await db.query(
            'SELECT email FROM UserCredentials WHERE email = ?',
            [req.user.email]
        );

        const adminEmails = ['admin@example.edu', 'wyatt@admin.com'];

        if (!user.length || !adminEmails.includes(user[0].email)) {
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

// Authentication routes (unprotected) - support both paths for backward compatibility
app.post(['/signup', '/api/signup'], validateRegistration, registerUser);
app.post(['/login', '/api/login'], validateLogin, loginUser);
app.post(['/admin/register', '/api/admin/register'], validateAdminRegistration, registerUser);

// Auth status routes
app.get(['/auth/status', '/api/auth/status'], authenticateToken, (req, res) => {
    res.json({
        isAuthenticated: true,
        user: {
            email: req.user.email,
            role: ['admin@example.edu', 'wyatt@admin.com'].includes(req.user.email) ? 'admin' : 'user'
        }
    });
});

// Admin dashboard route
app.get(['/admin/dashboard', '/api/admin/dashboard'], authenticateToken, authorizeAdmin, (req, res) => {
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

// Event routes
app.get('/api/events', async (req, res) => {
    console.log('GET /api/events endpoint hit');
    try {
        await getAllEvents(req, res);
    } catch (error) {
        console.error('Error in GET /api/events:', error);
        res.status(500).json({ 
            message: 'Error retrieving events',
            error: error.message 
        });
    }
});

app.post('/api/events', authenticateToken, validateEvent, async (req, res) => {
    try {
        await createOrUpdateEvent(req, res);
    } catch (error) {
        console.error('Error in POST /api/events:', error);
        res.status(500).json({ 
            message: 'Error creating/updating event',
            error: error.message 
        });
    }
});

app.get('/api/events/:eventName', async (req, res) => {
    try {
        await getEventByName(req, res);
    } catch (error) {
        console.error('Error in GET /api/events/:eventName:', error);
        res.status(500).json({ 
            message: 'Error retrieving event',
            error: error.message 
        });
    }
});

app.delete('/api/events/:eventName', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        await deleteEventByName(req, res);
    } catch (error) {
        console.error('Error in DELETE /api/events/:eventName:', error);
        res.status(500).json({ 
            message: 'Error deleting event',
            error: error.message 
        });
    }
});

// Volunteer history routes
app.get('/api/volunteer-history', authenticateToken, async (req, res) => {
    try {
        await getVolunteerHistory(req, res);
    } catch (error) {
        console.error('Error in GET /api/volunteer-history:', error);
        res.status(500).json({ 
            message: 'Error retrieving volunteer history',
            error: error.message 
        });
    }
});

app.post('/api/volunteer-history', authenticateToken, validateVolunteerHistoryEntry, async (req, res) => {
    try {
        await createOrUpdateVolunteerHistoryEntry(req, res);
    } catch (error) {
        console.error('Error in POST /api/volunteer-history:', error);
        res.status(500).json({ 
            message: 'Error creating/updating volunteer history',
            error: error.message 
        });
    }
});

app.get('/api/volunteer-history/event/:eventName', authenticateToken, async (req, res) => {
    try {
        await getVolunteerHistoryByEventName(req, res);
    } catch (error) {
        console.error('Error in GET /api/volunteer-history/event/:eventName:', error);
        res.status(500).json({ 
            message: 'Error retrieving volunteer history by event',
            error: error.message 
        });
    }
});

app.get('/api/volunteer-history/user/:email', authenticateToken, async (req, res) => {
    try {
        await getVolunteerHistoryByEmail(req, res);
    } catch (error) {
        console.error('Error in GET /api/volunteer-history/user/:email:', error);
        res.status(500).json({ 
            message: 'Error retrieving volunteer history by email',
            error: error.message 
        });
    }
});

app.delete('/api/volunteer-history/:eventName', authenticateToken, async (req, res) => {
    try {
        await deleteVolunteerHistoryByEventName(req, res);
    } catch (error) {
        console.error('Error in DELETE /api/volunteer-history/:eventName:', error);
        res.status(500).json({ 
            message: 'Error deleting volunteer history',
            error: error.message 
        });
    }
});

// Notification routes
app.get('/notifications/:userEmail', getNotificationsByUser);
app.post('/notifications', validateNotification, createNotification);

app.delete('/notifications/:id', deleteNotificationById);
/*app.get('/notifications', authenticateToken,getNotificationsByUser);
app.post('/notifications', authenticateToken,validateNotification, createNotification);
app.delete('/notifications/:id', authenticateToken,deleteNotificationById);*/

// User profile routes
app.get('/api/profiles', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        await getAllUserProfiles(req, res);
    } catch (error) {
        console.error('Error in GET /api/profiles:', error);
        res.status(500).json({ 
            message: 'Error retrieving profiles',
            error: error.message 
        });
    }
});

app.get('/api/profile/:email', authenticateToken, async (req, res) => {
    try {
        await getUserProfileByEmail(req.params.email, res);
    } catch (error) {
        console.error('Error in GET /api/profile/:email:', error);
        res.status(500).json({ 
            message: 'Error retrieving profile',
            error: error.message 
        });
    }
});

app.post('/api/profile', authenticateToken, validateUserProfile, async (req, res) => {
    try {
        await createUserProfile(req.body);
        res.status(201).json({ message: 'Profile created successfully' });
    } catch (error) {
        console.error('Error in POST /api/profile:', error);
        res.status(500).json({ 
            message: 'Error creating profile',
            error: error.message 
        });
    }
});

app.put('/api/profile/:email', authenticateToken, validateUserProfile, async (req, res) => {
    try {
        await updateUserProfileByEmail(req.params.email, req.body);
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error in PUT /api/profile/:email:', error);
        res.status(500).json({ 
            message: 'Error updating profile',
            error: error.message 
        });
    }
});

app.delete('/api/profile/:email', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        await deleteUserProfileByEmail(req.params.email);
        res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error) {
        console.error('Error in DELETE /api/profile/:email:', error);
        res.status(500).json({ 
            message: 'Error deleting profile',
            error: error.message 
        });
    }
});

app.delete('/api/credentials/:email', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        await deleteUserCredentialsByEmail(req.params.email);
        res.status(200).json({ message: 'Credentials deleted successfully' });
    } catch (error) {
        console.error('Error in DELETE /api/credentials/:email:', error);
        res.status(500).json({ 
            message: 'Error deleting credentials',
            error: error.message 
        });
    }
});

// Protected profile route
app.get('/api/profile', authenticateToken, async (req, res) => {
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
                stateCode: '',
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

// EventUsers routes
app.post('/api/event-users', authenticateToken, validateEventUser, createEventUser);
app.get('/api/event-users/event/:event_id', authenticateToken, getUsersByEvent);
app.get('/api/event-users/user/:email', authenticateToken, getEventsByUser);
app.delete('/api/event-users/:event_id/:email', authenticateToken, deleteEventUser);

// Event matching routes
app.use('/api', authenticateToken, eventMatchingRoutes);

// Error handling middleware for API routes
app.use('/api', (err, req, res, next) => {
    console.error('API Error:', err);
    res.status(500).json({ 
        message: 'API Error',
        error: err.message 
    });
});

// Serve static files in production - This must come AFTER all API routes
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
} else {
    // Development 404 handler
    app.use((req, res) => {
        res.status(404).json({ 
            message: 'Route not found',
            path: req.path 
        });
    });
}

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
    console.log('Press Ctrl+C to quit.');
});

// Handle server errors
server.on('error', (error) => {
    console.error('Server error:', error);
});

export default app;