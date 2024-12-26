import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

// A component that handles redirection based on user authentication and role
const RedirectUserProtectedRoute = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);

  console.log("User data:", user, "Loading state:", isLoading);

  // Show a loading state while checking authentication
  if (isLoading) {
    return (
      <div className="w-full h-screen p-6 bg-white rounded-lg flex flex-col justify-center items-center">
        <div className="flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full">
          <span className="text-white font-bold text-xl">M</span>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-orange-500">Mesobit</h1>
      </div>
    );
  }

  // If no user is logged in, render children instead of redirecting
  if (!user) {
    console.warn("No user found, rendering children instead.");
    return <>{children}</>; // Render children when user is null
  }

  // Ensure that user.role exists and determine redirection path accordingly
  const userRole = user.role ? user.role.toLowerCase() : null;

  // Redirect based on user role
  let redirectPath;
  if (userRole === "vendor") {
    redirectPath = "/dashboard";
  } else if (userRole === "admin") {
    redirectPath = "/admin";
  } else {
    // Handle unknown roles as needed (optional)
    console.warn("Unknown user role:", userRole);
    return <Navigate to="/" replace />; // You can redirect to a default route for unknown roles
  }

  return <Navigate to={redirectPath} replace />; // Redirect to determined path
};

export default RedirectUserProtectedRoute;
