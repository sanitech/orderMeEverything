import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

const AdminProtectedRoute = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);
console.log("Admin", user)
  if (isLoading) {
    return (
      <div>
        <div className="w-full h-screen p-6 bg-white  rounded-lg flex flex-col justify-center items-center mb-6">
          <div className="flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-orange-500">Mesobit</h1>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role.toLowerCase() === "admin") {
    return children;
  } else {
    // You can add a different route or component for non-admin users
    return <Navigate to="/unauthorized" replace />;
  }
};

export default AdminProtectedRoute;
