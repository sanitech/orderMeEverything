import React, { useState } from "react";
import Header from "../components/Header";
import Categories from "../components/Category/Categories";
import MenuOrder from "../components/Menu/MenuOrder";

const AddOrder = ({ cart, setCart, selectedIds, setSelectedIds }) => {
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState(0);
  return (
    <div>
      <Header
        searchText={searchText}
        setSearchText={setSearchText}
        searchStatus="order"
      />
      <Categories setCategory={setCategory} category={category} />
      <MenuOrder
        cart={cart}
        setCart={setCart}
        menuCardStatus={"Order"}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        category={category}
      />
    </div>
  );
};

export default AddOrder;
