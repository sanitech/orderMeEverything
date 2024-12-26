import React from "react";
import Promotion from "./Promotion";

const Header = React.memo(({ setSearchText, searchText, searchStatus }) => {
  return (
    <header className="bg-orange-50 p-4 rounded-lg shadow-md sticky top-0 z-10">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-4">
        {/* Search Bar */}
        <div className="flex-1">
          {(searchStatus === "menu" || searchStatus === "order") && ( // Check if searchStatus is "menu" or "order"
            <div className="relative">
              <input
                type="text"
                placeholder="Search your food"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                onChange={(e) => setSearchText(e.target.value)} // Handle input changes
                value={searchText}
              />
              <span className="absolute inset-y-0 right-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M15 11a4 4 0 10-8 0 4 4 0 008 0z"
                  />
                </svg>
              </span>
            </div>
          )}
        </div>

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
                d="M15 17h5l-1.405-4.215A2 2 0 0016.7 11H7.3a2 2 0 00-1.895 1.785L4 17h5m6 0v2a3 3 0 01-6 0v-2m3-10V4m0 0a2 2 0 00-4 0v3a2 2 0 004 0z"
              />
            </svg>
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              1
            </span>
          </button> */}
        </div>
      </div>

      {/* Banner Section */}
      {/* <Promotion /> */}
    </header>
  );
});

export default Header;
