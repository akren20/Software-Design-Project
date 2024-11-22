import React, { useState, useEffect } from "react";
import EventManagementForm from "./EventManagementForm";
import VolunteerMatchingForm from "./VolunteerMatchingForm";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ReportGenerator from "../components/ReportGenerator";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [selectedDate, setSelectedDate] = useState(new Date());
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

  const handleDateChange = (date) => {
    setSelectedDate(date);
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
          onClick={() => handleTabChange("all-events")}
          className={`px-4 py-2 mr-2 ${
            activeTab === "all-events" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          All Events
        </button>
        <button
          onClick={() => handleTabChange("reports")}
          className={`px-4 py-2 ${
            activeTab === "reports" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Reports
        </button>
      </div>

      <div>
        {activeTab === "events" && <EventManagementForm />}
        {activeTab === "volunteer-matching" && <VolunteerMatchingForm />}
        {activeTab === "reports" && (
          <ReportGenerator isAuthenticated={isAuthenticated} authToken={authToken} />
        )}
        {activeTab === "all-events" && (
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Event Calendar</h2>
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              className="mx-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;