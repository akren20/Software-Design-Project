import jwt from 'jsonwebtoken';
import { db } from './database/database.mjs';

const JWT_SECRET = 'asdffdsa';

export const authenticateToken = (req, res, next) => {
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

export const authorizeAdmin = async (req, res, next) => {
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

export const generateToken = (user) => {
    return jwt.sign(
        { 
            email: user.email,
            role: user.role || 'user'
        },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};