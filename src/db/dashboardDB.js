// Import Dexie for database operations
import Dexie from "dexie";

// Initialize the database
const dbDashboard = new Dexie("VendorsDashboard");

// Define a schema for your store
dbDashboard.version(1).stores({
  dashboardData: "id, orderCount, revenue, unavailableCount", // `id` is the primary key
});

// Export functions for common operations
export const saveDashboardData = async (data) => {
  return await dbDashboard.dashboardData.put(data); // Add or update the record
};

// Update getDashboardData to accept an optional ID parameter
export const getDashboardData = async (id) => {
  if (id) {
    // If an ID is provided, get the specific record by ID
    return await dbDashboard.dashboardData.get(id); // Get a specific record by ID
  } else {
    // If no ID is provided, return all records
    return await dbDashboard.dashboardData.toArray(); // Get all data in the store
  }
};

export const clearDashboardData = async () => {
  return await dbDashboard.dashboardData.clear(); // Clear all data in the store
};

export const deleteDashboardData = async (id) => {
  return await dbDashboard.dashboardData.delete(id); // Delete a specific record
};

export default dbDashboard;
