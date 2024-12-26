import React, { useState } from "react";
import Header from "../../components/Header";
import Categories from "../../components/Category/Categories";
import MenuOrderExtra from "../../components/Menu/MenuOrderExtra";

const OrderExtra = ({
  extraCart,
  setExtraCart,
  selectedExtraIds,
  setSelectedExtraIds,
}) => {
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
      <MenuOrderExtra
        extraCart={extraCart}
        setExtraCart={setExtraCart}
        menuCardStatus={"Order"}
        selectedExtraIds={selectedExtraIds}
        setSelectedExtraIds={setSelectedExtraIds}
        category={category}
      />
    </div>
  );
};

export default OrderExtra;
