import { check, validationResult } from 'express-validator';
import { db } from './database/database.mjs';
import jwt from 'jsonwebtoken';

const ADMIN_CODE = '1234567890';
const JWT_SECRET = 'asdffdsa';

export const getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM UserCredentials");
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({ message: "An error occurred while retrieving users" });
    }
};

export const validateAdminRegistration = [
    check('email').isEmail().withMessage('Please include a valid email'),
    check('password').isLength({ min: 10 }).withMessage('Admin password must be at least 10 characters long'),
    check('adminCode').equals(ADMIN_CODE).withMessage('Invalid admin code')
];

export const validateRegistration = [
    check('email').isEmail().withMessage('Please include a valid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

export const validateLogin = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
];

export const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, adminCode } = req.body;
    
    try {
        // Check if the user already exists
        const [existingUser] = await db.query(
            "SELECT * FROM UserCredentials WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Determine if this is an admin registration
        let role = 'user';
        if (adminCode && adminCode === ADMIN_CODE) {
            role = 'admin';
        }

        // Get the role_id for the specified role
        const [roleResult] = await db.query(
            "SELECT role_id FROM Roles WHERE role_name = ?",
            [role]
        );

        if (roleResult.length === 0) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const role_id = roleResult[0].role_id || "user";

        // Add the new user to the database
        await db.query(
            "INSERT INTO UserCredentials (email, password_hash, role_id) VALUES (?, ?, ?)",
            [email, password, role_id]
        );

        // Insert directly into UserProfile table
        try {
            await db.query(
                `INSERT INTO UserProfile 
                (email, full_name, address1, address2, city, state_code, zip_code, skills, preferences, availability) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    email,
                    "",         // full_name
                    "",         // address1
                    "",         // address2
                    "",         // city
                    "",         // state_code
                    "",         // zip_code
                    "[]",       // skills as empty JSON array
                    "[]",         // preferences
                    "[]"        // availability as empty JSON array
                ]
            );

            // Generate JWT token
            const token = jwt.sign(
                { 
                    email, 
                    role 
                },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.status(201).json({
                message: `${role === 'admin' ? 'Admin' : 'User'} registered successfully`,
                email,
                role,
                token,
                isAdmin: role === 'admin'
            });

        } catch (profileError) {
            console.error("Error creating user profile:", profileError);
            // Even if profile creation fails, return success for the account creation
            const token = jwt.sign(
                { email, role },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.status(201).json({
                message: `${role === 'admin' ? 'Admin' : 'User'} registered successfully, but profile creation failed`,
                email,
                role,
                token,
                isAdmin: role === 'admin',
                warning: "Profile creation failed, please update profile later"
            });
        }
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "An error occurred during registration" });
    }
};

export const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const [user] = await db.query(
            `SELECT u.email, u.password_hash, r.role_name
             FROM UserCredentials u
             JOIN Roles r ON u.role_id = r.role_id
             WHERE u.email = ? AND u.password_hash = ?`,
            [email, password]
        );

        if (user.length === 0) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }

        const token = jwt.sign(
            { 
                email: user[0].email, 
                role: user[0].role_name 
            }, 
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ 
            token,
            user: {
                email: user[0].email,
                role: user[0].role_name,
                isAdmin: user[0].role_name === 'admin'
            },
            msg: 'Login successful'
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: 'An error occurred while logging in', error });
    }
};