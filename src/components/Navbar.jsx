import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import GoogleLoginPopup from "./GoogleLoginPopup";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange); // Listen for changes

    // Set initial state
    setIsDarkMode(mediaQuery.matches);

    // Cleanup listener
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <header className="bg-gray-50 dark:bg-gray-900 p-4">
      {/* Top Section */}
      {/* <GoogleLoginPopup /> */}

      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center justify-between p-4">
          <h1 className="text-orange-500 text-2xl font-bold">Mesobit</h1>
        </Link>

        {/* Icons */}
        <div className="flex items-center gap-4 ml-4">
          {/* Cart Icon */}
          {/* <button className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6 text-gray-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h18l-3.6 9H6.6L3 3z"
              />
              <circle cx="9" cy="20" r="1" fill="currentColor" />
              <circle cx="18" cy="20" r="1" fill="currentColor" />
            </svg>
          </button> */}

          {/* Notification Icon */}
          <Link to="/auth" className="relative">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-gray-700 dark:text-gray-100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                  stroke={isDarkMode ? "white" : "black"} // Here, 'isDarkMode' should be a boolean from your state
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>

            {/* <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              1
            </span> */}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
