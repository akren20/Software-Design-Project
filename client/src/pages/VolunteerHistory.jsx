import React, { useState, useEffect } from "react";

// Mock data for volunteer participation history; replace with actual API calls to fetch data
const mockVolunteerHistory = [
  {
    eventName: "Community Cleanup",
    eventDescription: "A community event to clean up the neighborhood.",
    location: "City Park",
    requiredSkills: ["Leadership", "Teamwork"],
    urgency: "High",
    eventDate: "2024-09-15",
    participationStatus: "Completed", // Possible statuses: "Completed", "Pending", "Cancelled"
  },
  {
    eventName: "Tech Workshop",
    eventDescription: "A workshop for teaching technical skills to students.",
    location: "Community Center",
    requiredSkills: ["Technical Writing", "Communication"],
    urgency: "Medium",
    eventDate: "2024-10-01",
    participationStatus: "Pending",
  },
];

const VolunteerHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Simulate fetching data from a backend service
    setHistory(mockVolunteerHistory);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6">Volunteer Participation History</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Event Name</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Event Description</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Location</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Required Skills</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Urgency</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Event Date</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Participation Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map((event, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4 text-sm">{event.eventName}</td>
              <td className="py-2 px-4 text-sm">{event.eventDescription}</td>
              <td className="py-2 px-4 text-sm">{event.location}</td>
              <td className="py-2 px-4 text-sm">
                {event.requiredSkills.join(", ")}
              </td>
              <td className="py-2 px-4 text-sm">{event.urgency}</td>
              <td className="py-2 px-4 text-sm">{event.eventDate}</td>
              <td className="py-2 px-4 text-sm">{event.participationStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VolunteerHistory;
