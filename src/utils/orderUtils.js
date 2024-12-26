import axios from "axios";

/**
 * Function to place an order
 *
 * @param {Object} orderSummary - The order details to be sent to the server
 * @returns {Promise} - Returns a promise that resolves to the server's response
 */
export const placeOrder = async (orderSummary) => {
  try {
    const response = await axios.post("/v1/orders", orderSummary, {
      headers: {
        "Content-Type": "application/json", // Assuming you're sending JSON
      },
    });

    return response.data; // Return server response
  } catch (error) {
    console.error("Error placing the order:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};


/**
 * Function to place an order
 *
 * @param {Object} orderSummary - The order details to be sent to the server
 * @returns {Promise} - Returns a promise that resolves to the server's response
 */
export const extraOrder = async (orderId, orderSummary) => {
  try {
    const response = await axios.put(`/v1/orders/extra/${orderId}`, orderSummary, {
      headers: {
        "Content-Type": "application/json", // Assuming you're sending JSON
      },
    });

    return response.data; // Return server response
  } catch (error) {
    console.error("Error placing the order:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

export const fetchOrdersByVendorId = async (vendorId) => {
  try {
    const response = await axios.get(`/v1/orders/vendor/${vendorId}`); // Adjust endpoint as needed
    return response.data; // Return the fetched orders
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

export const fetchOrdersByOrderId = async (orderId) => {
  try {
    const response = await axios.get(`/v1/orders/${orderId}`); // Adjust endpoint as needed
    return response.data; // Return the fetched orders
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

export const fetchOrdersItemsByOrderId = async (orderId) => {
  try {
    const response = await axios.get(`/v1/orders/items/${orderId}`);
    return response.data; // Return the fetched orders
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};


/**
 * Fetches today's revenue for a specific vendor.
 * @param {string} vendorId - The ID of the vendor.
 * @returns {Promise} - The Axios response promise.
 */
export const getTodayRevenueByVendor = async (vendorId) => {
  try {
    const response = await axios.get(
      `/v1/orders/revenue/today/${vendorId}`
    );
    return response.data; // return the response data
  } catch (error) {
    console.error("Error fetching today's revenue:", error);
    throw error; // Re-throw the error for handling in other parts of the app
  }
};



/**
 * Fetches today's order count for a specific vendor.
 * @param {string} vendorId - The ID of the vendor.
 * @returns {Promise} - The Axios response promise.
 */
export const getTodayOrderCountByVendor = async (vendorId) => {
  try {
    const response = await axios.get(`/v1/orders/count/today/${vendorId}`);
    return response.data; // return the response data
  } catch (error) {
    console.error("Error fetching today's order count:", error);
    throw error; // Re-throw the error for handling in other parts of the app
  }
};


/**
 * Function to cancel an order
 *
 * @param {string} orderId - The ID of the order to be canceled
 * @returns {Promise} - Returns a promise that resolves to the server's response
 */
export const cancelOrder = async (orderId) => {
  try {
    const response = await axios.put(`/v1/orders/cancel/${orderId}`); // Adjust endpoint as needed
    return response.data; // Return the server response indicating success
  } catch (error) {
    console.error("Error canceling the order:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};
