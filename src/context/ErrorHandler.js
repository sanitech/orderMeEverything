import axios from "axios";
import React, { useState } from "react";

export const ErrorHandler = (err) => {
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [showToast, setShowToast] = useState(false);
  if (axios.isAxiosError(err)) {
    setToastMessage(err.response?.data.message || "Something went wrong.");
  } else {
    setToastMessage(err.message || "An unexpected error occurred.");
  }
  setToastType("error");
  setShowToast(true);
  setTimeout(() => {
    setShowToast(false);
  }, 5000);
};
