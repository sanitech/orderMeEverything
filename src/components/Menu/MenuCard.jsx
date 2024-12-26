import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toggleMenuAvailability } from "../../utils/fetchMenusByVendor";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const MenuCard = ({
  item,
  onAdd,
  onRemove,
  count,
  onSelect,
  isSelected,
  cardStatus,
}) => {
  const navigate = useNavigate();
  const handleClick = (event) => {
    // Prevent any default action that may cause scrolling
    event.stopPropagation();
    event.preventDefault();
    if (cardStatus === "Order") {
      onSelect();
    }
  };
  const [available, setAvailable] = useState(item.available);

  const handleToggleAvailability = async () => {
    try {
      // Immediately toggle the local state
      setAvailable((prevAvailable) => !prevAvailable);

      // Call the server to toggle availability
      const response = await toggleMenuAvailability(item.item_id);

      // Check if the server response indicates success
      if (response.success) {
        // Update the state with the new availability status from the server
        setAvailable(response.availability);
      } else {
        // If the server response indicates failure, revert the local state
        setAvailable((prevAvailable) => prevAvailable);
      }
    } catch (error) {
      // If there's an error, revert the local state to the previous value
      setAvailable((prevAvailable) => prevAvailable);
      alert("Failed to toggle availability: " + error.message);
    }
  };

  return (
    <div
      className={`flex-1 min-w-[250px] max-w-sm bg-white rounded-lg shadow-md m-2 border transition-opacity duration-300 ease-in-out ${
        isSelected ? "border-green-500" : ""
      }`}
      onClick={handleClick}
    >
      <LazyLoadImage
        className="w-96 h-44   object-cover rounded-xl bg-orange-100"
        src={`${process.env.REACT_APP_IMAGE_URL}${item.image_url}`}
        effect="blur"
        alt={item.item_name}
        // placeholderSrc={
        //   "https://th.bing.com/th/id/OIP.kSEb4dgLYwPHCj0QKdVcvQHaHk?rs=1&pid=ImgDetMain"
        // }
      />
      <div className="mt-2 p-4 ">
        <h5 className="text-md font-semibold line-clamp-2">{item.item_name}</h5>
        <div className="flex justify-between items-center">
          <div className="flex items-baseline">
            <span className="text-xl font-bold">
              {item.original_price
                ? Number(item.original_price).toFixed(2)
                : "N/A"}
              <span className=" text-sm text-gray-400">ETB</span>
            </span>
            {!isSelected
              ? item.price > 0 && (
                  <span className="ml-2 text-sm text-gray-400 line-through">
                    {item.price}
                    <span className=" text-sm text-gray-400">ETB</span>
                  </span>
                )
              : null}
          </div>
          {cardStatus === "Order" && (
            <div
              className="flex items-center justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              {isSelected && (
                <>
                  <button
                    onClick={onRemove}
                    className=" bg-gray-200 text-black  w-7 h-7 rounded-full flex items-center justify-center"
                  >
                    <span className="text-lg font-bold">-</span>
                  </button>
                  <div className="text-sm w-7 h-7 rounded-full font-medium flex items-center justify-center text-gray-400">
                    {count}
                  </div>
                  <button
                    onClick={onAdd}
                    className="bg-green-500 text-white  w-7 h-7 rounded-full flex items-center justify-center"
                  >
                    <span className="text-lg font-bold">+</span>
                  </button>
                </>
              )}
            </div>
          )}

          {cardStatus === "editor" && (
            <div className="flex gap-1 text-red-600">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleAvailability();
                }}
                className={`${
                  available ? "bg-green-200" : "bg-red-600"
                } text-white  w-7 h-7 rounded-full flex items-center justify-center`}
              >
                <span class="material-icons ">power_settings_new</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`edit/${item.item_id}`, { state: { item: item } });
                }}
                className="bg-green-300 text-white  w-7 h-7 rounded-full flex items-center justify-center"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                      stroke="#000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>{" "}
                    <path
                      d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                      stroke="#000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>{" "}
                  </g>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
