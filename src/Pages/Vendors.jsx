import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider";
import { formatDate } from "../constant/MVData";
import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";

const Vendor = () => {
  const [vendors, setVendors] = useState([]); // Ensure this is initialized as an array
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const navigate = useNavigate();

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const fetchVendors = async () => {
    try {
      const response = await axios.get("/v1/vendor/");
      console.log(response.data.vendors);
      setVendors(response.data?.vendors || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setVendors([]);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleActiveStatus = async (vendor_id) => {
    try {
      const response = await axios.put(
        `/v1/approve/vendor/${vendor_id}/status`
      );
      console.log(response.data);
      fetchVendors();
    } catch (error) {
      console.error("Error updating vendor status:", error);
    }
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Vendor Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage vendors and their permissions here.
          </p>
        </header>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600 font-bold">
            All users {vendors.length}
          </span>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 border rounded-md text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="px-4 py-2 border rounded-md text-sm text-gray-600 hover:bg-gray-100">
              Filters
            </button>
            <button
              onClick={() => navigate("new")}
              className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-500"
            >
              + Add user
            </button>
          </div>
        </div>

        <table className="w-full border-collapse bg-white">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase font-medium">
            <tr>
              <th className="py-3 px-4 text-left">
                <input type="checkbox" className="form-checkbox rounded" />
              </th>
              <th className="py-3 px-4 text-left">User name</th>
              <th className="py-3 px-4 text-left">Access</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Last active</th>
              <th className="py-3 px-4 text-left">Date added</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((user, index) => (
              <tr
                key={index}
                className={`border-b text-sm text-gray-700 hover:bg-gray-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="py-3 px-4">
                  <input type="checkbox" className="form-checkbox rounded" />
                </td>
                <td className="py-3 px-4 flex items-center space-x-3">
                  <img
                    src={process.env.IMAGE_URL + user.vendor_logo}
                    alt={user.vendor_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      {user.vendor_name}
                    </p>
                    <p className="text-sm text-gray-500">{user.vendor_email}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {user.roles && user.roles.length > 0
                      ? user.roles[0]
                      : "N/A"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    onClick={() => handleActiveStatus(user.vendor_id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${
                      user.vendor_status
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.vendor_status ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {user.lastActive ? (
                    <ReactTimeAgo date={user.lastActive} locale="en-US" />
                  ) : (
                    "N/A"
                  )}
                </td>

                <td className="py-3 px-4">
                  {formatDate(user.createdAt) || "N/A"}
                </td>

                <td className="py-3 px-4 relative">
                  <button
                    className="text-gray-500 hover:text-gray-800"
                    onClick={() => toggleDropdown(index)}
                  >
                    ⋮
                  </button>
                  {dropdownOpen === index && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg">
                      <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                        View More
                      </button>
                      <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                        Activity Log
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vendor;
