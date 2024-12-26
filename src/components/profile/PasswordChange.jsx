import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const PasswordChange = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrors("");
    setIsLoading(true); // Corrected here
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrors("Please fill all fields");
      setIsLoading(false); // Corrected here
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors("Passwords do not match");
      setIsLoading(false); // Corrected here
      return;
    }

    if (newPassword.length < process.env.REACT_APP_PASSWORD_LENGTH) {
      setErrors(
        `Password must be at least ${process.env.REACT_APP_PASSWORD_LENGTH} characters long`
      );
      setIsLoading(false); // Corrected here
      return;
    }

    try {
      const response = await axios.put(`/v1/users/changePassword`, {
        oldPassword: currentPassword,
        newPassword,
      });
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
      setIsLoading(false); // Corrected here
      setToastMessage(response.data.message);
      setToastType("success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        handleError(error);
        setIsLoading(false); // Corrected here
      } else {
        setErrors("An unknown error occurred");
        setToastMessage("An unknown error occurred");
        setToastType("error");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
        setIsLoading(false); // Corrected here
      }
    }
  };

  const handleError = (err) => {
    const errorMessage = err.response?.data.message || "Something went wrong.";
    setErrors(errorMessage);
    setToastMessage(errorMessage);
    setToastType("error");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  return (
    <form
      onSubmit={handlePasswordChange}
      className="grid grid-cols-5 gap-2 sm:gap-5 w-2/3"
    >
      <div className="sm:col-span-2">
        <label
          htmlFor="current-password"
          className="inline-block text-sm text-gray-700 mt-2.5"
        >
          Current Password
        </label>
      </div>
      <div className="sm:col-span-3 max-w-sm">
        <input
          id="current-password"
          type="password"
          className="py-2 px-3 pe-11 block w-full border border-gray-200 shadow-sm text-sm rounded-lg focus:border-gray-500 focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none"
          placeholder="Enter current password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>

      <div className="sm:col-span-2">
        <label
          htmlFor="new-password"
          className="inline-block text-sm text-gray-700 mt-2.5"
        >
          New Password
        </label>
      </div>
      <div className="sm:col-span-3 max-w-sm">
        <input
          id="new-password"
          type="password"
          className="py-2 px-4 block w-full border border-gray-200 rounded-md text-sm focus:border-gray-500 focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none"
          placeholder="Enter new password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div className="sm:col-span-2">
        <label
          htmlFor="confirm-password"
          className="inline-block text-sm text-gray-700 mt-2.5"
        >
          Confirm Password
        </label>
      </div>
      <div className="sm:col-span-3 max-w-sm">
        <input
          id="confirm-password"
          type="password"
          className="py-2 px-4 block w-full border border-gray-200 rounded-md text-sm focus:border-gray-500 focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div
          id="hs-strong-password-minLength"
          data-hs-strong-password={{
            target: "#new-password",
            stripClasses:
              "hs-strong-password:opacity-100 hs-strong-password-accepted:bg-teal-500 h-2 flex-auto rounded-full bg-gray-900 opacity-50 mx-1",
            minLength: process.env.REACT_APP_PASSWORD_LENGTH || 8,
          }}
          className="flex mt-2 -mx-1"
        ></div>
        {errors && (
          <div className="col-span-5">
            <p className="text-xs text-red-600 mt-2" id="password-error">
              {errors}
            </p>
          </div>
        )}

        {toastType === "success" && (
          <div className="col-span-5">
            <p className="text-xs text-green-600 mt-2" id="password-error">
              {toastMessage}
            </p>
          </div>
        )}

        <div className="col-span-3 mt-6 flex gap-4 items-center">
          <button
            type="submit"
            className="bg-gray-900 hover:bg-gray-600 border border-gray-700 text-white px-3 py-2 rounded-md"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Change Password"}
          </button>
          <Link to="#" className="text-gray-800 hover:text-gray-700">
            I forgot my password
          </Link>
        </div>
      </div>
    </form>
  );
};

export default PasswordChange;
