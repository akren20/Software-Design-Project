import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HomePage from "./components/HomePage";
import UserProfile from "./pages/UserProfile";
import AdminDashboard from "./pages/AdminDashboard";
import VolunteerHistory from "./pages/VolunteerHistory"; // Import VolunteerHistory component
import AuthProvider from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/volunteer/history" element={<VolunteerHistory />} /> {/* Volunteer History route */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
