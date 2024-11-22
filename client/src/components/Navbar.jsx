import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();

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

                <div className={`md:flex md:items-center ${isOpen ? "block" : "hidden"} md:block`}>
                    <Link
                        to="/"
                        className="block mt-4 md:inline-block md:mt-0 text-white mr-4 hover:cursor-pointer"
                    >
                        Home
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <NotificationDropdown />
                            
                            <Link
                                to="/profile"
                                className="block mt-4 md:inline-block md:mt-0 text-white mr-4 hover:cursor-pointer"
                            >
                                Profile
                            </Link>
                            
                            <Link
                                to="/volunteer/history"
                                className="block mt-4 md:inline-block md:mt-0 text-white mr-4 hover:cursor-pointer"
                            >
                                Volunteer History
                            </Link>
                            
                            {user?.isAdmin && (
                                <Link
                                    to="/admin/dashboard"
                                    className="block mt-4 md:inline-block md:mt-0 text-white mr-4 hover:cursor-pointer"
                                >
                                    Admin Dashboard
                                </Link>
                            )}

                            <span className="block mt-4 md:inline-block md:mt-0 text-white mr-4">
                                {user?.email}
                            </span>
                            
                            <button
                                onClick={logout}
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