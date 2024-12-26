import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import {
  getTodayOrderCountByVendor,
  getTodayRevenueByVendor,
  getUnavailableMenuCount,
} from "../../utils/dashboardUtils";
import { getDashboardData, saveDashboardData } from "../../db/dashboardDB";
import ActionButtons from "./DashboardButtons";

const VendorsDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    orderCount: null,
    revenue: null,
    unavailableCount: null,
  });
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const vendorId = user.vendor_id;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // First, try fetching from Dexie
        const cachedData = await getDashboardData(vendorId);

        // If cached data is found, set it to state and skip API calls
        if (cachedData) {
          setDashboardData(cachedData);
        }

        // If no cached data, fetch fresh data from the server
        const [orderResponse, revenueResponse, unavailableResponse] =
          await Promise.all([
            getTodayOrderCountByVendor(vendorId),
            getTodayRevenueByVendor(vendorId),
            getUnavailableMenuCount(vendorId),
          ]);

        const newData = {
          id: vendorId,
          orderCount: orderResponse.totalOrders || 0,
          revenue: revenueResponse.totalRevenue || 0,
          unavailableCount: unavailableResponse.unavailableCount || 0,
          lastUpdated: Date.now(),
        };

        // Update state and save fresh data in Dexie
        setDashboardData(newData);
        await saveDashboardData(newData);
      } catch (err) {
        setError("Failed to fetch dashboard data. Please try again.");
        console.error(err);
      }
    };

    fetchDashboardData();
  }, [vendorId]);

  const { orderCount, revenue, unavailableCount } = dashboardData;

  const cardsData = [
    {
      title: "Order Today",
      amount: orderCount,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      icon: "fastfood",
    },
    {
      title: "Revenue Today",
      amount: `${revenue || 0}`, // Format revenue as currency
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
      icon: "receipt_long",
    },
    {
      title: "Out of Stock",
      amount: unavailableCount,
      bgColor: "bg-orange-500",
      textColor: "text-orange-100",
      icon: "remove_shopping_cart",
    },
  ];

  return (
    <div>
      {/* {error && <p className="text-red-500">{error}</p>} */}
      <div className="flex flex-wrap gap-4 p-4">
        {cardsData.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} ${card.textColor} p-6 rounded-lg shadow-md flex-1 max-w-sm`}
          >
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <span className="material-icons">{card.icon}</span>
                <h3 className="text-lg font-bold">{card.title}</h3>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{card.amount}</h1>
            </div>
          </div>
        ))}
      </div>
      <ActionButtons />
    </div>
  );
};

export default VendorsDashboard;
