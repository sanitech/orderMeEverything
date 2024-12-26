import React from "react";

const MenuPreview = ({ item }) => {
  return (
    <div className="w-full h-64 bg-white rounded-lg shadow-md border transition-opacity duration-300 ease-in-out">
      <img
        className="w-full h-40 object-cover rounded-xl bg-orange-100"
        src={item.image}
        alt={item.title}
      />
      <div className="mt-2 p-4">
        {/* Display Category on top of the Title */}
        <h6 className="text-sm font-medium text-gray-600 mb-1">{item.category}</h6>
        <h5 className="text-md font-semibold line-clamp-2">{item.title}</h5>
        <div className="flex justify-between items-center mt-1">
          <div className="flex items-baseline">
            <span className="text-xl font-bold">
              {item.price.toFixed(2)}
              <span className="text-sm text-gray-400"> ETB</span>
            </span>
            {item.originalPrice && (
              <span className="ml-2 text-sm text-gray-400 line-through">
                {item.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPreview;
