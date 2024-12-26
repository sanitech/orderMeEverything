import React, { useState } from "react";
import BussinessInfo from "../components/Register/BussinessInfo";
import Upload from "../components/Register/Upload";
import LoginCredential from "../components/Register/LoginCredential";
import axios from "axios";
import CheckInCheckOut from "../components/Register/SocialMediaAndCehkIn";

const RegisterVendor = () => {
  // State for form data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    businessName: "",
    businessType: "",
    businessLogo: "",
    checkIn: "",
    checkOut: "",
    website: "",
  });

  // State for handling form submission feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Function to update form data dynamically
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Form submission handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    // Basic form validation
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    // Create a new FormData object
    const formDataToSubmit = new FormData();

    // Append each field to the FormData object
    Object.keys(formData).forEach((key) => {
      formDataToSubmit.append(key, formData[key]);
    });

    // Example API endpoint
    const apiEndpoint = "/v1/vendor/register";

    try {
      // API call to submit form data
      const response = await axios.post(apiEndpoint, formDataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle successful submission
      if (response.status === 201) {
        setSuccessMessage("Vendor registered successfully!");
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          businessName: "",
          businessType: "",
          businessLogo: "",
          checkIn: "",
          checkOut: "",
          website: "",
        });
      }
    } catch (error) {
      // Handle errors from the API
      setErrorMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Register as a Vendor
        </h1>
        <p className="text-gray-600">
          Fill out the form to register your café or restaurant.
        </p>
      </header>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <BussinessInfo
          businessName={formData.businessName}
          setBusinessName={(value) => handleInputChange("businessName", value)}
          businessType={formData.businessType}
          setBusinessType={(value) => handleInputChange("businessType", value)}
          phone={formData.phone}
          setPhone={(value) => handleInputChange("phone", value)}
        />
        <CheckInCheckOut
          checkIn={formData.checkIn}
          setCheckIn={(value) => handleInputChange("checkIn", value)}
          checkOut={formData.checkOut}
          setCheckOut={(value) => handleInputChange("checkOut", value)}
          website={formData.website}
          setWebsite={(value) => handleInputChange("website", value)}
        />
        <Upload
          businessLogo={formData.businessLogo}
          setBusinessLogo={(value) => handleInputChange("businessLogo", value)}
        />
        <LoginCredential
          username={formData.username}
          setUsername={(value) => handleInputChange("username", value)}
          email={formData.email}
          setEmail={(value) => handleInputChange("email", value)}
          password={formData.password}
          setPassword={(value) => handleInputChange("password", value)}
          confirmPassword={formData.confirmPassword}
          setConfirmPassword={(value) =>
            handleInputChange("confirmPassword", value)
          }
        />
        {/* Feedback messages */}
        {errorMessage && (
          <div className="mb-4 text-red-600 text-center">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="mb-4 text-green-600 text-center">
            {successMessage}
          </div>
        )}
        <div className="col-span-1 md:col-span-2 flex justify-center">
          <button
            type="submit"
            className={`px-6 py-3 text-white font-bold rounded ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-orange-600"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterVendor;
