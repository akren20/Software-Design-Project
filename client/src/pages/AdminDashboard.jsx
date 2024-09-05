import React, { useState } from "react";
import EventManagementForm from "./EventManagementForm"; 
import VolunteerMatchingForm from "./VolunteerMatchingForm"; 

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("events");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex mb-6">
        <button
          onClick={() => handleTabChange("events")}
          className={`px-4 py-2 mr-2 ${activeTab === "events" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Event Management
        </button>
        <button
          onClick={() => handleTabChange("volunteer-matching")}
          className={`px-4 py-2 ${activeTab === "volunteer-matching" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Volunteer Matching
        </button>
        {/* Add more tabs here as needed */}
      </div>

      {/* Render Tab Content Based on Active Tab */}
      <div>
        {activeTab === "events" && <EventManagementForm />}
        {activeTab === "volunteer-matching" && <VolunteerMatchingForm />}
        {/* Add more tab content here */}
      </div>
    </div>
  );
};

export default AdminDashboard;
