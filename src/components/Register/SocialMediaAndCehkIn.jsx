import React, { useState } from "react";
import { daysOfWeek, timeIn } from "../../constant/MVData";

const CheckInCheckOut = ({
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  website,
  setWebsite,
}) => {
  return (
    <div>
      <div className="grid sm:grid-cols-12 gap-2 sm:gap-12 bg-white p-4 rounded-lg shadow-sm">
        {/* Days Selection */}

        {/* Check-In Time */}
        <div className="sm:col-span-3">
          <label
            htmlFor="check-in-time"
            className="block text-sm font-medium text-gray-900"
          >
            Check-In Time
          </label>
        </div>
        <div className="sm:col-span-9">
          <div className="flex flex-wrap gap-4">
            <div>
              <select
                className="py-2 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-gray-500 focus:ring-gray-500"
                value={checkIn.startTime}
                onChange={(e) => setCheckIn(e.target.value)}
              >
                <option value="" disabled>
                  Select Start Time
                </option>
                {timeIn.map((time) => (
                  <option key={time} value={`${time}:00 AM`}>
                    {`${time}:00 AM`}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-gray-400">to</span>
            <div>
              <select
                className="py-2 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-gray-500 focus:ring-gray-500"
                value={checkIn.endTime}
                onChange={(e) => setCheckOut(e.target.value)}
              >
                <option value="" disabled>
                  Select End Time
                </option>
                {timeIn.map((time) => (
                  <option key={time} value={`${time}:00 PM`}>
                    {`${time}:00 PM`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Website Input */}
        <div className="sm:col-span-3">
          <label
            htmlFor="vendor-website"
            className="inline-block text-sm text-gray-800"
          >
            Website
          </label>
        </div>
        <div className="sm:col-span-9">
          <input
            id="vendor-website"
            type="url"
            className="py-2 px-3 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-gray-500 focus:ring-gray-500"
            placeholder="https://example.com"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckInCheckOut;
