import React, { useContext, useEffect, useState } from "react";
import { categories } from "../../constant/data";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthProvider";

const CustomerCategories = ({ setCategory, category, menuStatus }) => {
  const [activeCategoryId, setActiveCategoryId] = useState(0); // Change default to "All"
  const navigate = useNavigate();
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const { vendor } = useParams();

  const handleCategoryClick = (id) => {
    setCategory(id);
    setActiveCategoryId(id);
  };

  useEffect(() => {
    const fetchCategoriesByVendorId = async () => {
      try {
        const response = await axios.get(
          `/v1/menu/category/customer/${vendor}`
        );
        setFetchedCategories(response.data); // Assuming response.data is an array of categories
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (vendor) {
      fetchCategoriesByVendorId();
    }
  }, [vendor]);

  return (
    <div className="p-4 sticky top-20 bg-white z-40">
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <div className="flex items-center mb-4 justify-between">
        <div className="flex space-x-4 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => handleCategoryClick(0)} // Set for "All"
            className={`flex items-center px-4 py-2 rounded-full shadow ${
              activeCategoryId === 0 // Check against activeCategoryId
                ? "bg-orange-500 text-white"
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
                  ? "bg-orange-500 text-white"
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
      </div>
    </div>
  );
};

export default CustomerCategories;
