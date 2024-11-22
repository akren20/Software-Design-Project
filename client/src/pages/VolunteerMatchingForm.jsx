import React, { useState, useEffect } from "react";

const VolunteerMatchingForm = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [matchedEvents, setMatchedEvents] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token
        if (!token) throw new Error("No token provided");

        const response = await fetch("http://localhost:8080/api/profiles", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the request
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch volunteers");
        }

        const data = await response.json();
        setVolunteers(data);
      } catch (error) {
        console.error("Error fetching volunteers:", error);
      }
    };

    fetchVolunteers();
  }, []);

  const fetchMatchesForVolunteer = async (email) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token provided");
  
      const matchesResponse = await fetch(`http://localhost:8080/api/matches/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!matchesResponse.ok) {
        throw new Error("Failed to fetch matches");
      }
  
      const matchedEvents = await matchesResponse.json();
      console.log("Matched Events Response:", matchedEvents); // Debug the response
      setMatchedEvents(matchedEvents);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };
  
  const handleVolunteerChange = (e) => {
    const selectedEmail = e.target.value;
    setSelectedVolunteer(selectedEmail);

    // Fetch matched events for the selected volunteer
    fetchMatchesForVolunteer(selectedEmail);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // Retrieve the token
      if (!token) throw new Error("No token provided");

      const response = await fetch("http://localhost:8080/api/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in the request
        },
        body: JSON.stringify({ volunteerId: selectedVolunteer, eventId: selectedEvent }),
      });

      if (!response.ok) {
        throw new Error("Failed to save match");
      }

      alert("Volunteer matched to event successfully!");
    } catch (error) {
      console.error("Error submitting match:", error);
      alert("Failed to match volunteer to event.");
    }
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
              <option key={volunteer.email} value={volunteer.email}>
                {volunteer.full_name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Matched Event</label>
          <select
            name="event"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="">Select a matched event</option>
            {matchedEvents.map((event) => (
              <option key={event.eventName} value={event.eventName}>
                {event.eventName} (Score: {event.matchScore})
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
