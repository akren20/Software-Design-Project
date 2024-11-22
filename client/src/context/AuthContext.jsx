import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                // Ensure isAdmin is set based on role
                parsedUser.isAdmin = parsedUser.role.toLowerCase() === 'admin';
                setUser(parsedUser);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error parsing saved user:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    }, []);

    const login = (userData, token) => {
        // Ensure isAdmin is set based on role
        const updatedUserData = {
            ...userData,
            role: userData.role || "user",
            isAdmin: userData.role.toLowerCase() === 'admin'
        };
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        
        setUser(updatedUserData);
        setIsAuthenticated(true);

        // Redirect based on user role
        if (updatedUserData.isAdmin) {
            navigate('/admin/dashboard');
        } else {
            navigate('api/profile');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ 
            user,
            setUser,
            isAuthenticated,
            login,
            logout,
            isAdmin: user?.isAdmin || false
        }}>
            {children}
        </AuthContext.Provider>
    );
};