import React, { useState, useEffect } from "react";

const AdminEventUserAssignment = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");

  useEffect(() => {
    fetchVolunteers();
    fetchEvents();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/profiles");
      if (!response.ok) throw new Error("Failed to fetch volunteers");
      const data = await response.json();
      setVolunteers(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/events");
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAssign = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/event-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: selectedEvent, email: selectedVolunteer })
      });
      if (!response.ok) throw new Error("Failed to assign user to event");
      alert("User assigned to event successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to assign user to event");
    }
  };
  
  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Assign Volunteer to Event</h2>
      
      <div className="mb-4">
        <label htmlFor="volunteer" className="block mb-2 font-bold">Select Volunteer</label>
        <select 
          id="volunteer"
          value={selectedVolunteer}
          onChange={e => setSelectedVolunteer(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Choose a volunteer...</option>
          {volunteers.map(v => (
            <option key={v.email} value={v.email}>
              {v.full_name} ({v.email})  
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label htmlFor="event" className="block mb-2 font-bold">Select Event</label>
        <select
          id="event"
          value={selectedEvent}
          onChange={e => setSelectedEvent(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Choose an event...</option>
          {events.map(e => (
            <option key={e.event_id} value={e.event_id}>
              {e.event_name}
            </option>
          ))}
        </select>
      </div>
      
      <button
        onClick={handleAssign}
        disabled={!selectedVolunteer || !selectedEvent}
        className="px-4 py-2 font-bold text-white bg-blue-500 rounded disabled:bg-gray-400"
      >
        Assign to Event
      </button>
    </div>
  );
};

export default AdminEventUserAssignment;