import React, { useState, useEffect } from "react";
import EventManagementForm from "./EventManagementForm";
import AdminEventUserAssignment from "./AdminEventUserAssignment";
import "react-calendar/dist/Calendar.css";
import ReportGenerator from "../components/ReportGenerator";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setAuthToken(token);
    }
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex mb-6">
        <button
          onClick={() => handleTabChange("events")}
          className={`px-4 py-2 mr-2 ${
            activeTab === "events" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Event Management
        </button>
        <button
          onClick={() => handleTabChange("volunteer-matching")}
          className={`px-4 py-2 mr-2 ${
            activeTab === "volunteer-matching"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Volunteer Matching
        </button>
        <button
          onClick={() => handleTabChange("reports")}
          className={`px-4 py-2 mr-2 ${
            activeTab === "reports" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Reports
        </button>
      </div>

      <div>
        {activeTab === "events" && <EventManagementForm />}
        {activeTab === "volunteer-matching" && <AdminEventUserAssignment />}
        {activeTab === "reports" && (
          <ReportGenerator isAuthenticated={isAuthenticated} authToken={authToken} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;