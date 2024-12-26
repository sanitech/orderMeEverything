import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Categories from "../components/Category/Categories";
import Menu from "../components/Menu/Menu";
import Checkout from "../components/CheckOut";

const MenuPage = ({ cart, setCart, selectedIds, setSelectedIds }) => {
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState(0);
  return (
    <div className="dashboard transition-all duration-300">
      <Header
        searchText={searchText}
        setSearchText={setSearchText}
        searchStatus="menu"
      />
      <Categories
        setCategory={setCategory}
        category={category}
        menuStatus={"vendor"}
      />
      <Menu
        cart={cart}
        setCart={setCart}
        menuCardStatus={"editor"}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        category={category}
      />
    </div>
  );
};

export default MenuPage;
