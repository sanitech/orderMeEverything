import React from "react";

const CafeMenuCard = () => {
  return (
    <div>
      <div className="max-w-md bg-orange-100 rounded-lg shadow-lg p-6 ">
        <div className="relative text-center">
          <div className="absolute top-0 right-0 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            🌶
          </div>
          <h2 className="text-lg font-bold text-purple-700 mb-2">Salsa</h2>
          <img
            src="https://image.freepik.com/free-vector/flat-food-background_23-2148046303.jpg" // Replace with actual image URL
            alt="Salsa Jar"
            className="mx-auto w-24 h-24 object-contain"
          />
          <p className="text-xs text-gray-600 mt-3">
            Salsa, a vibrant medley of tomatoes, onions, peppers, and herbs,
            adds a burst of freshness and spice to dishes.
          </p>
          <div className="absolute top-14 right-14 bg-white shadow-md text-sm font-bold px-2 py-1 rounded-md">
            14,49$
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafeMenuCard;
