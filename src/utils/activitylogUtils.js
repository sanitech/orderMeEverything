import axios from "axios";

// Fetch today's order count for a specific vendor
export const getAllActivityLog = async (vendorId) => {
  try {
    const response = await axios.get(`/v1/activity`);
    return response.data; // Expecting { totalOrders: number }
  } catch (error) {
    console.error("Error fetching today's order count:", error);
    throw new Error("Failed to fetch today's order count");
  }
};

export const vendorStatusUtils = async (vendorId) => {
  try {
    const response = await axios.get(`/v1/approve/vendor/${vendorId}/status`);
    return response.data.vendorStatus; // Expecting { status: string }
  } catch (error) {
    console.error("Error fetching vendor status:", error);
    throw new Error("Failed to fetch vendor status");
  }
};

export const lastActive = async () => {
  try {
    const response = await axios.post(`/v1/users/last-active`);
    return response.data; // Expecting { status: string }
  } catch (error) {
    console.error("Error fetching vendor status:", error);
    throw new Error("Failed to fetch vendor status");
  }
};
