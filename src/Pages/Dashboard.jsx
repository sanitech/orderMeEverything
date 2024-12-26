import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Categories from "../components/Category/Categories";
import Menu from "../components/Menu/Menu";
import Checkout from "../components/CheckOut";
import VendorsDashboard from "../components/Dashboard/DashBord";

const Dashboard = ({
  cart,
  setCart,
  selectedIds,
  setSelectedIds,
  category,
  setCategory,
}) => {
  return (
    <div className="dashboard transition-all duration-300">
      <VendorsDashboard />
    </div>
  );
};

export default Dashboard;
