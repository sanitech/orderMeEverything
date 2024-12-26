import React, { useContext, useEffect, useState } from "react";
import { categories } from "../../constant/data";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthProvider";
import db from "../../db/db";

const Categories = ({ setCategory, category, menuStatus }) => {
  const [activeCategoryId, setActiveCategoryId] = useState(0); // Change default to "All"
  const navigate = useNavigate();
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const { user } = useContext(AuthContext);

  const handleCategoryClick = (id) => {
    setCategory(id);
    setActiveCategoryId(id);
  };

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

  return (
    <div className="p-4 sticky top-20 bg-white z-20">
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <div className="flex items-center mb-4 justify-between">
        <div className="flex space-x-4 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => handleCategoryClick(0)} // Set for "All"
            className={`flex items-center px-4 py-2 rounded-full shadow ${
              activeCategoryId === 0 // Check against activeCategoryId
                ? "bg-green-500 text-white"
                : "bg-white text-gray-700 border border-gray-200"
            } hover:shadow-lg transition whitespace-nowrap`}
          >
            <span className="text-lg mr-2 bg-orange-200 w-8 h-8 flex items-center justify-center rounded-full">
              🥪
            </span>
            <span className="text-sm font-medium">All</span>
          </button>
          {fetchedCategories.map((categoryItem) => (
            <button
              key={categoryItem.id}
              onClick={() => handleCategoryClick(categoryItem.category_id)} // Set active based on category_name
              className={`flex items-center px-4 py-2 rounded-full shadow ${
                category === categoryItem.category_id // Check active category by category_name
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-700 border border-gray-200"
              } hover:shadow-lg transition whitespace-nowrap`}
            >
              <span className="text-lg mr-2 bg-orange-200 w-8 h-8 flex items-center justify-center rounded-full">
                {categoryItem.icon}
              </span>
              <span className="text-sm font-medium">
                {categoryItem.category_name}
              </span>
            </button>
          ))}
        </div>

        {menuStatus === "vendor" && (
          <button
            onClick={() => navigate("add-menu")}
            className={`px-4 py-2 rounded-full flex items-center justify-center bg-orange-500 text-white shadow-md font-medium whitespace-nowrap`}
          >
            <svg
              viewBox="0 0 22 22"
              fill="currentColor"
              className="w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M4 12H20M12 4V20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>
            Add Menu
          </button>
        )}
      </div>
    </div>
  );
};

export default Categories;
