import React, { useState } from "react";

const skillsOptions = ["Communication", "Leadership", "Technical Writing", "Project Management"]; // Example skills
const urgencyLevels = ["Low", "Medium", "High", "Critical"]; // Example urgency levels

const stateCityData = {
  "California": ["Los Angeles", "San Francisco", "San Diego"],
  "Texas": ["Houston", "Austin", "Dallas"],
  "New York": ["New York City", "Buffalo", "Rochester"],
  "Florida": ["Miami", "Orlando", "Tampa"]
};

const EventManagementForm = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    eventDescription: "",
    state: "",
    city: "",
    requiredSkills: [],
    urgency: "",
    eventDate: "",
    eventTime: "", // New field for event time
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStateChange = (e) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      state: value,
      city: "" // Reset city selection when state changes
    }));
  };

  const handleSkillsChange = (e) => {
    const { options } = e.target;
    const selectedSkills = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedSkills.push(options[i].value);
      }
    }
    setFormData((prevState) => ({
      ...prevState,
      requiredSkills: selectedSkills,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Submitted Event Data:", result);
      alert("Event Created/Updated Successfully!");

    } catch (error) {
      console.error("Error submitting event:", error);
      alert("Failed to create/update event.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Event Management Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Event Name</label>
          <input
            type="text"
            name="eventName"
            maxLength="100"
            value={formData.eventName}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Event Description</label>
          <textarea
            name="eventDescription"
            value={formData.eventDescription}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">State</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleStateChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="">Select State</option>
            {Object.keys(stateCityData).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">City</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
            disabled={!formData.state} // Disable until a state is selected
          >
            <option value="">Select City</option>
            {formData.state &&
              stateCityData[formData.state].map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Required Skills</label>
          <select
            name="requiredSkills"
            multiple
            value={formData.requiredSkills}
            onChange={handleSkillsChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            {skillsOptions.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Urgency</label>
          <select
            name="urgency"
            value={formData.urgency}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="">Select urgency level</option>
            {urgencyLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Event Date</label>
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Event Time</label>
          <input
            type="time"
            name="eventTime"
            value={formData.eventTime}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Save Event
        </button>
      </form>
    </div>
  );
};

export default EventManagementForm;
