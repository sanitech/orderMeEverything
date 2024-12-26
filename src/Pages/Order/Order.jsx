import React, { useState } from "react";
import Categories from "../../components/Category/Categories";
import Menu from "../../components/Menu/Menu";
import Header from "../../components/Header";
import OrderLine from "../../components/Order/OrderLine";

const Order = ({ selectedOrderId, setSelectedOrderId }) => {
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState(0);
  return (
    <div>
      <Header
        searchText={searchText}
        setSearchText={setSearchText}
        searchStatus="order"
      />
      <OrderLine setSelectedOrderId={setSelectedOrderId} />
    </div>
  );
};

export default Order;
