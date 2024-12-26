import React, { useEffect, useState } from "react";
import { foodCategories } from "../../constant/data";
import axios from "axios";
import { useParams } from "react-router-dom";

const CategoryCustomerSide = ({ setCategory, category, menuStatus }) => {
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6); // Default to 6 categories visible
  const { vendor } = useParams();

  const handleCategoryClick = (id) => {
    console.log("Clicking category:", id);
    if (id !== undefined) {
      setCategory(id);
    } else {
      console.error("Category ID is undefined");
    }
  };

  useEffect(() => {
    const fetchCategoriesByVendorId = async () => {
      try {
        const response = await axios.get(
          `/v1/menu/category/customer/${vendor}`
        );
        setFetchedCategories(response.data);
        console.log("Fetched categories:", response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (vendor) {
      fetchCategoriesByVendorId();
    }
  }, [vendor]);

  const handleMoreClick = () => {
    setVisibleCount((prevCount) => prevCount + 8); // Increase by 8 more categories each time
  };

  return (
    <div className="p-4 grid grid-cols-4 md:grid-cols-6 gap-4" id="category">
      <a
        href="#menu"
        onClick={() => handleCategoryClick(0)} // Assuming 0 represents "All"
        className={`flex flex-col items-center space-y-2 ${
          category === 0
            ? "bg-orange-500 text-white"
            : "bg-white text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700"
        } rounded-md p-4 shadow-md`}
      >
        <span
          className={`material-icons font-bold text-4xl ${
            category == 0 ? "text-white" : "text-orange-500"
          } `}
        >
          all_inbox
        </span>
        <p className="text-sm text-gray-700 dark:text-gray-300">All</p>
      </a>

      {fetchedCategories.length > 0 ? (
        fetchedCategories.slice(0, visibleCount).map((categories) => (
          <a
            href="#menu"
            key={categories.category_id}
            onClick={() => handleCategoryClick(categories.category_id)}
            className={`flex flex-col items-center space-y-2 ${
              category === categories.category_id
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            } rounded-md p-4 shadow-md`}
          >
            <div className="text-4xl">{categories.icon}</div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {categories.category_name}
            </p>
          </a>
        ))
      ) : (
        <p className="text-center dark:text-gray-300">
          No categories available
        </p>
      )}

      {/* Only show the "More" button if there are still more categories to show */}
      {visibleCount < fetchedCategories.length && (
        <a
          href="#category"
          className="flex flex-col items-center space-y-2 bg-gray-100 rounded-md p-4 shadow-md dark:bg-gray-800"
          onClick={handleMoreClick}
        >
          <span className="material-icons font-bold text-4xl text-orange-500">
            dashboard
          </span>
          <p className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            More
          </p>
        </a>
      )}
    </div>
  );
};

export default CategoryCustomerSide;
