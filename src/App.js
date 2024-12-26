import React, { useContext, useEffect } from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Checkout from "./components/CheckOut";
import { AuthContext, AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./context/ProtectedRoute";
import Explore from "./Pages/Explore";
import Dashboard from "./Pages/Dashboard";
import Order from "./Pages/Order/Order";
import MenuPage from "./Pages/MenuPage";
import AddOrder from "./Pages/AddOrder";
import AdminSidebar from "./components/AdminSidebar";
import Vendors from "./Pages/Vendors";
import FoodCategorySelection from "./Pages/FoodCategorySelection";
import LoginScreen from "./Pages/LoginPage";
import FoodLanding from "./Pages/LandinPage";
import RegisterVendor from "./Pages/RegisterVendor";
import AddMenu from "./Pages/AddMenu";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en";
import EditMenu from "./Pages/EditMenu";
import DashboardLayout from "./DashboardLayout";
import OrderExtra from "./Pages/Order/OrderExtra";
import Login from "./Pages/Auth";
import RedirectUserProtectedRoute from "./context/RedirectUser";
import AdminProtectedRoute from "./context/AdminProtectedRoute";
import MenuExplore from "./Pages/MenuExplore";
import { placeOrder } from "./utils/orderUtils";
import SalesReports from "./components/Report/SaleReport";
import Setting from "./Pages/Setting";
import MyQrCode from "./Pages/MyQrCode";
import ActivityLogo from "./Pages/ActivityLogo";
import ActivityLog from "./Pages/ActivityLogo";
import axios from "axios";

import { lastActive } from "./utils/activitylogUtils";
import FoodDeliveryApp from "./Pages/LandinPage";
TimeAgo.addDefaultLocale(en);

// Custom hooks for managing state
const useCartState = () => {
  const [cart, setCart] = React.useState([]);
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [totalCart, setTotalCart] = React.useState(0);
  return {
    cart,
    setCart,
    selectedIds,
    setSelectedIds,
    totalCart,
    setTotalCart,
  };
};
const useExtraCartState = () => {
  const [extraCart, setExtraCart] = React.useState([]);
  const [selectedExtraIds, setSelectedExtraIds] = React.useState([]);
  const [totalExtraCart, setTotalExtraCart] = React.useState(0);
  return {
    extraCart,
    setExtraCart,
    selectedExtraIds,
    setSelectedExtraIds,
    totalExtraCart,
    setTotalExtraCart,
  };
};

const useCategoryState = () => {
  const [category, setCategory] = React.useState(0);
  return { category, setCategory };
};

const useSelectedOrderIdState = () => {
  const [selectedOrderId, setSelectedOrderId] = React.useState("");
  return { selectedOrderId, setSelectedOrderId };
};

// Layout components
const AppLayout = () => (
  <div>
    <Navbar />
    <main>
      <Outlet />
    </main>
  </div>
);

const AdminDashboardLayout = ({ cartState }) => (
  <div
    className="h-screen grid gap-4 bg-amber-50 overflow-hidden transition-all duration-300"
    style={{
      gridTemplateColumns: `250px auto ${
        cartState.cart.length > 0 ? "300px" : "0px"
      }`,
    }}
  >
    <AdminSidebar />
    <main
      className="bg-white p-4 overflow-y-auto hide-scrollbar"
      style={{ height: "calc(100vh - 16px)" }}
    >
      <Outlet />
    </main>
  </div>
);

const App = () => {
  const cartState = useCartState();
  const extraCartState = useExtraCartState();
  const categoryState = useCategoryState();
  const selectedOrderIdState = useSelectedOrderIdState();

  const { cart, selectedIds, category } = cartState;
  const { extraCart, selectedExtraIds } = extraCartState;

  useEffect(() => {
    console.log({
      cart,
      selectedIds,
      category,
      selectedOrderId: selectedOrderIdState.selectedOrderId,
      extraCart,
      selectedExtraIds,
    });
  }, [
    cart,
    selectedIds,
    category,
    extraCart,
    selectedExtraIds,
    selectedOrderIdState.selectedOrderId,
  ]);

  useEffect(() => {
    // Function to sync offline orders to the API when back online
    const syncOfflineOrders = async () => {
      const storedOrders =
        JSON.parse(localStorage.getItem("offlineOrders")) || [];

      if (storedOrders.length === 0) {
        console.log("No offline orders to sync.");
        return;
      }

      console.log("Syncing offline orders:", storedOrders);
      for (const order of storedOrders) {
        try {
          const response = await placeOrder(order); // Send order to the API
          console.log("Order synced successfully:", response);
        } catch (error) {
          console.error("Error syncing order:", error);
          continue; // Skip to the next order if sync fails
        }
      }

      // Clear localStorage after successful syncing
      localStorage.removeItem("offlineOrders");
    };

    const sendLastActive = async () => {
      try {
        const res = await lastActive();
        console.log(res);
      } catch (error) {
        console.log("error on last active", error);
      }
    };
    // Listen for the online event
    const handleOnline = () => {
      console.log("Back online, syncing orders...");
      syncOfflineOrders();
    };
    window.addEventListener("online", handleOnline);
    sendLastActive();
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []); // Empty dependency array to run only once

  return (
    <AuthProvider>
      {/* <div>hi</div> */}
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <RedirectUserProtectedRoute>
              <AppLayout />
            </RedirectUserProtectedRoute>
          }
        >
          <Route index element={<Explore />} />
          <Route
            path="menu/:vendor"
            element={<FoodDeliveryApp {...cartState} {...categoryState} />}
          />
          <Route path="auth" element={<Login />} />
          <Route path="admin/auth" element={<LoginScreen />} />
        </Route>

        {/* Protected Routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout
                cartState={cartState}
                selectedOrderIdState={selectedOrderIdState}
                extraCartState={extraCartState}
              />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Dashboard {...cartState} {...categoryState} />}
          />
          <Route
            path="category"
            element={
              <FoodCategorySelection {...cartState} {...categoryState} />
            }
          />
          <Route path="order" element={<Order {...selectedOrderIdState} />} />
          <Route
            path="order/extra/:order_id"
            element={
              <OrderExtra
                {...selectedOrderIdState}
                {...extraCartState}
                {...categoryState}
              />
            }
          />
          <Route
            path="order/add-orders"
            element={<AddOrder {...cartState} {...categoryState} />}
          />
          <Route
            path="menu"
            element={<MenuPage {...cartState} {...categoryState} />}
          />
          <Route
            path="menu/add-menu"
            element={<AddMenu {...cartState} {...categoryState} />}
          />
          <Route
            path="menu/edit/:menu_id"
            element={<EditMenu {...cartState} {...categoryState} />}
          />
          <Route path="report" element={<SalesReports />} />
          <Route path="setting" element={<Setting />} />
          <Route path="myqrcode" element={<MyQrCode />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboardLayout cartState={cartState} />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<h1>Admin Page</h1>} />
          <Route path="customer" element={<h1>Coming Soon</h1>} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="activity" element={<ActivityLog />} />
          <Route path="vendors/new" element={<RegisterVendor />} />
        </Route>
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
