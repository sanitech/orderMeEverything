import React, { useContext, useEffect, useMemo } from "react";
import MenuCard from "./MenuCard";
import { AuthContext } from "../../context/AuthProvider";
import { fetchMenusByVendor } from "../../utils/fetchMenusByVendor";
import { useLocation } from "react-router-dom";
import db from "../../db/db";

const MenuOrderExtra = React.memo(
  ({
    extraCart,
    setExtraCart,
    selectedExtraIds,
    setSelectedExtraIds,
    menuCardStatus,
    category,
    searchText,
  }) => {
    const { user } = useContext(AuthContext);
    const [menus, setMenus] = React.useState([]);
    const [errorMessage, setErrorMessage] = React.useState("");
    const location = useLocation();

    // Initialize extra cart and selected IDs from location state

    useEffect(() => {
      if (location.state?.items) {
        const initialItems = location.state.items;
        console.log("cart extra", initialItems);

        // Update the original_price to be the price per item
        const updatedItems = initialItems.map((item) => {
          const originalPrice = parseFloat(item.original_price);
          const count = item.count;
          return {
            ...item,
            original_price: (originalPrice / count).toFixed(2), // Ensure the price is a string with two decimal places
          };
        });

        setExtraCart(updatedItems);
        setSelectedExtraIds(updatedItems.map((item) => item.item_id));
      }
    }, [location.state, setExtraCart, setSelectedExtraIds]);

    // Fetch menus based on vendor ID
    useEffect(() => {
      const loadMenus = async () => {
        try {
          if (!user.vendor_id) return;

          // Check if data exists in IndexedDB
          const cachedMenus = await db.menus.toArray();

          if (cachedMenus.length > 0) {
            setMenus(cachedMenus); // Load menus from IndexedDB
          }

          // Fetch menus from the API
          const fetchedMenus = await fetchMenusByVendor(user.vendor_id);

          // Update IndexedDB with new menus
          await db.menus.bulkPut(fetchedMenus);

          setMenus(fetchedMenus); // Update state with fetched menus
        } catch (error) {
          setErrorMessage("Failed to load menus: " + error.message);
        }
      };

      loadMenus();
    }, [user.vendor_id]);

    // Handle adding/removing items from extra cart
    const toggleOrderItem = (id) => {
      setExtraCart((prevCart) => {
        const existingItem = prevCart.find(
          (cartItem) => cartItem.item_id === id
        );
        if (existingItem) {
          // Remove the item if it exists
          return prevCart.filter((cartItem) => cartItem.item_id !== id);
        } else {
          // Add the item if it doesn't exist
          const item = menus.find((item) => item.item_id === id);
          return item ? [...prevCart, { ...item, count: 1 }] : prevCart;
        }
      });

      // Update selected extra IDs
      setSelectedExtraIds((prevSelectedIds) =>
        prevSelectedIds.includes(id)
          ? prevSelectedIds.filter((selectedId) => selectedId !== id)
          : [...prevSelectedIds, id]
      );
    };

    // Filter available items in the menu based on category and search text
    const filteredItems = useMemo(() => {
      return menus.filter((item) => {
        const matchesCategory = category === 0 || item.category_id === category;
        const matchesSearchText =
          !searchText ||
          item.item_name.toLowerCase().includes(searchText.toLowerCase());
        return matchesCategory && matchesSearchText && item.available;
      });
    }, [menus, category, searchText]);

    // Function to increase item count in cart
    const incrementItemCount = (id) => {
      setExtraCart((prevCart) => {
        return prevCart.map((cartItem) =>
          cartItem.item_id === id
            ? { ...cartItem, count: cartItem.count + 1 }
            : cartItem
        );
      });
    };

    // Function to decrease item count in cart
    const decrementItemCount = (id) => {
      setExtraCart((prevCart) => {
        const updatedCart = prevCart.map((cartItem) =>
          cartItem.item_id === id && cartItem.count > 0
            ? { ...cartItem, count: cartItem.count - 1 }
            : cartItem
        );
        return updatedCart.filter((cartItem) => cartItem.count > 0);
      });
    };

    return (
      <div className="flex flex-wrap gap-2 transition-all duration-200">
        {errorMessage && (
          <div className="col-span-4 text-center text-red-500 mt-4">
            {errorMessage}
          </div>
        )}
        {filteredItems.length === 0 ? (
          <div className="col-span-4 text-center text-gray-600 mt-4">
            No menu items found.
          </div>
        ) : (
          filteredItems.map((item, index) => {
            const cartItem = extraCart.find(
              (cartItem) => cartItem.item_id === item.item_id
            );
            const itemCount = cartItem ? cartItem.count : 0;

            return (
              <MenuCard
                key={index}
                item={item}
                isSelected={selectedExtraIds.includes(item.item_id)} // Check if item is selected
                onSelect={() => toggleOrderItem(item.item_id)} // This function will now add/remove items
                count={itemCount}
                onRemove={() => decrementItemCount(item.item_id)} // Pass the remove function (for direct count adjustments)
                onAdd={() => incrementItemCount(item.item_id)} // Pass the add function (for direct count adjustments)
                cardStatus={menuCardStatus} // Pass the card status (for displaying if item is added/removed)
              />
            );
          })
        )}
      </div>
    );
  }
);

export default MenuOrderExtra;
