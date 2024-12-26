import React, { useContext, useLayoutEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Checkout from "./components/CheckOut";
import CheckOutExtra from "./components/CheckOutExtra";
import OrdersView from "./components/OrdersView";
import { AuthContext } from "./context/AuthProvider";
import { vendorStatusUtils } from "./utils/activitylogUtils";
import NotActiveAccount from "./components/NotActiveAccount";

const DashboardLayout = ({
  cartState,
  selectedOrderIdState,
  extraCartState,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const gridTemplateColumns = () => {
    if (window.innerWidth < 768) {
      return "1fr"; // Single column for small screens
    }
    return cartState.cart.length > 0 ||
      selectedOrderIdState.selectedOrderId ||
      extraCartState.extraCart.length > 0
      ? "250px auto 300px"
      : "250px auto 0px";
  };
  const { user } = useContext(AuthContext);

  const [vendorStatus, setVendorStatus] = useState(true);

  const checkVendorStatus = async () => {
    try {
      const vendorStatus = await vendorStatusUtils(user.vendor_id);
      console.log(vendorStatus);
      setVendorStatus(vendorStatus);
    } catch (error) {
      console.log(error);
    }
  };
  useLayoutEffect(() => {
    checkVendorStatus();
  }, [user]);

  return (
    <div
      className="h-screen grid gap-4 bg-amber-50 overflow-hidden transition-all duration-300"
      style={{
        gridTemplateColumns: gridTemplateColumns(),
      }}
    >
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform bg-white shadow-lg transition-transform duration-300 z-30 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:shadow-none`}
        style={{ width: "250px" }}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <main
        className="bg-white p-4 overflow-y-auto hide-scrollbar transition-all duration-300 flex-1"
        style={{ height: "calc(100vh - 16px)" }}
      >
        {/* Mobile Sidebar Toggle Button */}
        <button
          className="md:hidden p-2 bg-blue-500 text-white rounded mb-4"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? "Close Menu" : "Open Menu"}
        </button>
        {vendorStatus ? <Outlet /> : <NotActiveAccount />}
      </main>

      {/* Checkout Sidebar */}
      {cartState.cart.length > 0 && (
        <div
          className="fixed inset-y-0 right-0 w-72 bg-white shadow-lg z-20 overflow-y-auto"
          style={{ width: "300px" }} // Adjust width as needed
        >
          <Checkout
            cart={cartState.cart}
            setCart={cartState.setCart}
            totalCart={cartState.totalCart}
            setTotalCart={cartState.setTotalCart}
          />
        </div>
      )}

      {/* Order View Modal */}
      {cartState.cart.length === 0 && selectedOrderIdState.selectedOrderId && (
        <div className="z-40">
          {" "}
          {/* Increased z-index for visibility */}
          <OrdersView
            orderId={selectedOrderIdState.selectedOrderId}
            setSelectedOrderId={selectedOrderIdState.setSelectedOrderId}
            selectedOrderId={selectedOrderIdState.selectedOrderId}
          />
        </div>
      )}

      {/* Checkout Extra Modal */}
      {cartState.cart.length === 0 && extraCartState.extraCart.length > 0 && (
        <div className="z-40">
          {" "}
          {/* Increased z-index for visibility */}
          <CheckOutExtra
            cart={extraCartState.extraCart}
            setCart={extraCartState.setExtraCart}
            totalCart={extraCartState.totalExtraCart}
            setTotalCart={extraCartState.setTotalExtraCart}
          />
        </div>
      )}

      {/* Overlay for Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;
