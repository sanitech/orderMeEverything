import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { extraOrder, placeOrder } from "../utils/orderUtils";
import { useNavigate } from "react-router-dom";

const CheckOutExtra = ({ cart, setCart }) => {
  const { user } = useContext(AuthContext);
  const [selectedOrderType, setSelectedOrderType] = useState("Dine In");
  const navigate = useNavigate();

  console.log("ss", cart);

  const calculateTotalPrice = (items) => {
    return items
      .reduce((total, item) => {
        const price = parseFloat(item.original_price); // Convert price to float
        const quantity = item.quantity || item.count || 1; // Use quantity if available, otherwise use count or default to 1
        return total + price * quantity; // Calculate total
      }, 0)
      .toFixed(2); // Return total as a string with two decimal places
  };

  const totalPrice = calculateTotalPrice(cart);
  console.log(`Total Price: $${totalPrice}`);

  const discounts = 0;
  const totalCartPrice = totalPrice - discounts;

  const handleProcessOrder = async () => {
    alert("Process Order");
    if (cart.length === 0) {
      alert("Your cart is empty!"); // Notify if the cart is empty
      return;
    }

    // Create order summary
    const orderId = cart[0].order_id;
    console.log("my cart", cart);
    const existingOrdersString = await localStorage.getItem("orders");

    // Create a new order ID
    const orderSummary = {
      // id: `#${firstCharacter}${orderId}`,
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

    console.log(orderSummary);
    // Save order to localStorage
    try {
      const response = await extraOrder(orderId, orderSummary); // Call the utility function
      console.log("Order placed successfully:", response);
    } catch (error) {
      console.error("Error saving order:", error);
    }

    // Optionally clear the cart after ordering
    setCart([]);
    navigate(-1);
  };

  const handleSelectOrderType = (index) => {
    setSelectedOrderType(index);
  };

  const orderType = ["Dine In", "Take Away", "Delivery"];
  return (
    <div className="w-full h-screen bg-white rounded-lg shadow-md p-4 pt-0  space-y-4 overflow-y-auto hide-scrollbar">
      <div className="flex justify-between items-center sticky top-0 bg-white  py-2">
        <h2 className="text-lg font-semibold">Extra Order </h2>
        <button className="text-xl">...</button>
      </div>
      <div className="flex space-x-2 ">
        {orderType.map((type, index) => (
          <button
            key={index}
            className={`px-3 py-1 rounded-full transition duration-300 ease-in-out font-medium whitespace-nowrap ${
              selectedOrderType === type
                ? "bg-green-100 text-green-700 shadow-lg transform scale-105"
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
              src={`${process.env.REACT_APP_IMAGE_URL}${item.image_url}`} // Use REACT_APP_ prefix
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
            {calculateTotalPrice(cart)}
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
          <p className="text-green-500">
            {totalCartPrice}
            <span className="text-gray-500 text-xs font-medium">ETB</span>
          </p>
        </div>
      </div>
      <button
        onClick={handleProcessOrder}
        className="w-full bg-green-500 text-white py-2 rounded"
      >
        Check Out Extra
      </button>
    </div>
  );
};

export default CheckOutExtra;
