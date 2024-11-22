import React, { useState } from "react";

// State code mapping
const stateCodeMap = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
  "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
  "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID",
  "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
  "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
  "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
  "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
  "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
  "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT",
  "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
  "Wisconsin": "WI", "Wyoming": "WY"
};

const skillsOptions = ["Communication", "Leadership", "Technical Writing", "Project Management"];
const urgencyLevels = ["Low", "Medium", "High"];
const stateCityData = {
  Alabama: ["Birmingham", "Montgomery", "Huntsville"],
  Alaska: ["Anchorage", "Fairbanks", "Juneau"],
  Arizona: ["Phoenix", "Tucson", "Mesa"],
  Arkansas: ["Little Rock", "Fayetteville", "Fort Smith"],
  California: ["Los Angeles", "San Francisco", "San Diego"],
  Colorado: ["Denver", "Colorado Springs", "Aurora"],
  Connecticut: ["Hartford", "New Haven", "Stamford"],
  Delaware: ["Wilmington", "Dover", "Newark"],
  Florida: ["Miami", "Orlando", "Tampa"],
  Georgia: ["Atlanta", "Savannah", "Augusta"],
  Hawaii: ["Honolulu", "Hilo", "Kailua"],
  Idaho: ["Boise", "Idaho Falls", "Pocatello"],
  Illinois: ["Chicago", "Springfield", "Naperville"],
  Indiana: ["Indianapolis", "Fort Wayne", "Evansville"],
  Iowa: ["Des Moines", "Cedar Rapids", "Davenport"],
  Kansas: ["Wichita", "Overland Park", "Topeka"],
  Kentucky: ["Louisville", "Lexington", "Bowling Green"],
  Louisiana: ["New Orleans", "Baton Rouge", "Shreveport"],
  Maine: ["Portland", "Augusta", "Bangor"],
  Maryland: ["Baltimore", "Annapolis", "Rockville"],
  Massachusetts: ["Boston", "Worcester", "Springfield"],
  Michigan: ["Detroit", "Grand Rapids", "Ann Arbor"],
  Minnesota: ["Minneapolis", "Saint Paul", "Duluth"],
  Mississippi: ["Jackson", "Gulfport", "Biloxi"],
  Missouri: ["Kansas City", "Saint Louis", "Springfield"],
  Montana: ["Billings", "Missoula", "Great Falls"],
  Nebraska: ["Omaha", "Lincoln", "Bellevue"],
  Nevada: ["Las Vegas", "Reno", "Carson City"],
  "New Hampshire": ["Manchester", "Nashua", "Concord"],
  "New Jersey": ["Newark", "Jersey City", "Paterson"],
  "New Mexico": ["Albuquerque", "Santa Fe", "Las Cruces"],
  "New York": ["New York City", "Buffalo", "Rochester"],
  "North Carolina": ["Charlotte", "Raleigh", "Greensboro"],
  "North Dakota": ["Fargo", "Bismarck", "Grand Forks"],
  Ohio: ["Columbus", "Cleveland", "Cincinnati"],
  Oklahoma: ["Oklahoma City", "Tulsa", "Norman"],
  Oregon: ["Portland", "Eugene", "Salem"],
  Pennsylvania: ["Philadelphia", "Pittsburgh", "Allentown"],
  "Rhode Island": ["Providence", "Warwick", "Cranston"],
  "South Carolina": ["Charleston", "Columbia", "Greenville"],
  "South Dakota": ["Sioux Falls", "Rapid City", "Aberdeen"],
  Tennessee: ["Nashville", "Memphis", "Knoxville"],
  Texas: ["Houston", "Austin", "Dallas"],
  Utah: ["Salt Lake City", "Provo", "Ogden"],
  Vermont: ["Burlington", "Montpelier", "Rutland"],
  Virginia: ["Virginia Beach", "Richmond", "Norfolk"],
  Washington: ["Seattle", "Spokane", "Tacoma"],
  "West Virginia": ["Charleston", "Huntington", "Morgantown"],
  Wisconsin: ["Milwaukee", "Madison", "Green Bay"],
  Wyoming: ["Cheyenne", "Casper", "Laramie"],
};

const EventManagementForm = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    stateCode: "",
    city: "",
    location: "",
    requiredSkills: [],
    urgency: "",
    eventDate: ""
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };

      // Update location when state or city changes
      if (name === 'stateCode' || name === 'city') {
        const city = name === 'city' ? value : prev.city;
        const state = name === 'stateCode' ? value : prev.stateCode;
        if (city && state) {
          newData.location = `${city}, ${state}`;
        }
      }
      return newData;
    });
  };

  const handleSkillsChange = (e) => {
    const selectedSkills = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      requiredSkills: selectedSkills
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({ type: "error", text: "Authentication required" });
        return;
      }

      const apiFormData = {
        ...formData,
        stateCode: stateCodeMap[formData.stateCode] || formData.stateCode
      };

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(apiFormData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          const formattedErrors = {};
          errorData.errors.forEach(error => {
            formattedErrors[error.path] = error.msg;
          });
          setErrors(formattedErrors);
          setMessage({ type: "error", text: "Please correct the errors below." });
          return;
        }
        throw new Error(errorData.message || 'Failed to create event');
      }

      const result = await response.json();
      setMessage({ type: "success", text: result.message });
      setFormData({
        eventName: "",
        description: "",
        stateCode: "",
        city: "",
        location: "",
        requiredSkills: [],
        urgency: "",
        eventDate: ""
      });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Event Management Form</h2>

      {message.text && (
        <div className={`p-4 mb-4 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Event Name</label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleInputChange}
            required
            className={`w-full p-2 border ${errors.eventName ? 'border-red-500' : 'border-gray-300'} rounded`}
          />
          {errors.eventName && <p className="text-red-500 text-sm mt-1">{errors.eventName}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className={`w-full p-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded`}
            rows="4"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">State</label>
          <select
            name="stateCode"
            value={formData.stateCode}
            onChange={handleInputChange}
            required
            className={`w-full p-2 border ${errors.stateCode ? 'border-red-500' : 'border-gray-300'} rounded`}
          >
            <option value="">Select State</option>
            {Object.keys(stateCityData).map(state => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.stateCode && <p className="text-red-500 text-sm mt-1">{errors.stateCode}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">City</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
            className={`w-full p-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded`}
            disabled={!formData.stateCode}
          >
            <option value="">Select City</option>
            {formData.stateCode && stateCityData[formData.stateCode].map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Required Skills</label>
          <select
            name="requiredSkills"
            multiple
            value={formData.requiredSkills}
            onChange={handleSkillsChange}
            required
            className={`w-full p-2 border ${errors.requiredSkills ? 'border-red-500' : 'border-gray-300'} rounded`}
          >
            {skillsOptions.map(skill => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
          {errors.requiredSkills && <p className="text-red-500 text-sm mt-1">{errors.requiredSkills}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Urgency</label>
          <select
            name="urgency"
            value={formData.urgency}
            onChange={handleInputChange}
            required
            className={`w-full p-2 border ${errors.urgency ? 'border-red-500' : 'border-gray-300'} rounded`}
          >
            <option value="">Select Urgency</option>
            {urgencyLevels.map(level => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          {errors.urgency && <p className="text-red-500 text-sm mt-1">{errors.urgency}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Event Date</label>
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleInputChange}
            required
            className={`w-full p-2 border ${errors.eventDate ? 'border-red-500' : 'border-gray-300'} rounded`}
          />
          {errors.eventDate && <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Save Event
        </button>
      </form>
    </div>
  );
};

export default EventManagementForm;