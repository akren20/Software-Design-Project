import React, { useState, useEffect } from "react";

const states = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

const skills = [
  "Communication",
  "Leadership",
  "Teamwork",
  "Technical Writing",
  "Project Management",
]; // Example skills

const UserProfile = (props) => {
  const email = props.email; // The email should be passed as a prop when the user logs in

  const [formData, setFormData] = useState({
    fullName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    skills: [],
    preferences: "",
    availability: [],
  });

  const [availabilityDates, setAvailabilityDates] = useState([]);

  // Load saved profile from localStorage when the component mounts
  useEffect(() => {
    const savedProfile = localStorage.getItem(`userProfile-${email}`);
    if (savedProfile) {
      setFormData(JSON.parse(savedProfile));
    }
  }, [email]);

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
      skills: selectedSkills,
    }));
  };

  const handleAvailabilityChange = (e) => {
    const { value } = e.target;
    if (!availabilityDates.includes(value)) {
      setAvailabilityDates((prevDates) => [...prevDates, value]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save the form data to localStorage using the user's email as the key
    localStorage.setItem(`userProfile-${email}`, JSON.stringify(formData));
    alert("Profile Updated Successfully!");
  };

  // Function to handle logging out (clearing local storage)
  // const handleLogout = () => {
  //   localStorage.removeItem(`userProfile-${email}`);
  //   alert("Logged out and cleared local storage!");
  // };

  return (
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullName"
            maxLength="50"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Address 1</label>
          <input
            type="text"
            name="address1"
            maxLength="100"
            value={formData.address1}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Address 2</label>
          <input
            type="text"
            name="address2"
            maxLength="100"
            value={formData.address2}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">City</label>
          <input
            type="text"
            name="city"
            maxLength="100"
            value={formData.city}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">State</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="">Select a state</option>
            {states.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Zip Code</label>
          <input
            type="text"
            name="zipCode"
            maxLength="9"
            value={formData.zipCode}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Skills</label>
          <select
            name="skills"
            multiple
            value={formData.skills}
            onChange={handleSkillsChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            {skills.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Preferences</label>
          <textarea
            name="preferences"
            value={formData.preferences}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Availability (Select Dates)
          </label>
          <input
            type="date"
            onChange={handleAvailabilityChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
          <div className="mt-2">
            {availabilityDates.map((date, index) => (
              <span key={index} className="text-sm text-blue-500 mr-2">
                {date}
              </span>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
