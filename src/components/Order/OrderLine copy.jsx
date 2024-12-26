import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderLine = () => {
  const filters = [
    {
      label: "All",
      count: 0, // This count will be updated dynamically
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      badgeColor: "bg-blue-700",
      value: "all",
    },
    {
      label: "Dine In",
      count: 0,
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      badgeColor: "bg-green-700",
      value: "Dine In",
    },
    {
      label: "Wait List",
      count: 0,
      bgColor: "bg-orange-100",
      textColor: "text-orange-700",
      badgeColor: "bg-orange-700",
      value: "Wait List",
    },
    {
      label: "Take Away",
      count: 0,
      bgColor: "bg-purple-100",
      textColor: "text-purple-700",
      badgeColor: "bg-purple-700",
      value: "Take Away",
    },
    {
      label: "Served",
      count: 0,
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-700",
      badgeColor: "bg-indigo-700",
      value: "Served",
    },
  ];

  // Ensure all IDs are unique
  const orders = [
    {
      id: "FO027",
      table: "Table 03",
      items: "8X",
      time: "2 mins ago",
      status: "Dine In",
      bgColor: "bg-teal-100",
      statusColor: "bg-teal-500",
    },
    {
      id: "FO028",
      table: "Table 07",
      items: "3X",
      time: "Just Now",
      status: "Wait List",
      bgColor: "bg-orange-100",
      statusColor: "bg-orange-500",
    },
    {
      id: "FO029",
      table: "Table 09",
      items: "2X",
      time: "25 mins ago",
      status: "Take Away",
      bgColor: "bg-purple-100",
      statusColor: "bg-purple-500",
    },
    {
      id: "FO030",
      table: "Table 10",
      items: "1X",
      time: "10 mins ago",
      status: "Served",
      bgColor: "bg-indigo-100",
      statusColor: "bg-indigo-500",
    },
    {
      id: "FO031",
      table: "Table 09",
      items: "2X",
      time: "25 mins ago",
      status: "Take Away",
      bgColor: "bg-purple-100",
      statusColor: "bg-purple-500",
    },
    {
      id: "FO032",
      table: "Table 10",
      items: "1X",
      time: "10 mins ago",
      status: "Served",
      bgColor: "bg-indigo-100",
      statusColor: "bg-indigo-500",
    },
  ];

  const [selectedFilter, setSelectedFilter] = useState("all");

  // Filter orders based on the selected filter
  const filteredOrders = orders.filter((order) => {
    if (selectedFilter === "all") {
      return true;
    }
    return order.status === selectedFilter;
  });

  // Update filter counts dynamically
  const updatedFilters = filters.map((filter) => {
    if (filter.value === "all") {
      return { ...filter, count: orders.length };
    }
    return {
      ...filter,
      count: orders.filter((order) => order.status === filter.value).length,
    };
  });

  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50">
      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center">
        <div className="mb-4 flex items-center space-x-4 overflow-x-auto hide-scrollbar">
          {updatedFilters.map((filter) => (
            <button
              key={filter.value}
              className={`px-4 py-2 rounded-full ${filter.bgColor} ${filter.textColor} font-medium whitespace-nowrap`} // Added whitespace-nowrap
              onClick={() => setSelectedFilter(filter.value)}
            >
              {filter.label}{" "}
              <span
                className={`ml-1 ${filter.badgeColor} text-white rounded-full px-2 text-sm`}
              >
                {filter.count}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={() => navigate("add-orders")}
          className={`px-4 py-2 rounded-full flex items-center justify-center bg-orange-500 text-white shadow-md font-medium whitespace-nowrap`} // Added whitespace-nowrap
        >
          <svg
            viewBox="0 0 22 22"
            fill="currentColor"
            className="w-4 h-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M4 12H20M12 4V20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>{" "}
            </g>
          </svg>
          Add Order
        </button>
      </div>

      {/* Order Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 hide-scrollbar">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className={`p-4 rounded-lg ${order.bgColor} flex-auto shadow  whitespace-nowrap`}
          >
            <div className="flex justify-between">
              <h3 className="font-bold text-lg">{`Order #${order.id}`}</h3>
              <p className="text-gray-700">{order.table}</p>
            </div>
            <p className="mt-2 text-gray-800 font-medium">{`Items: ${order.items}`}</p>
            <div className="flex justify-between items-center">
              <p className="mt-1 text-gray-500">{order.time}</p>
              <div
                className={`mt-3 text-white px-2 py-1 text-sm rounded-full ${order.statusColor}`}
              >
                {order.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderLine;
