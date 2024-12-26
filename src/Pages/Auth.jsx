import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // new state for phone number
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.post("/v1/auth/signin", {
        username,
        password_hash: password,
      });

      console.log("req from clinet");

      const userData = response.data;
      login(userData);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err;
        if (axiosError.response) {
          setError(
            axiosError.response.data.message ||
              "Login failed. Please try again."
          );
        } else {
          setError("Network error. Please try again.");
        }
      } else {
        setError(
          err.message || "An unexpected error occurred. Please try again."
        );
      }
      setIsLoading(false);
      console.log(err);
    }
  };
  return (
    <div className="flex items-start justify-center min-h-screen bg-gradient-to-b from-white to-yellow-50 dark:gradient-to-b dark:from-black dark:to-gray-900">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-orange-500 dark:text-white">
            Mesobit
          </h1>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium dark:text-gray-300"
            >
              Email or username
            </label>
            <input
              id="email"
              type="text"
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Enter your email or username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Stay signed in
              </span>
            </label>
            <a
              href="#"
              className="text-sm text-orange-500 hover:underline dark:text-gray-300"
            >
              Forgot password?
            </a>
          </div>
          {error && (
            <div className="text-orange-500 p-4">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-orange-500 text-white rounded-md shadow hover:bg-orange-600 focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
          >
            {isLoading ? "Signing In..." : "Sign in"}
          </button>
        </form>
        {/* <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
      Don't have an account?{" "}
      <a href="#" className="text-orange-500 hover:underline">
        Create free account
      </a>
    </p> */}
      </div>
    </div>
  );
}

export default Login;
