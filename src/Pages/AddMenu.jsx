import React, { useContext, useState } from "react";
import CategorySlider from "../components/Category/CategorySlider";
import MenuPreview from "../components/Menu/MenuPreview";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider";
import compressImage from "../utils/CommpresImg";

const AddMenu = () => {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [menuImage, setMenuImage] = useState(null);
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const handleCategorySelect = (index) => {
    setSelectedCategory(index);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    compressImage(file)
      .then((compressedFile) => {
        console.log("Compressed file:", compressedFile);
        setMenuImage(compressedFile);
      })
      .catch((error) => {
        console.error("Error compressing image:", error);
      });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(""); // Clear previous messages
    setErrorMessage(""); // Clear previous messages

    console.log("Item added:", {
      name: itemName,
      price: itemPrice,
      category: selectedCategory,
      image: menuImage,
    });

    if (!selectedCategory) {
      setErrorMessage("Please select a category for your menu item.");
      return;
    }

    if (!menuImage) {
      setErrorMessage("Please upload an image for your menu item.");
      return;
    }

    const menuData = {
      item: itemName,
      price: itemPrice,
      category_id: selectedCategory,
      item_image: menuImage,
      vendor_id: user.vendor_id,
    };

    const formDataToSubmit = new FormData();

    Object.keys(menuData).forEach((key) => {
      formDataToSubmit.append(key, menuData[key]);
    });

    setIsLoading(true); // Set loading state to true

    try {
      const response = await axios.post("/v1/menus", formDataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setSuccessMessage("Menu item created successfully!"); // Set success message
        // Reset form fields if necessary
        setItemName("");
        setItemPrice("");
        setSelectedCategory(null);
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Error creating menu item:", error);
      setErrorMessage("Error creating menu item. ");

      // Check if the error is due to a response from the server
      if (error.response) {
        // Server responded with a status other than 2xx
        if (error.response.data && error.response.data.message) {
          setErrorMessage(
            (prevMessage) => prevMessage + error.response.data.message
          );
        } else {
          setErrorMessage(
            (prevMessage) => prevMessage + "Please check your input."
          );
        }
      } else if (error.request) {
        // The request was made but no response was received
        setErrorMessage("No response from the server. Please try again later.");
      } else {
        // Something happened in setting up the request
        setErrorMessage("Error: " + error.message);
      }
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  };

  return (
    <div className="p-5">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Create Menu</h1>
        <p className="text-gray-600">
          Please select the food categories you wish to include in your menu.
        </p>
      </header>

      {/* Category Slider at the top */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold my-2">Select a Category:</h2>
        <CategorySlider onSelectCategory={handleCategorySelect} />
      </div>

      {/* Display Success or Error Messages */}
      {successMessage && (
        <div className="mb-4 text-green-600 font-bold">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="mb-4 text-red-600 font-bold">{errorMessage}</div>
      )}

      <div className="flex gap-5">
        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full border rounded-lg p-5 shadow-md"
        >
          <label className="mb-2 text-gray-700">Item Name:</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Enter new item name"
            className="border-2 border-gray-400 p-2 rounded-lg w-full my-2"
            required
          />

          <label className="mb-2 text-gray-700">Item Price:</label>
          <input
            type="number"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            placeholder="Enter new item price"
            className="border-2 border-gray-400 p-2 rounded-lg w-full my-2"
            min="0"
            required
          />

          <label className="mb-2 text-gray-700">Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            className="border rounded-lg p-2 w-full my-2 opacity-0 hidden"
            id="imageUpload"
            onChange={handleImageUpload}
          />

          <button
            className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded my-4"
            onClick={(e) => {
              e.preventDefault(); // Prevent default form submission
              document.getElementById("imageUpload").click(); // Trigger the file input dialog
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Upload Image
          </button>
          <div className="flex items-center justify-center w-full">
            <button className="border bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded my-4 mr-3">
              Add Item
            </button>
          </div>
        </form>

        {/* Image Preview Section */}
        <div className="flex flex-col items-center h-fit border rounded-lg shadow-md w-1/3">
          <MenuPreview
            item={{
              title: itemName,
              price: Number(itemPrice),
              image: imagePreview,
            }}
            category={selectedCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default AddMenu;
