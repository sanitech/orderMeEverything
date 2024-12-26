import React, { useContext, useEffect, useState } from "react";
import { foodCategories } from "../constant/data";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider";
import db from "../db/db";

const FoodCategorySelection = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCategoriesByVendorId = async () => {
      try {
        if (!user.vendor_id) return;

        const cachedCategories = await db.categories.toArray();
        if (cachedCategories.length > 0) {
          setFetchedCategories(cachedCategories);
        } // Assuming cachedCategories is an array of categories

        const response = await axios.get(
          `/v1/menu/category/vendor/${user.vendor_id}`
        );
        await db.categories.bulkPut(response.data); // Cache categories in IndexedDB

        setFetchedCategories(response.data); // Assuming response.data is an array of categories
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (user.vendor_id) {
      fetchCategoriesByVendorId();
    }
  }, [user.vendor_id]);

  // Toggle the category selection from either foodCategories or fetchedCategories
  const toggleCategory = (category) => {
    console.log(category.id);
    setSelectedCategories((prevSelected) => {
      const isSelected = prevSelected.some((item) => item.id === category.id);

      if (isSelected) {
        // Deselecting the category
        if (
          fetchedCategories.some((item) => item.category_name === category.name)
        ) {
          // If the category is in fetchedCategories, delete it from the backend and cache
          deleteCategoryFromBackend(category.id); // Call API to delete

          // Remove it from the fetchedCategories
          const updatedFetchedCategories = fetchedCategories.filter(
            (item) => item.category_name !== category.name
          );
          setFetchedCategories(updatedFetchedCategories);

          // Optionally: Remove from db cache here if needed
          // await db.categories.delete(category.id); // Un-comment if you want to delete from cache in db
        }

        return prevSelected.filter((item) => item.id !== category.id); // Deselect
      } else {
        // Selecting the category
        return [...prevSelected, category];
      }
    });
  };

  const deleteCategoryFromBackend = async (categoryId) => {
    try {
      const response = await axios.delete(`/v1/menu/category/${categoryId}`);
      // Optionally handle successful delete response
      if (response.status === 200) {
        console.log(`Category with id ${categoryId} deleted successfully.`);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleCreateCategory = async () => {
    setIsLoading(true);

    try {
      console.log(selectedCategories);
      const cachedCategories = await db.categories.toArray(); // Fetching cached categories

      // Check and add selected categories that are not in cachedCategories
      selectedCategories.forEach((selectedCategory) => {
        const isInCache = cachedCategories.some(
          (cat) => cat.id === selectedCategory.id
        );

        // If not in cache, add to both cachedCategories and fetchedCategories
        if (!isInCache) {
          cachedCategories.push(selectedCategory); // Add to the cache (you might want to save this back to your DB)
          setFetchedCategories((prevCategories) => [
            ...prevCategories,
            selectedCategory,
          ]); // Add to fetchedCategories state
        }
      });

      const response = await axios.post("/v1/menu/category", {
        category: selectedCategories,
        vendor_id: user.vendor_id,
        description: "",
      });

      // Handle success response
      if (response.status === 200) {
        setIsLoading(false);
        console.log("Categories created successfully!", response.data);
        navigate("add-menu"); // Redirect to another page if needed
      }
    } catch (error) {
      console.error("Error creating categories:", error);
      setIsLoading(false); // Stop loading if there's an error

      // If network error, store in localStorage
      if (!navigator.onLine) {
        console.log("Network is down, storing categories in localStorage");
        const storedCategories =
          JSON.parse(localStorage.getItem("offlineCategories")) || [];
        const newCategories = [...storedCategories, ...selectedCategories];
        localStorage.setItem(
          "offlineCategories",
          JSON.stringify(newCategories)
        );
      }
    }
  };

  // Sync function to send offline categories to the server when online
  const syncOfflineCategories = async () => {
    const storedCategories =
      JSON.parse(localStorage.getItem("offlineCategories")) || [];
    if (storedCategories.length > 0) {
      try {
        const response = await axios.post("/v1/menu/category", {
          category: storedCategories,
          vendor_id: user.vendor_id,
          description: "",
        });

        if (response.status === 201) {
          console.log("Offline categories synced successfully!", response.data);
          localStorage.removeItem("offlineCategories"); // Clear localStorage after syncing
        }
      } catch (error) {
        console.error("Error syncing offline categories:", error);
      }
    }
  };

  // Listen for online status and sync when back online
  window.addEventListener("online", syncOfflineCategories);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Select Food Categories
        </h1>
        <p className="text-gray-600">
          Choose the categories that represent your café or restaurant's menu.
          You can select multiple options.
        </p>
      </header>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
        {foodCategories.map((category) => (
          <div
            key={category.id}
            className={`flex flex-col items-center justify-center border rounded-lg cursor-pointer p-4 ${
              selectedCategories.some((item) => item.id === category.id) ||
              fetchedCategories.some(
                (item) => item.category_name === category.name
              )
                ? "bg-orange-500 text-white border-orange-600"
                : "bg-white text-gray-800 border-gray-300"
            }`}
            onClick={() => toggleCategory(category)}
          >
            <span className="text-4xl">{category.icon}</span>
            <span className="text-sm font-medium mt-2">{category.name}</span>
          </div>
        ))}
      </div>

      {(fetchedCategories.length > 0 && selectedCategories.length > 0) ||
      (selectedCategories.length > 2 && fetchedCategories.length === 0) ? (
        <div className="flex justify-end mt-4 absolute bottom-0 right-0 left-0 bg-white shadow-sm p-3 transition-all duration-300 ease-in-out">
          <button
            className="px-4 py-2 rounded-sm flex items-center justify-center bg-orange-500 text-white shadow-md font-medium"
            onClick={handleCreateCategory}
          >
            {isLoading
              ? "Loading category"
              : fetchedCategories.length > 0
              ? "Save Categories"
              : "Set My Category"}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default FoodCategorySelection;
