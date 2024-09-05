import React from "react";
import "../index.css"; // Updated path to index.css
import volunteerimg from "../assets/images/volunteers.png"; // Updated path to image

const HomePage = () => {
  return (
    <div
      style={{ backgroundImage: `url(${volunteerimg})` }}
      className="w-full h-screen bg-cover bg-center"
    >
      <div className="flex flex-col items-center justify-center w-full h-full">
        {/* Content for the HomePage */}
      </div>
    </div>
  );
};

export default HomePage;
