import React, { useContext, useEffect, useMemo, useState } from "react";
import MenuCard from "./MenuCard";
import { AuthContext } from "../../context/AuthProvider";
import { fetchMenusByVendor } from "../../utils/fetchMenusByVendor";

const Menu = React.memo(
  ({
    cart,
    setCart,
    menuCardStatus,
    setSelectedIds,
    selectedIds,
    category,
    searchText,
  }) => {
    const { user } = useContext(AuthContext);
    const [menus, setMenus] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
      const loadMenus = async () => {
        try {
          const fetchedMenus = await fetchMenusByVendor(user.vendor_id);
          setMenus(fetchedMenus); // Update state with fetched menus
        } catch (error) {
          setErrorMessage(error.message); // Handle error
        }
      };

      if (user.vendor_id) {
        loadMenus(); // Fetch menus only if vendor_id is available
      }
    }, [user.vendor_id]);

    const handleOrder = (id) => {
      setCart((prevCart) => {
        // Check if the item already exists in the cart
        const existingItem = prevCart.find(
          (cartItem) => cartItem.item_id === id
        );

        // If item exists, remove it from the cart
        if (existingItem) {
          return prevCart.filter((cartItem) => cartItem.item_id !== id);
        } else {
          // If item does not exist, find it in the menus
          const item = menus.find((item) => item.item_id === id);
          if (item) {
            // Add the item to the cart with a count of 1
            return [...prevCart, { ...item, count: 1 }];
          }
        }

        // Return previous cart if item is not found
        return prevCart;
      });

      // Toggle selection of the item ID
      setSelectedIds(
        (prevSelectedIds) =>
          prevSelectedIds.includes(id)
            ? prevSelectedIds.filter((selectedId) => selectedId !== id) // Remove ID if already selected
            : [...prevSelectedIds, id] // Add ID if not already selected
      );
    };

    const filteredItems = useMemo(() => {
      return menus.filter((item) => {
        const matchesCategory = category === 0 || item.category_id === category;
        const matchesSearchText =
          !searchText || item.item_name.toLowerCase().includes(searchText);
        return matchesCategory && matchesSearchText;
      });
    }, [menus, category, searchText]);
    const onAdd = (id) => {
      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (cartItem) => cartItem.item_id === id
        );
        if (existingItem) {
          return prevCart.map((cartItem) =>
            cartItem.item_id === id
              ? { ...cartItem, count: cartItem.count + 1 } // Increment count
              : cartItem
          );
        } else {
          const item = menus.find((item) => item.item_id === id);
          return item ? [...prevCart, { ...item, count: 1 }] : prevCart; // Add new item with count 1
        }
      });
      console.log(selectedIds);
    };

    const onRemove = (id) => {
      setCart((prevCart) => {
        return prevCart
          .map((cartItem) =>
            cartItem.item_id === id && cartItem.count > 0
              ? { ...cartItem, count: cartItem.count - 1 } // Decrement count
              : cartItem
          )
          .filter((cartItem) => cartItem.count > 0); // Remove items with zero count
      });
    };

    return (
      <div className="flex flex-wrap gap-3 transition-all duration-200">
        {filteredItems.length === 0 ? (
          <div className="w-full text-center text-gray-600 mt-4 col-span-4">
            No menu items found.
          </div>
        ) : (
          filteredItems.map((item, index) => {
            const cartItem = cart.find(
              (cartItem) => cartItem.item_id === item.item_id
            );
            const itemCount = cartItem ? cartItem.count : 0;

            return (
              <div className={`w-full sm:w-1/2 md:w-1/4`} key={index}>
                {" "}
                {/* Adjust width based on screen size */}
                <MenuCard
                  item={item}
                  isSelected={selectedIds.includes(item.item_id)} // Check if item is selected
                  onSelect={() => handleOrder(item.item_id)} // This function will now add/remove items
                  count={itemCount}
                  onRemove={() => onRemove(item.item_id)} // Pass the remove function (for direct count adjustments)
                  onAdd={() => onAdd(item.item_id)} // Pass the add function (for direct count adjustments)
                  cardStatus={menuCardStatus} // Pass the card status (for displaying if item is added/removed)
                />
              </div>
            );
          })
        )}
      </div>
    );
  }
);

export default Menu;
