import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth(); // Get login status and logout function from context

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-[#0c4a6e] p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">UH Volunteers</div>
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              ></path>
            </svg>
          </button>
        </div>
        <div
          className={`md:flex md:items-center ${
            isOpen ? "block" : "hidden"
          } md:block`}
        >
          <Link
            to="/"
            className="block mt-4 md:inline-block md:mt-0 text-white mr-4 hover:cursor-pointer"
          >
            Home
          </Link>
          {isLoggedIn ? ( // Conditionally render items based on login status
            <>
              <Link
                to="/profile" // Profile route
                className="block mt-4 md:inline-block md:mt-0 text-white mr-4 hover:cursor-pointer"
              >
                Profile
              </Link>
              <Link
                to="/dashboard" // Example of a protected route
                className="block mt-4 md:inline-block md:mt-0 text-white mr-4 hover:cursor-pointer"
              >
                Dashboard
              </Link>
              <button
                onClick={logout} // Logout button
                className="block mt-4 md:inline-block md:mt-0 text-white hover:cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block mt-4 md:inline-block md:mt-0 text-white mr-4 hover:cursor-pointer"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block mt-4 md:inline-block md:mt-0 text-white hover:cursor-pointer"
              >
                Registration
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
