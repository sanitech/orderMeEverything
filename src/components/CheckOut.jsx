import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthProvider";
import { placeOrder } from "../utils/orderUtils";

const Checkout = ({ cart, setCart, total }) => {
  const { user } = useContext(AuthContext);
  const [selectedOrderType, setSelectedOrderType] = useState("Dine In");
  const [isLoading, setIsLoading] = useState(false);

  const totalItemsPrice = () => {
    return cart.reduce(
      (sum, item) => sum + item.original_price * item.count,
      0
    );
  };
  const discounts = 0;
  const totalPrice = totalItemsPrice() - discounts;

  const handleProcessOrder = async () => {
    setIsLoading(true);
    if (cart.length === 0) {
      alert("Your cart is empty!"); // Notify if the cart is empty
      return;
    }

    // Create order summary
    const orderSummary = {
      items: cart.map((item) => ({
        item_id: item.item_id,
        item_name: item.item_name,
        quantity: item.count,
        unit_price: item.original_price * item.count,
      })),
      total_price: totalPrice,
      orderedAt: new Date().toISOString(),
      orderStatus: "Pending",
      vendor_id: user.vendor_id,
      count_item: cart.length,
      orderType: selectedOrderType,
    };

    try {
      const response = await placeOrder(orderSummary); // Try placing the order

      console.log("Order placed successfully:", response);

      // Clear the cart after successful order
      setCart([]);
    } catch (error) {
      console.error("Error saving order:", error);

      // If there's an error, check if offline and store in localStorage
      if (!navigator.onLine) {
        console.log("Offline: Storing order in localStorage");
        const storedOrders =
          JSON.parse(localStorage.getItem("offlineOrders")) || [];
        storedOrders.push(orderSummary); // Add the current order
        localStorage.setItem("offlineOrders", JSON.stringify(storedOrders));
        alert(
          "Order saved locally, it will be processed once you're back online."
        );
        setCart([]);
      }
    }
    setIsLoading(false);
  };

  const handleSelectOrderType = (index) => {
    setSelectedOrderType(index);
  };

  const orderType = ["Dine In", "Take Away", "Delivery"];
  return (
    <div className="w-full h-screen bg-white rounded-lg shadow-md p-4 pt-0 space-y-4 overflow-y-auto hide-scrollbar">
      <div className="flex justify-between items-center sticky top-0 bg-white py-2">
        <h2 className="text-lg font-semibold">Order Details</h2>
        <button className="text-xl" onClick={() => setCart([])}>
          X
        </button>
      </div>
      <div className="flex space-x-2">
        {orderType.map((type, index) => (
          <button
            key={index}
            className={`px-3 py-1 rounded-full transition duration-300 ease-in-out font-medium whitespace-nowrap ${
              selectedOrderType === type
                ? "bg-orange-100 text-orange-700 shadow-lg transform scale-105"
                : "text-gray-500 hover:bg-gray-200 hover:text-black"
            }`}
            onClick={() => handleSelectOrderType(type)}
          >
            {type}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {cart.map((item, index) => (
          <div
            key={index}
            className="flex items-center bg-white px-3 py-4 shadow rounded-lg"
          >
            <img
              className="w-12 h-12 rounded-md"
              src={`${process.env.REACT_APP_IMAGE_URL}${item.image_url}`}
              alt={item.title}
            />
            <div className="ml-4 flex-1">
              <h4 className="font-semibold">{item.item_name}</h4>
              <p className="text-sm flex justify-between">
                <span>
                  {item.original_price}
                  <span className="text-gray-500 text-xs font-medium">ETB</span>
                </span>
                <span> x {item.count}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between">
          <p className="font-semibold">Items:</p>
          <p>
            {totalItemsPrice()}
            <span className="text-gray-500 text-xs font-medium">ETB</span>
          </p>
        </div>
        <div className="flex justify-between">
          <p className="font-semibold">Discounts:</p>
          <p>
            -{discounts}
            <span className="text-gray-500 text-xs font-medium">ETB</span>
          </p>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <p>Total:</p>
          <p className="text-orange-500">
            {totalPrice}
            <span className="text-gray-500 text-xs font-medium">ETB</span>
          </p>
        </div>
      </div>
      <button
        onClick={handleProcessOrder}
        className="w-full bg-orange-500 text-white py-2 rounded"
      >
        {isLoading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
};

export default Checkout;
