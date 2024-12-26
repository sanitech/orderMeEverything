import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="w-full h-screen p-6 bg-white  rounded-lg flex flex-col justify-center items-center mb-6">
        <div className="flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full">
          <span className="text-white font-bold text-xl">M</span>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-orange-500">Mesobit</h1>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role && user.role.toLowerCase() == "vendor") {
    return children;
  } else {
    return <Navigate to="/unauthorized" replace />;
  }
};

export default ProtectedRoute;
