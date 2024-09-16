import React, { useState, useEffect } from "react";

// Mock data for volunteers and events; replace with actual API calls to fetch data
const mockVolunteers = [
  { id: 1, name: "John Doe", skills: ["Communication", "Leadership"] },
  { id: 2, name: "Jane Smith", skills: ["Technical Writing", "Project Management"] },
];

const mockEvents = [
  { id: 1, name: "Community Cleanup", requiredSkills: ["Leadership", "Teamwork"] },
  { id: 2, name: "Tech Workshop", requiredSkills: ["Technical Writing", "Communication"] },
];

const VolunteerMatchingForm = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [matchedEvent, setMatchedEvent] = useState("");

  useEffect(() => {
    // Simulate fetching data from a database
    setVolunteers(mockVolunteers);
    setEvents(mockEvents);
  }, []);

  const handleVolunteerChange = (e) => {
    const selectedVolunteerId = e.target.value;
    setSelectedVolunteer(selectedVolunteerId);
    // Automatically match event based on volunteer's skills
    const volunteer = volunteers.find((vol) => vol.id.toString() === selectedVolunteerId);
    if (volunteer) {
      const matched = events.find((event) =>
        event.requiredSkills.some((skill) => volunteer.skills.includes(skill))
      );
      setMatchedEvent(matched ? matched.id.toString() : "");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with logic to save the matched volunteer-event data
    console.log("Matched Volunteer to Event:", {
      volunteerId: selectedVolunteer,
      eventId: matchedEvent,
    });
    alert("Volunteer matched to event successfully!");
  };

  return (
    <div className="max-w-lg mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Volunteer Matching Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Volunteer Name</label>
          <select
            name="volunteer"
            value={selectedVolunteer}
            onChange={handleVolunteerChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="">Select a volunteer</option>
            {volunteers.map((volunteer) => (
              <option key={volunteer.id} value={volunteer.id}>
                {volunteer.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Matched Event</label>
          <select
            name="event"
            value={matchedEvent}
            onChange={(e) => setMatchedEvent(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="">Select an event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Match Volunteer
        </button>
      </form>
    </div>
  );
};

export default VolunteerMatchingForm;
