import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Categories from "../components/Category/Categories";
import Menu from "../components/Menu/Menu";
import pro from "../assets/pro2.png";
import CustomerMenu from "../components/CustomerMenu";
import CustomerCategories from "../components/Category/CustomerCategories";

const MenuExplore = ({ cart, setCart, selectedIds, setSelectedIds }) => {
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState(0);

  return (
    <div className="container mx-auto h-screen grid gap-4 grid-cols-1 md:grid-cols-[auto_300px] bg-gray-50 overflow-hidden">
      <main
        className="bg-white p-4 overflow-y-auto hide-scrollbar"
        style={{ height: "calc(100vh - 16px)", overflowY: "auto" }}
      >
        <Header
          searchText={searchText}
          setSearchText={setSearchText}
          searchStatus="menu"
        />
        <CustomerCategories category={category} setCategory={setCategory} />
        <CustomerMenu
          cart={cart}
          setCart={setCart}
          menuCardStatus={"user"}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          category={category}
          searchText={searchText}
        />
      </main>
      <div className="hidden md:block bg-white p-4">
        <img src={pro} alt="" />
      </div>
    </div>
  );
};

export default MenuExplore;
