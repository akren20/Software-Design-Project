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

const UserProfile = () => {
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    address1: "",
    address2: "",
    city: "",
    state_code: "",
    zip_code: "",
    skills: [],
    preferences: "",
    availability: [],
  });

  const [availabilityDates, setAvailabilityDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        
        if (!token || !userData) {
            setError("User is not logged in.");
            return;
        }

        const { email } = JSON.parse(userData);

        try {
            console.log(`Fetching profile for email: ${email}`);
            const response = await fetch(`http://localhost:8080/profile/${encodeURIComponent(email)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setFormData(data);
                console.log("Profile data fetched successfully:", data);
            } else {
                setError("Failed to fetch profile data.");
                console.error("Error fetching profile:", response.statusText);
            }
        } catch (err) {
            setError("An error occurred while fetching profile data.");
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    fetchProfileData();
}, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
        setError("User is not logged in.");
        return;
    }

    const { email } = JSON.parse(userData);

    try {
        const response = await fetch(`http://localhost:8080/profile/${encodeURIComponent(email)}`, {
            method: "PUT",  // Changed from POST to PUT
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...formData,
                email: email  // Ensure email is included in the update
            }),
        });

        if (response.ok) {
            alert("Profile Updated Successfully!");
            console.log(formData);
        } else {
            const errorData = await response.json();
            setError(errorData.message || "Failed to update profile.");
            console.error("Error updating profile:", response.statusText);
        }
    } catch (err) {
        setError("An error occurred while updating profile.");
        console.error("Update error:", err);
    }
};

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  return (
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label> {/* Add Email Input */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Full Name</label>
          <input
            type="text"
            name="full_name"
            maxLength="50"
            value={formData.full_name}
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
            name="state_code"
            value={formData.state_code}
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
            name="zip_code"
            maxLength="9"
            value={formData.zip_code}
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