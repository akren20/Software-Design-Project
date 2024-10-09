import React from "react";
import { Link } from "react-router-dom";
import "../index.css";
import volunteerimg from "../assets-images/volunteers.png";

const HomePage = () => {
  return (
    <div>
      {/* Background Section */}
      <div
        style={{ backgroundImage: `url(${volunteerimg})` }}
        className="w-full h-screen bg-cover bg-center relative"
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative flex flex-col items-center justify-center w-full h-full text-white text-center">
          {/* Headline */}
          <h1 className="text-5xl font-bold mb-5">Make a Difference Today</h1>

          {/* Subheading */}
          <p className="text-xl mb-10 max-w-lg">
            Join us and help transform lives by volunteering for impactful
            events in your community.
          </p>

          {/* Call to Action Button */}
          <Link to="/signup">
            <button className="bg-[#0c4a6e] text-white py-3 px-8 rounded-lg hover:bg-[#0369a1] transition duration-300">
              Get Started
            </button>
          </Link>
        </div>
      </div>

      {/* About Us Section
      <section className="py-20 px-5 bg-gray-100 text-center">
        <h2 className="text-4xl font-bold mb-8">About Us</h2>
        <p className="text-lg max-w-3xl mx-auto mb-8">
          Our mission is to bring together compassionate individuals and
          organizations to create positive change in our community. By
          facilitating meaningful volunteer opportunities, we aim to foster a
          sense of unity and empower people to make a difference in the lives of
          others. Whether you're looking to contribute your skills, time, or
          passion, we're here to help you get involved and make a lasting
          impact.
        </p>
      </section> */}
    </div>
  );
};

export default HomePage;
