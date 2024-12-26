import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLayoutEffect } from "react";
import { deleteDatabase } from "../db/db";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    // Check if user data exists in local storage
    const localUserData = localStorage.getItem("userData");

    if (localUserData) {
      // If user data exists, set it to state
      setUser(JSON.parse(localUserData));
    }
    setIsLoading(false);
  }, []);

  const login = async (response) => {
    try {
      // Redirect or perform other actions here
      const user = response.userData;
      localStorage.setItem("userData", JSON.stringify(user));
      localStorage.setItem("token", response.token);
      console.log("first", user);
      setUser(user);
      setIsLoading(false);
      if (user?.role.toLowerCase() === "admin") {
        navigate("admin/");
      } else if (user?.role.toLowerCase() === "vendor") {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await axios.post("/v1/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      setUser(null);
      setIsLoading(false);
      await deleteDatabase();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
