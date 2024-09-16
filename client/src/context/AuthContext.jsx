import React, { createContext, useContext, useState } from "react";

// Create a Context for authentication
const AuthContext = createContext();

// Create a custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state

  const login = () => {
    setIsLoggedIn(true); // Logic to log in (e.g., API call can go here)
  };

  const logout = () => {
    setIsLoggedIn(false); // Logic to log out
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
