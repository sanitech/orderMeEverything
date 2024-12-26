import React, { useContext, useEffect, useMemo, useState } from "react";
import MenuCard from "./MenuCard";
import { AuthContext } from "../../context/AuthProvider";
import { fetchMenusByVendor } from "../../utils/fetchMenusByVendor";
import db from "../../db/db";

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

    const handleOrder = (id) => {
      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (cartItem) => cartItem.item_id === id
        );

        if (existingItem) {
          return prevCart.filter((cartItem) => cartItem.item_id !== id);
        } else {
          const item = menus.find((item) => item.item_id === id);
          return item ? [...prevCart, { ...item, count: 1 }] : prevCart;
        }
      });

      setSelectedIds((prevSelectedIds) =>
        prevSelectedIds.includes(id)
          ? prevSelectedIds.filter((selectedId) => selectedId !== id)
          : [...prevSelectedIds, id]
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
              ? { ...cartItem, count: cartItem.count + 1 }
              : cartItem
          );
        } else {
          const item = menus.find((item) => item.item_id === id);
          return item ? [...prevCart, { ...item, count: 1 }] : prevCart;
        }
      });
    };

    const onRemove = (id) => {
      setCart((prevCart) =>
        prevCart
          .map((cartItem) =>
            cartItem.item_id === id && cartItem.count > 0
              ? { ...cartItem, count: cartItem.count - 1 }
              : cartItem
          )
          .filter((cartItem) => cartItem.count > 0)
      );
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
              <MenuCard
                item={item}
                isSelected={selectedIds.includes(item.item_id)}
                onSelect={() => handleOrder(item.item_id)}
                count={itemCount}
                onRemove={() => onRemove(item.item_id)}
                onAdd={() => onAdd(item.item_id)}
                cardStatus={menuCardStatus}
              />
            );
          })
        )}
      </div>
    );
  }
);

export default Menu;
