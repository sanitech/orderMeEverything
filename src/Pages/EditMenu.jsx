import React, { useContext, useEffect, useState } from "react";
import CategorySlider from "../components/Category/CategorySlider";
import MenuPreview from "../components/Menu/MenuPreview";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider";
import { fetchMenuByOrderId } from "../utils/orderUtils";
import {
  deleteMenusByID,
  fetchMenusByID,
  updateMenuItem,
} from "../utils/fetchMenusByVendor";
import { useNavigate, useParams } from "react-router-dom";

const EditMenu = () => {
  const [menu, setMenu] = useState([]); // State to hold fetched Menu
  const { menu_id } = useParams();

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
    setMenuImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
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

    const menuData = {
      item: itemName,
      price: itemPrice,
      category_id: selectedCategory,
      item_image: menuImage, // Ensure this is a file object
      vendor_id: user.vendor_id,
    };

    const formDataToSubmit = new FormData();

    // Append data to FormData
    Object.keys(menuData).forEach((key) => {
      const value = menuData[key];
      if (value !== undefined && value !== null) {
        formDataToSubmit.append(key, value);
      }
    });

    setIsLoading(true); // Set loading state to true

    try {
      const response = await updateMenuItem(menu_id, formDataToSubmit); // No need to specify headers, axios will handle it

      if (response.status === 200) {
        setSuccessMessage("Menu item updated successfully!"); // Set success message
        // Reset form fields
        navigate(-1);
        setItemName("");
        setItemPrice("");
        setSelectedCategory(null);
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Error updating menu item:", error);
      setErrorMessage("Error updating menu item.");

      // Handle error response from the server
      if (error.response) {
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
        setErrorMessage("No response from the server. Please try again later.");
      } else {
        setErrorMessage("Error: " + error.message);
      }
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  };

  const navigate = useNavigate();

  const handleDelete = async () => {
    alert('Are you sure you want to delete this menu item?');
    try {
      const response = await deleteMenusByID(menu_id);
      navigate(-1);
    } catch (error) {
      console.error("Error deleting menu item:", error);
      alert(
        "An error occurred while trying to delete the menu item. Please try again later."
      );
    }
  };

  useEffect(() => {
    const loadMenu = async () => {
      if (menu_id) {
        // Ensure menu_id is available
        try {
          const fetchedMenu = await fetchMenusByID(menu_id); // Fetch Menu
          setMenu(fetchedMenu); // Update state with fetched Menu
          console.log(fetchedMenu);

          // Populate the form fields with the fetched menu data
          setItemName(fetchedMenu.item_name || "");
          setItemPrice(fetchedMenu.original_price || "");
          setSelectedCategory(fetchedMenu.category_id || null);
          setImagePreview(fetchedMenu.image_url || null);
        } catch (error) {
          setErrorMessage("Failed to fetch Menu. Please try again."); // Handle any fetch errors
        }
      }
    };

    loadMenu(); // Call the function to load Menu
  }, [menu_id]); // Run effect when menu_id changes

  return (
    <div className="p-5">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Edit Menu</h1>
        <p className="text-gray-600">
          Please select the food categories you wish to include in your menu.
          You can choose multiple options to customize your offerings.
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
        <div className="flex flex-col w-full border rounded-lg p-5 shadow-md">
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
            <button
              onClick={() => handleSubmit()}
              className="border bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded my-4 mr-3"
            >
              Save Item
            </button>
            <button
              onClick={() => handleDelete()}
              className="border border-red-500 hover:border-red-600 text-red-400 font-bold py-2 px-4 rounded my-4"
            >
              Delete Item
            </button>
          </div>
        </div>

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

export default EditMenu;
