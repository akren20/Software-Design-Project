import React, { createContext, useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';

// Create a Context for authentication
const AuthContext = createContext();

// Create a custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state
  const navigate = useNavigate();

  const login = () => {
    setIsLoggedIn(true); // Logic to log in (e.g., API call can go here)
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    setIsLoggedIn(false);
    localStorage.clear();
    navigate('/login'); };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
