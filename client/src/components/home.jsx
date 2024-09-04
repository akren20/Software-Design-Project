import React from "react";
import "../index.css";
import volunteerimg from "../components/volunteers.png";
import Navbar from "./nav";

const HomePage = () => {
  return (
    <div
      style={{ backgroundImage: `url(${volunteerimg})` }}
      className="w-full h-screen bg-cover bg-center"
    >
      <Navbar />
      <div className="flex flex-col items-center justify-center w-full h-full">
        {/* <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center py-8">
          Welcome to the University of Houston Volunteer Website!
        </h1> */}
      </div>
    </div>
  );
};

export default HomePage;
