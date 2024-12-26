import axios from "axios";

// Fetch today's order count for a specific vendor
export const getTodayOrderCountByVendor = async (vendorId) => {
  try {
    const response = await axios.get(`/v1/orders/count/today/${vendorId}`);
    return response.data; // Expecting { totalOrders: number }
  } catch (error) {
    console.error("Error fetching today's order count:", error);
    throw new Error("Failed to fetch today's order count");
  }
};

// Fetch today's revenue for a specific vendor
export const getTodayRevenueByVendor = async (vendorId) => {
  try {
    const response = await axios.get(`/v1/orders/revenue/today/${vendorId}`);
    return response.data; // Expecting { totalRevenue: number }
  } catch (error) {
    console.error("Error fetching today's revenue:", error);
    throw new Error("Failed to fetch today's revenue");
  }
};

// Fetch the count of unavailable menu items for a specific vendor
export const getUnavailableMenuCount = async (vendorId) => {
  try {
    const response = await axios.get(`/v1/menus/unavailable-count/${vendorId}`);
    return response.data; // Expecting { unavailableCount: number }
  } catch (error) {
    console.error("Error fetching unavailable menu count:", error);
    throw new Error("Failed to fetch unavailable menu count");
  }
};
