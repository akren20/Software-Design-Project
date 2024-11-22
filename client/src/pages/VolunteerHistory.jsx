import React, { useState, useEffect } from "react";

const VolunteerHistory = () => {
  const [history, setHistory] = useState([]);
  const [sortBy, setSortBy] = useState("eventDate");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to perform this action.");
      return;
    }
    // Fetch volunteer history data from the backend
    const fetchVolunteerHistory = async () => {
      try {
        const response = await fetch("http://localhost:8080/volunteer-history", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in the header
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        setHistory(data); // Set the fetched data to the history state
      } catch (error) {
        console.error("Error fetching volunteer history:", error);
      }
    };

    fetchVolunteerHistory();
  }, []);

  // Sort function
  const handleSort = (field) => {
    const order = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortOrder(order);

    const sortedHistory = [...history].sort((a, b) => {
      if (a[field] < b[field]) return order === "asc" ? -1 : 1;
      if (a[field] > b[field]) return order === "asc" ? 1 : -1;
      return 0;
    });

    setHistory(sortedHistory);
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6">Volunteer Participation History</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Email</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Event Name</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Event Description</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Location</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Required Skills</th>
            <th
              className="py-2 px-4 text-left text-sm font-semibold text-gray-600 cursor-pointer"
              onClick={() => handleSort("urgency")}
            >
              Urgency {sortBy === "urgency" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-2 px-4 text-left text-sm font-semibold text-gray-600 cursor-pointer"
              onClick={() => handleSort("eventDate")}
            >
              Event Date {sortBy === "eventDate" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Participation Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map((event, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4 text-sm">{event.email}</td>
              <td className="py-2 px-4 text-sm">{event.eventName}</td>
              <td className="py-2 px-4 text-sm">{event.eventDescription}</td>
              <td className="py-2 px-4 text-sm">{event.location}</td>
              {/* Handle undefined or non-array requiredSkills */}
              <td className="py-2 px-4 text-sm">
                {(event.requiredSkills || []).join(", ")}
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
