import React from "react";

const Promotion = ({ moot, promotion, link, image }) => {
  return (
    <div>
      <div className="flex items-center bg-orange-100 p-6 rounded-lg">
        {/* Text Section */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">
            All best flavors and menus are available in one place
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            The best flavors and menus are only in one place, find your favorite
            food here, get discounts up to 30%.
          </p>
          <button className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600">
            Explore more!
          </button>
        </div>

        {/* Illustration */}
        <div className="ml-4">
          <img
            src="https://via.placeholder.com/150"
            alt="Illustration"
            className="w-32 h-32 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Promotion;
