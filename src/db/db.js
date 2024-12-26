import Dexie from "dexie";

// Create a Dexie database instance
const db = new Dexie("VendorAppDatabase");

// Define tables and schema
db.version(1).stores({
  menus:
    "item_id, item_name, category_id, category_name, image_url, price, original_price, available, created_at", // Use unique `item_id` as the key
  orders:
    "order_id, total_price, order_type, status, orderAt, customer_id, waiter_id, table_num, order_local_id, count_item, expires_at", // Use unique `order_id` as the key and add `expires_at`
  categories:
    "category_id, category_name, icon, availability, created_at, updated_at",
  orderItems:
    "order_item_id, order_id, vendor_id, item_id, item_name, item_price, count, original_price",
});

// Function to get food categories
export const getFoodCategory = async () => {
  const cachedCategories = await db.categories.toArray();
  if (cachedCategories.length > 0) {
    return cachedCategories;
  } // Assuming cachedCategories is an array of categories
};

// Function to set expiration date for orders
export const setOrderExpiration = async (order_id, expirationDate) => {
  try {
    await db.orders.update(order_id, { expires_at: expirationDate });
  } catch (error) {
    console.error("Error setting order expiration", error);
  }
};

// Function to delete expired orders
export const deleteExpiredOrders = async () => {
  try {
    const now = new Date();
    await db.orders.where('expires_at').belowOrEqual(now).delete();
  } catch (error) {
    console.error("Error deleting expired orders", error);
  }
};

// Function to delete the entire database
export const deleteDatabase = async () => {
  try {
    await db.delete();
    console.log("Database deleted successfully");
  } catch (error) {
    console.error("Error deleting database", error);
  }
};

export default db;
