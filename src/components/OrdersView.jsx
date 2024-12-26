import React, { useEffect, useState } from "react";
import {
  cancelOrder,
  fetchOrdersByOrderId,
  fetchOrdersItemsByOrderId,
} from "../utils/orderUtils";
import { useNavigate } from "react-router-dom";
import db from "../db/db";

const OrdersView = ({ setSelectedOrderId, selectedOrderId }) => {
  const [orders, setOrders] = useState(null);
  const [ordersItem, setOrdersItem] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!selectedOrderId) return;

      setIsLoading(true);
      setErrorMessage(""); // Clear error message before starting
      try {
        // Step 1: Attempt to fetch from IndexedDB
        const localOrder = await db.orders.get(selectedOrderId);
        const localOrderItems = await db.orderItems
          .where("order_id")
          .equals(selectedOrderId)
          .toArray();

        if (localOrder && localOrderItems.length > 0) {
          // Use local data if available
          setOrders(localOrder);
          setOrdersItem(localOrderItems);
        }
        // Step 2: Fetch from API if IndexedDB data is missing
        const [apiOrder, apiOrderItems] = await Promise.all([
          fetchOrdersByOrderId(selectedOrderId),
          fetchOrdersItemsByOrderId(selectedOrderId),
        ]);

        if (apiOrder.length === 0 || apiOrderItems.length === 0) {
          throw new Error("No data found for the given order ID.");
        }

        // Store fetched data in IndexedDB
        await db.orders.put(apiOrder[0]);
        await db.orderItems.bulkPut(apiOrderItems);

        setOrders(apiOrder[0]);
        setOrdersItem(apiOrderItems);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setErrorMessage(
          "Failed to fetch order details. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [selectedOrderId]);

  const handleCancelOrder = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmation) return;

    try {
      await cancelOrder(selectedOrderId);
      await db.orders.update(selectedOrderId, { status: "cancelled" });
      setSelectedOrderId("");
      alert("Order canceled successfully.");
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("Failed to cancel the order. Please try again.");
    }
  };

  const discounts = 0;

  return (
    <div className="w-full h-full overflow-y-auto bg-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center sticky top-0 pb-4">
        <h2 className="text-lg font-semibold">Order Details</h2>
        <button className="text-xl" onClick={() => setSelectedOrderId("")}>
          X
        </button>
      </div>

      {/* Loading or Error Messages */}
      {isLoading ? (
        <p>Loading...</p>
      ) : errorMessage ? (
        <p className="text-red-500">{errorMessage}</p>
      ) : !orders ? (
        <p className="text-gray-500">No order details available.</p>
      ) : (
        <div>
          {/* Order Items */}
          <div className="space-y-3">
            {ordersItem.map((item, index) => (
              <div
                key={index}
                className="flex items-center bg-white px-3 py-4 shadow rounded-lg"
              >
                <div className="ml-4 flex-1">
                  <h4 className="font-semibold">{item.item_name}</h4>
                  <p className="text-sm flex justify-between">
                    <span>
                      {item.original_price}
                      <span className="text-gray-500 text-xs font-medium">
                        {" "}
                        ETB
                      </span>
                    </span>
                    <span> x {item.count}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between">
              <p className="font-semibold">Items:</p>
              <p>
                {orders?.total_price || 0}
                <span className="text-gray-500 text-xs font-medium"> ETB</span>
              </p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold">Discounts:</p>
              <p>
                -{discounts}
                <span className="text-gray-500 text-xs font-medium"> ETB</span>
              </p>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <p>Total:</p>
              <p className="text-orange-500">
                {orders?.total_price - discounts || 0}{" "}
                <span className="text-gray-500 text-xs font-medium"> ETB</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {orders?.status === "cancelled" ||
            (new Date(orders.orderAt).getTime() >
              new Date().getTime() - 3600000 && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    navigate(`order/extra/${selectedOrderId}`, {
                      state: { items: ordersItem },
                    });
                    setSelectedOrderId("");
                  }}
                  className="w-full bg-lime-500 text-white py-2 rounded flex justify-center items-center"
                >
                  Add Item
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="w-full bg-red-500 text-white py-2 rounded"
                >
                  Cancel Order
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default OrdersView;
