import React, { useContext, useEffect, useRef, useState } from "react";
import { foodCategories } from "../../constant/data";
import { AuthContext } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import db from "../../db/db";

const CategorySlider = ({ onSelectCategory }) => {
  const sliderRef = useRef(null); // Reference to the slider container
  const [selectedIndex, setSelectedIndex] = useState(null); // State for the selected category index
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
           return;
         }

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
  // Function to slide left
  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -100, behavior: "smooth" });
    }
  };

  // Function to slide right
  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 100, behavior: "smooth" });
    }
  };

  const handleSelectCategory = (index, category) => {
    setSelectedIndex(index); // Update the selected index
    onSelectCategory(category.category_id); // Call the parent function as well
  };

  return (
    <div className="flex items-center p-4 mb-4">
      <button
        onClick={slideLeft}
        className="w-10 h-10 flex justify-center items-center bg-white shadow-md rounded-full mr-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div
        ref={sliderRef}
        className="flex items-center space-x-4 overflow-x-auto hide-scrollbar"
      >
        {fetchedCategories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleSelectCategory(index, category)} // Handle category selection
            className={`min-w-[100px] h-28 text-center rounded-xl shadow-md flex flex-col justify-center items-center cursor-pointer transition-transform transform ${
              selectedIndex === index
                ? "bg-primary bg-opacity-20 scale-105" // Active state styling
                : "bg-primary bg-opacity-10"
            }`}
          >
            <div className="text-4xl mb-2">{category.icon}</div>
            <p className="text-sm font-medium text-gray-700">
              {category.category_name}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={slideRight}
        className="w-10 h-10 flex justify-center items-center bg-white shadow-md rounded-full ml-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default CategorySlider;
