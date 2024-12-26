import React, { useContext, useEffect, useState } from "react";
import Filters from "./ReportFilter";
import SalesReportDashboard from "./SalesReportDashboard";
import TopProductsTable from "../Dashboard/TopProductsTable";
import axios from "axios";
import { AuthContext } from "../../context/AuthProvider";

const SalesReports = () => {
  const { user } = useContext(AuthContext);
  const [reportData, setReportData] = useState(null); // Set initial state to null
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: new Date(),
    category: "",
    time_based: "today",
  });

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(
          `/v1/reports/${user.vendor_id}`,
          dateRange
        );
        setReportData(response.data);
      } catch (error) {
        console.error("Error fetching data", error); // Consider adding error handling
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(); // Call fetchData directly
  }, []); // Empty dependencies array to run only once

  const onApply = async (filter) => {
    console.log(filter);
    setIsLoading(true);
    try {
      const response = await axios.post(
        `/v1/reports/${user.vendor_id}`,
        filter
      );
      setReportData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error applying filter", error); // Include error handling
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("am-ET", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Sales Reports</h1>
          <p className="text-sm text-gray-600">
            Analyze your cafe’s sales performance with detailed insights.
          </p>
        </div>
        <div className="text-4xl">🍹</div>
      </div>

      <Filters onApply={onApply} isLoading={isLoading} />

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {reportData && (
          <>
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Total Orders
              </h2>
              <p className="text-2xl font-bold text-orange-500">
                {reportData.OrdersCount != null &&
                !isNaN(reportData.OrdersCount)
                  ? new Intl.NumberFormat("en-US", {
                      maximumFractionDigits: 0,
                    }).format(reportData.OrdersCount)
                  : "0"}
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Average Order Value
              </h2>
              <p className="text-2xl font-bold text-orange-500">
                {reportData.OrdersCount > 0
                  ? formatCurrency(reportData.revenue / reportData.OrdersCount)
                  : "0"}
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Total Revenue
              </h2>
              <p className="text-2xl font-bold text-orange-500">
                {reportData.revenue != null
                  ? formatCurrency(reportData.revenue)
                  : "0.00 ETB"}
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Top Category
              </h2>
              <p className="text-2xl font-bold text-orange-500">
                {reportData?.topCategories?.length > 0
                  ? reportData.topCategories[0].category_name
                  : "No Data"}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Popular Items Section */}
      {reportData?.popularItems?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Popular Items
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {reportData.popularItems.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <img
                  src={process.env.REACT_APP_IMAGE_URL + item.image_url}
                  alt={item.item_name}
                  className="h-40 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.item_name}
                  </h3>
                  <p className="text-gray-600">{item.totalOrderCount} orders</p>
                  <p className="text-orange-500 font-bold">
                    {formatCurrency(item.revenue)} revenue
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Categories Section */}
      {reportData?.topCategories?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Popular Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {reportData.topCategories.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="text-4xl mb-2">{item.icon}</div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.category_name}
                  </h3>
                  <p className="text-gray-600">{item.totalOrderCount} orders</p>
                  <p className="text-orange-500 font-bold">
                    {formatCurrency(item.revenue)} revenue
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Sales Data */}
      {reportData?.orderView?.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Detailed Sales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <table className="w-full border-collapse col-span-3">
              <thead>
                <tr className="bg-gray-200">
                  <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">
                    Order ID
                  </th>
                  <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">
                    Date
                  </th>
                  <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">
                    Order Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportData.orderView.map((order, index) => {
                  return (
                    <tr
                      key={index}
                      className={`border-t ${
                        order.status === "cancelled" ? "bg-red-200" : ""
                      } `}
                    >
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {order.order_local_id}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {order.orderAt}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {!isNaN(order.total_price)
                          ? new Intl.NumberFormat("am-ET", {
                              style: "currency",
                              currency: "ETB",
                              maximumFractionDigits: 0,
                            }).format(order.total_price)
                          : "0"}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {order.order_type}
                      </td>
                      {/* <td className="px-4 py-2 text-sm text-gray-700">
                        {order.status}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {order.payment_method}
                      </td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6">
        <p className="text-center text-gray-500">
          &copy; {new Date().getFullYear()} Powered by IX-IT & Marketing
          Solution
        </p>
      </div>
    </div>
  );
};

export default SalesReports;
