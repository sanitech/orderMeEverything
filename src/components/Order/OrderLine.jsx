import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchOrdersByVendorId, placeOrder } from "../../utils/orderUtils";
import { AuthContext } from "../../context/AuthProvider";
import ReactTimeAgo from "react-time-ago";
import db from "../../db/db";
const OrderLine = ({ setSelectedOrderId }) => {
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
      label: "Take Away",
      count: 0,
      bgColor: "bg-purple-100",
      textColor: "text-purple-700",
      badgeColor: "bg-purple-700",
      value: "Take Away",
    },
    {
      label: "Delivery",
      count: 0,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-700",
      badgeColor: "bg-yellow-700",
      value: "Delivery",
    },
    {
      label: "Cancelled",
      count: 0,
      bgColor: "bg-orange-100",
      textColor: "text-orange-700",
      badgeColor: "bg-orange-700",
      value: "cancelled",
    },
    // {
    //   label: "Served",
    //   count: 0,
    //   bgColor: "bg-indigo-100",
    //   textColor: "text-indigo-700",
    //   badgeColor: "bg-indigo-700",
    //   value: "Served",
    // },
  ];

  const orderStatusColors = [
    { status: "Dine In", statusColor: "bg-teal-500", bgColor: "bg-teal-100" },
    {
      status: "Wait List",
      statusColor: "bg-orange-500",
      bgColor: "bg-orange-100",
    },
    {
      status: "Delivery",
      statusColor: "bg-yellow-500",
      bgColor: "bg-yellow-100",
    },
    {
      status: "Take Away",
      statusColor: "bg-purple-500",
      bgColor: "bg-purple-100",
    },
    {
      status: "Served",
      statusColor: "bg-indigo-500",
      bgColor: "bg-indigo-100",
    },
    {
      status: "cancelled",
      statusColor: "bg-red-500",
      bgColor: "bg-red-100",
    },
  ];

  const { user } = useContext(AuthContext);

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [orders, setOrders] = useState([]); // State to hold fetched orders
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  useEffect(() => {
    const loadOrders = async () => {
      try {
        if (!user.vendor_id) return; // Ensure vendor_id is available

        // Fetch cached orders from IndexedDB
        const cachedOrders = await db.orders.toArray();
        if (cachedOrders.length > 0) {
          const sortedCachedOrders = [...cachedOrders].sort(
            (a, b) => new Date(b.orderAt) - new Date(a.orderAt)
          );
          setOrders(sortedCachedOrders); // Set state with sorted cached orders
        }

        // Fetch new orders from API
        const fetchedOrders = await fetchOrdersByVendorId(user.vendor_id);
        const sortedFetchedOrders = [...fetchedOrders].sort(
          (a, b) => new Date(b.orderAt) - new Date(a.orderAt)
        );

        await db.orders.bulkPut(sortedFetchedOrders); // Cache fetched orders
        setOrders(sortedFetchedOrders); // Update state with sorted fetched orders

        setErrorMessage(""); // Clear any error messages
      } catch (error) {
        setErrorMessage("Failed to fetch orders. Please try again."); // Handle fetch errors
      }
    };

    loadOrders(); // Call the function to load orders
  }, [user.vendor_id]);

  // Check if there are any cancelled orders
  const hasCancelledOrders = orders.some(
    (order) => order.status === "cancelled"
  );

  // Update filter counts dynamically
  const updatedFilters = filters.map((filter) => {
    if (filter.value === "all") {
      return { ...filter, count: orders.length };
    }
    if (filter.value === "cancelled") {
      return {
        ...filter,
        count: orders.filter((order) => order.status === "cancelled").length,
      };
    }
    return {
      ...filter,
      count: orders.filter(
        (order) =>
          order.order_type === filter.value && order.status !== "cancelled"
      ).length,
    };
  });

  // Filter orders based on selected filter
  const filteredOrders = orders.filter((order) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "cancelled") return order.status === "cancelled";
    return order.order_type === selectedFilter && order.status !== "cancelled";
  });

  // Optionally, filter out filters with count 0 if you don't want to display them
  const displayedFilters = updatedFilters.filter(
    (filter) => filter.count !== 0
  );

  console.log("updatedFilters", updatedFilters);
  console.log("displayedFilters", displayedFilters);
  console.log("filteredOrders", filteredOrders);

  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <div className="p-6 bg-gray-50">
      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center sticky top-[5.5rem] z-10 bg-gray-50 mb-5 ">
        <div className="mb-4 flex items-center space-x-4 overflow-x-auto hide-scrollbar">
          {/* <div className="mb-4 flex items-center space-x-4  hide-scrollbar"> */}
          {/* Filter Buttons */}
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
          {/* </div> */}
        </div>

        <div className="flex items-center space-x-4">
          {/* Sort Dropdown */}
          {/* <div className="relative">
            <button
              onClick={toggleDropdown}
              className="bg-lime-100 flex items-center  text-gray-700 px-4 py-2 rounded-full font-medium shadow-sm hover:bg-lime-200 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"
            >
              <span class="material-icons">filter_list</span>
              Sort By
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => console.log("Sort by Newest First")}
                  >
                    Newest First
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => console.log("Sort by Oldest First")}
                  >
                    Oldest First
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => console.log("Sort by Order Type")}
                  >
                    Order Type
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => console.log("Sort by Items Count")}
                  >
                    Items Count
                  </button>
                </div>
              </div>
            )}
          </div> */}
          <button
            onClick={() => navigate("add-orders")}
            className={`px-4 py-2 rounded-full flex items-center  justify-center bg-orange-500 text-white shadow-md font-medium whitespace-nowrap`} // Added whitespace-nowrap
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
      </div>

      {/* Order Cards */}
      <div className="flex flex-wrap gap-4 hide-scrollbar">
        {filteredOrders.map((order) => {
          // Find the corresponding status color object based on order.type
          const statusColorObj = orderStatusColors.find(
            (statusColor) =>
              statusColor.status === order.order_type ||
              statusColor.status === order.status
          );

          // Check if the status is 'cancel' and set the background color accordingly
          const orderColor =
            order.status === "cancelled"
              ? "bg-red-300" // Set to red if the order is canceled
              : statusColorObj
              ? statusColorObj.bgColor
              : "bg-gray-200"; // Default color if not found

          const statusColor =
            order.status === "cancelled"
              ? "bg-red-500"
              : statusColorObj
              ? statusColorObj.statusColor
              : "text-gray-800"; // Set text color, assuming gray for status colors

          return (
            <div
              key={order.order_id}
              className={`flex-1 min-w-[250px] max-w-sm p-4 rounded-lg ${orderColor} shadow whitespace-nowrap cursor-pointer`}
              onClick={() => setSelectedOrderId(order.order_id)}
            >
              <div className="flex justify-between">
                <h3 className="font-bold text-lg">{`Order ${order.order_local_id}`}</h3>
                <p className="text-gray-700">Table {order.table_num}</p>
              </div>
              <p className="mt-2 text-gray-800 font-medium">{`Items: ${order.count_item}X`}</p>
              <div className="flex justify-between items-center">
                <p className="mt-1 text-gray-500">
                  <ReactTimeAgo date={order.orderAt} locale="en-US" />
                </p>
                <div
                  className={`mt-3 text-white px-2 py-1 text-sm rounded-full ${statusColor}`}
                >
                  {order.order_type}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderLine;
