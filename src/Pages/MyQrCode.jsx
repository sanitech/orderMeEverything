import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider";
import QRCode from "qrcode";
import download from "downloadjs";

const MyQrCode = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [qrCode, setQrCode] = useState(null);
  const BusinessName = "ada";
  const { user } = useContext(AuthContext);
  const currentDomain = window.location.origin; // This will give you the domain name

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const res = await axios.get(`/v1/menus/business/${user.vendor_id}`);
        return res.data.menuName; // Return the menu name directly
      } catch (error) {
        console.error("Error fetching menu data:", error);
        throw error; // Rethrow the error to handle it in the main function
      }
    };

    const generateQRCode = async (menuName) => {
      const currentDomain = window.location.origin;
      try {
        const qrCodeDataUrl = await QRCode.toDataURL(
          `${currentDomain}/menu/${menuName}`
        );
        setQrCode(qrCodeDataUrl);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    const initiateQRCodeGeneration = async () => {
      try {
        const menuName = await fetchMenuData();
        await generateQRCode(menuName);
      } catch (error) {
        // Additional handling if needed
      }
    };

    initiateQRCodeGeneration(); // Call the main function
  }, []); // Empty dependencies array to run only once
  
  const downloadQRCode = () => {
    if (qrCode) {
      // Create a temporary link to download the QR code
      const link = document.createElement("a");
      link.href = qrCode;
      link.download = "my_qr_code.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Generate QR Code for Your Menu
        </h1>
        <p className="text-gray-600">
          If You change Business name Must generate new QR Code
        </p>
      </header>

      {/* QR Code Display */}
      {qrCode && (
        <div className="mb-8">
          <img src={qrCode} alt="QR Code" className="w-64 h-64 mx-auto" />
          <button
            onClick={downloadQRCode}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded mx-auto block"
          >
            Download QR Code
          </button>
        </div>
      )}
    </div>
  );
};

export default MyQrCode;
