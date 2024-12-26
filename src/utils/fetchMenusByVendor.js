import axios from "axios";

export const fetchMenusByVendor = async (vendorId) => {
  try {
    const response = await axios.get(`/v1/menus/vendor/${vendorId}`);
    // Assuming response.data contains the array of menu items
    return response.data; // Return the fetched menu items
  } catch (error) {
    console.error("Error fetching menus:", error);

    // Error handling
    if (error.response) {
      // Server responded with a status other than 2xx
      throw new Error(error.response.data.message || "Failed to fetch menus.");
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("No response from the server. Please try again later.");
    } else {
      // Something happened in setting up the request
      throw new Error("Error: " + error.message);
    }
  }
};

const createQueryString = (params) => {
  return Object.entries(params)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
};

const handleError = (error) => {
  if (error.response) {
    // Server responded with a status other than 2xx
    return error.response.data.message || "Failed to fetch menus.";
  } else if (error.request) {
    // The request was made but no response was received
    return "No response from the server. Please try again later.";
  } else {
    // Something happened during the request setup
    return "Error: " + error.message;
  }
};

export const fetchMenusByVendorForCustomer = async (
  vendor,
  page,
  minPrice = null,
  maxPrice = null
) => {
  const params = {
    page: page,
    min_price: minPrice,
    max_price: maxPrice,
  };

  const queryString = createQueryString(params);

  console.log(`Fetching menus with params: ${JSON.stringify(params)}`);

  try {
    const response = await axios.get(
      `/v1/menus/customer/${vendor}?${queryString}`
    );
    console.log(response.data);

    // Assuming response.data contains the array of menu items
    return response.data; // Return the fetched menu items
  } catch (error) {
    const errorMessage = handleError(error);
    console.error("Error fetching menus:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const fetchMenusByID = async (menuId) => {
  try {
    const response = await axios.get(`/v1/menus/${menuId}`);
    // Assuming response.data contains the array of menu items
    return response.data; // Return the fetched menu items
  } catch (error) {
    console.error("Error fetching menus:", error);

    // Error handling
    if (error.response) {
      // Server responded with a status other than 2xx
      throw new Error(error.response.data.message || "Failed to fetch menus.");
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("No response from the server. Please try again later.");
    } else {
      // Something happened in setting up the request
      throw new Error("Error: " + error.message);
    }
  }
};
export const deleteMenusByID = async (menuId) => {
  try {
    const response = await axios.delete(`/v1/menus/${menuId}`);
    // Assuming response.data contains the array of menu items
    return response.data; // Return the fetched menu items
  } catch (error) {
    console.error("Error fetching menus:", error);

    // Error handling
    if (error.response) {
      // Server responded with a status other than 2xx
      throw new Error(error.response.data.message || "Failed to fetch menus.");
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("No response from the server. Please try again later.");
    } else {
      // Something happened in setting up the request
      throw new Error("Error: " + error.message);
    }
  }
};

export const updateMenuItem = async (menu_id, formData) => {
  try {
    const response = await axios.put(`/v1/menus/${menu_id}`, formData);
    return response; // Return the response for further handling
  } catch (error) {
    // Throw error to handle it in the calling function
    throw error;
  }
};

export const toggleMenuAvailability = async (itemId) => {
  try {
    const response = await axios.put(`/v1/menus/toggle-availability/${itemId}`);
    return response.data; // return the response data
  } catch (error) {
    console.error("Error toggling menu availability:", error);
    throw error; // Re-throw the error for handling in other parts of the app
  }
};

export const getUnavailableMenuCount = async (vendorId) => {
  try {
    const response = await axios.get(`/v1/menus/unavailable-count/${vendorId}`);
    return response.data; // return the response data
  } catch (error) {
    console.error("Error fetching unavailable menu count:", error);
    throw error; // Re-throw the error for handling in other parts of the app
  }
};
