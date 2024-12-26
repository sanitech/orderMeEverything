import React from "react";

const BussinessInfo = ({
  businessName,
  setBusinessName,
  businessType,
  setBusinessType,
  phone,
  setPhone,
}) => {
  return (
    <div>
      <div className="grid sm:grid-cols-12 gap-2 sm:gap-12 bg-white rounded-lg p-4 shadow-sm">
        {/* Business Name */}
        <div className="sm:col-span-3">
          <label
            htmlFor="business-name"
            className="inline-block text-sm text-gray-800 mt-2.5"
          >
            Business Name
          </label>
        </div>
        <div className="sm:col-span-9">
          <input
            id="business-name"
            type="text"
            className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500"
            placeholder="Hotel and Restaurant"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>

        {/* Business Type */}
        <div className="sm:col-span-3">
          <label
            htmlFor="business-type"
            className="inline-block text-sm text-gray-800 mt-2.5"
          >
            Business Type
          </label>
        </div>
        <div className="sm:col-span-9">
          <select
            id="business-type"
            className="py-2 px-3 pe-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
          >
            <option value="" disabled>
              Select a Type
            </option>
            <option value="restaurant">Restaurant</option>
            <option value="hotel">Hotel</option>
            <option value="cafe">Cafe</option>
            <option value="guest-house">Guest House</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Phone Number */}
        <div className="sm:col-span-3">
          <label
            htmlFor="phone-number"
            className="inline-block text-sm text-gray-800 mt-2.5"
          >
            Phone Number
          </label>
        </div>
        <div className="sm:col-span-9">
          <input
            id="phone-number"
            type="text"
            className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default BussinessInfo;
