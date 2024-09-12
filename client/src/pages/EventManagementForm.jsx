import React, { useState } from "react";

const skillsOptions = ["Communication", "Leadership", "Technical Writing", "Project Management"]; // Example skills
const urgencyLevels = ["Low", "Medium", "High", "Critical"]; // Example urgency levels

const EventManagementForm = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    eventDescription: "",
    location: "",
    requiredSkills: [],
    urgency: "",
    eventDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Event Data:", formData); // Replace with API call or further logic
    alert("Event Created/Updated Successfully!");
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
          <label className="block text-gray-700">Location</label>
          <textarea
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          ></textarea>
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