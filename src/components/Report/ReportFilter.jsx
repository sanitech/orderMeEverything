import React, { useContext, useEffect, useState } from "react";
import db, { getFoodCategory } from "../../db/db";
import { AuthContext } from "../../context/AuthProvider";
import axios from "axios";

const Filters = ({ onApply, isLoading }) => {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "",
    time_based: "today",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApply(filters);
  };
  useEffect(() => {
    const fetchCategoriesByVendorId = async () => {
      try {
        if (!user.vendor_id) return;

        const cachedCategories = await getFoodCategory();
        if (cachedCategories.length > 0) {
          setCategories(cachedCategories);
        } // Assuming cachedCategories is an array of categories

        const response = await axios.get(
          `/v1/menu/category/vendor/${user.vendor_id}`
        );
        await db.categories.bulkPut(response.data); // Cache categories in IndexedDB

        setCategories(response.data); // Assuming response.data is an array of categories
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
    <div className="bg-white shadow rounded-lg p-6 mb-6 flex flex-col md:flex-row items-center gap-4">
      {/* Start Date */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Start Date
        </label>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* End Date */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          End Date
        </label>
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          name="category"
          value={filters.category}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-orange-500"
        >
          <option value="">All Categories</option>
          {categories.length > 0 &&
            categories.map((categories) => (
              <option
                key={categories.category_id}
                value={categories.category_id}
              >
                {categories.category_name}
              </option>
            ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Time-based
        </label>
        <select
          name="time_based"
          value={filters.time_based}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-orange-500"
        >
          <option value="today">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Apply Button */}
      <div>
        <button
          onClick={handleApply}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-orange-600 transition"
        >
          {isLoading ? "Loading..." : "Apply Filters"}
        </button>
      </div>
    </div>
  );
};

export default Filters;
