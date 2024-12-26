import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { fetchMenusByVendorForCustomer } from "../utils/fetchMenusByVendor";
import CategoryCustomerSide from "../components/Category/CategoryCustomerSide";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Make sure to import skeleton styles

const FoodDeliveryApp = ({
  cart,
  setCart,
  setSelectedIds,
  selectedIds,
  category,
  setCategory,
}) => {
  const { vendor } = useParams();
  const [menus, setMenus] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load menus based on vendor, page number, and price range
  const loadMenus = useCallback(async () => {
    if (!vendor) {
      setErrorMessage("Vendor not available");
      return;
    }

    // Set loading state depending on reset
    const loadingIndicator = page === 1 ? setIsLoading : setIsLoadingMore;
    loadingIndicator(true);

    try {
      const response = await fetchMenusByVendorForCustomer(
        vendor,
        page,
        minPrice,
        maxPrice
      );
      const fetchedMenus = response.menu_items;

      setTotalPages(response.pagination.totalPages);

      // Remove duplicates before setting state
      setMenus((prevMenus) => {
        const existingIds = new Set(prevMenus.map((menu) => menu.item_id));
        const newMenus = fetchedMenus.filter(
          (menu) => !existingIds.has(menu.item_id)
        );
        return [...prevMenus, ...newMenus]; // Combine previous and new menus
      });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      // Reset loading states
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [vendor, page, minPrice, maxPrice]);

  // Load menus when vendor, minPrice, maxPrice, or page changes
  useEffect(() => {
    loadMenus(); // Load the items
  }, [vendor, minPrice, maxPrice, page, loadMenus]);

  // Scroll event to load more menus when reaching the bottom of the page
  useEffect(() => {
    const handleScroll = () => {
      const isBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100;

      if (isBottom && !isLoadingMore && page < totalPages) {
        console.log("Loading more items...");
        setPage((prevPage) => prevPage + 1); // Load the next page
      }
    };

    window.addEventListener("scroll", handleScroll); // Attach event listener
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup listener
  }, [isLoadingMore, page, totalPages]); // Dependency array

  // Handle ordering items - avoids duplicates
  const handleOrder = (id) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.item_id === id
      );
      if (existingItemIndex >= 0) {
        const newCart = [...prevCart];
        newCart.splice(existingItemIndex, 1); // Remove the item
        return newCart;
      } else {
        const item = menus.find((menuItem) => menuItem.item_id === id);
        return item ? [...prevCart, { ...item, count: 1 }] : prevCart; // Add the item
      }
    });

    // Toggle selection status of the item ID
    setSelectedIds(
      (prevSelectedIds) =>
        prevSelectedIds.includes(id)
          ? prevSelectedIds.filter((selectedId) => selectedId !== id) // Remove ID if already selected
          : [...prevSelectedIds, id] // Add ID if not already selected
    );
  };

  // Calculate total from selected items
  const calculateTotal = () => {
    return cart
      .reduce((sum, item) => sum + item.original_price * item.count, 0)
      .toFixed(2); // Format to 2 decimal places
  };

  // Update item count in the cart
  const updateItemCount = (id, action) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((cartItem) => {
        if (cartItem.item_id === id) {
          const newCount =
            action === "add" ? cartItem.count + 1 : cartItem.count - 1;
          return { ...cartItem, count: Math.max(newCount, 0) }; // Do not allow negative counts
        }
        return cartItem;
      });
      return updatedCart.filter((cartItem) => cartItem.count > 0); // Remove items with count 0
    });
  };

  // Display titles of selected items
  const displayedTitles = () => {
    if (cart.length === 0) return ""; // Return empty string if no items
    const displayedItems = cart.slice(0, 2).map((item) => item.item_name); // Take only first 2 items
    return (
      displayedItems.join(", ") +
      (displayedItems.length === 2 ? " and " : "") +
      (cart.length > 2 ? "..." : "")
    );
  };

  // Apply filter logic using useMemo
  const filteredItems = useMemo(() => {
    return menus.filter((item) => {
      const matchesCategory = category === 0 || item.category_id === category;
      const matchesSearchText =
        !searchText ||
        item.item_name.toLowerCase().includes(searchText.toLowerCase());
      const matchesMinPrice =
        minPrice === null || item.original_price >= minPrice;
      const matchesMaxPrice =
        maxPrice === null || item.original_price <= maxPrice;

      return (
        matchesCategory &&
        matchesSearchText &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });
  }, [menus, category, searchText, minPrice, maxPrice]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) => setIsDarkMode(event.matches);

    setIsDarkMode(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 dark:text-white">
      {/* Search and Filter UI */}
      <div className="flex items-center p-3 rounded-full border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-search"
          viewBox="0 0 16 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
        <input
          className="w-full bg-transparent border-none outline-none py-2 pl-4 focus:ring-0 text-gray-700 dark:text-gray-200"
          type="text"
          placeholder="Search food, drink, etc."
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
        <span
          className="material-icons cursor-pointer"
          onClick={() => setOpenFilter(!openFilter)}
        >
          tune
        </span>
      </div>

      {openFilter && (
        <div className="flex flex-col transition-all duration-75 p-4 mb-2 bg-white dark:bg-gray-900 rounded-md shadow-md">
          <p className="text-gray-700 dark:text-gray-200 mb-2 font-semibold text-lg">
            Filter by Your Budget
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
            Set your minimum and maximum budget for better results.
          </p>
          <div className="flex transition-all duration-75 items-center justify-between gap-4 bg-white dark:bg-gray-900 rounded-md shadow-md">
            <input
              className="w-full bg-gray-100 dark:bg-gray-600 border-none rounded-md outline-none py-2 pl-4 focus:ring-0 text-gray-700 dark:text-gray-200"
              type="number"
              placeholder="Min"
              onChange={(e) =>
                setMinPrice(e.target.value ? Number(e.target.value) : null)
              }
              value={minPrice || ""}
            />
            <input
              className="w-full bg-gray-100 border-none dark:bg-gray-600 rounded-md outline-none py-2 pl-4 focus:ring-0 text-gray-700 dark:text-gray-200"
              type="number"
              placeholder="Max"
              onChange={(e) =>
                setMaxPrice(e.target.value ? Number(e.target.value) : null)
              }
              value={maxPrice || ""}
            />
            <a
              href="#menu"
              onClick={loadMenus}
              className="py-2 px-4 bg-orange-500 active:bg-orange-300 text-white rounded-md flex flex-row items-center justify-center cursor-pointer"
            >
              Filter
            </a>
          </div>
        </div>
      )}

      <CategoryCustomerSide category={category} setCategory={setCategory} />

      <div className={`p-4 ${cart.length > 0 ? "mb-20" : ""}`} id="menu">
        <div className="flex justify-between items-center mb-4">
          <p className="font-semibold text-gray-900 text-lg dark:text-white">
            Highest rating in town
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {isLoading ? (
            // Skeleton loaders to show while loading
            [...Array(6)].map((_, index) => (
              <Skeleton
                key={index}
                baseColor={isDarkMode ? "rgb(31, 41, 55)" : "#e0e0e0"}
                height={200}
                className="rounded-lg"
              />
            ))
          ) : filteredItems.length === 0 ? (
            <div className="col-span-4 text-center text-gray-600 mt-4 dark:text-gray-400">
              No menu items found.
            </div>
          ) : (
            filteredItems
              .filter((item) => item.available)
              .map((restaurant, index) => (
                <div
                  key={`${restaurant.item_id}-${index}`} // Unique key
                  className={`rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 ${
                    selectedIds.includes(restaurant.item_id)
                      ? "bg-gray-700 text-white border-orange-500 border"
                      : "bg-white dark:bg-gray-800"
                  }`}
                  onClick={() => handleOrder(restaurant.item_id)}
                >
                  <div className="relative">
                    <LazyLoadImage
                      effect="blur"
                      src={`${process.env.REACT_APP_IMAGE_URL}${restaurant.image_url}`}
                      alt={restaurant.item_name}
                      className="w-96 h-40 object-cover transition-transform duration-300 hover:scale-110"
                    />
                    {restaurant.discount && (
                      <span className="absolute top-2 left-2 bg-orange-500 text-white text-sm px-2 py-1 rounded">
                        {restaurant.discount}
                      </span>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="font-semibold text-gray-900 dark:text-white text-lg">
                      {restaurant.item_name}
                    </p>
                    <span className="text-xl font-bold text-orange-500">
                      {restaurant.original_price !== undefined
                        ? Number(restaurant.original_price)
                            .toFixed(2)
                            .replace(/\.00$/, "") // Removes trailing '.00'
                        : "N/A"}
                      <span className="text-xs text-gray-400"> ETB</span>
                    </span>
                    {restaurant.price > 0 && (
                      <span className="ml-2 text-sm text-gray-400 line-through">
                        {Number(restaurant.price)
                          .toFixed(2)
                          .replace(/\.00$/, "")}
                        <span className="text-xs text-gray-400"> ETB</span>
                      </span>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      {cart.some(
                        (item) => item.item_id === restaurant.item_id
                      ) && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateItemCount(restaurant.item_id, "remove");
                            }}
                            className="bg-gray-200 text-black w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-gray-300"
                            aria-label="Remove item"
                          >
                            <span className="text-lg font-bold">-</span>
                          </button>
                          <span className="text-sm w-8 h-8 rounded-full font-medium flex items-center justify-center text-gray-400">
                            {cart.find(
                              (item) => item.item_id === restaurant.item_id
                            )?.count || 0}
                          </span>
                        </>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateItemCount(restaurant.item_id, "add");
                        }}
                        className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-orange-600"
                        aria-label="Add item"
                      >
                        <span className="text-lg font-bold">+</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
        {isLoadingMore && (
          <div className="flex justify-center items-center h-16">
            <div className="loader">Loading more...</div>
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="px-2 py-4 bg-gray-100 dark:bg-gray-950 rounded-md flex flex-row justify-between items-center fixed bottom-0 w-full">
          <div style={{ flexDirection: "column" }}>
            <p style={{ color: "white" }}>
              {cart.length} {cart.length > 1 ? "Items" : "Item"} selected
            </p>
            <p style={{ color: "gray" }}>{displayedTitles()}</p>
          </div>
          <div className="p-3 bg-orange-600 rounded-md flex flex-row items-center justify-center">
            <p style={{ color: "white", fontSize: 19 }}>
              {calculateTotal()}{" "}
              <span style={{ color: "#f2efef", fontSize: 13 }}>ETB</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodDeliveryApp;
