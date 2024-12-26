import React, { useState } from "react";
import Header from "../components/Header";
import pro from "../assets/pro2.png";
import CafeMenuCard from "../components/CafeMenuCard";

const Explore = ({ cart, setCart, selectedIds, setSelectedIds }) => {
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

        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <CafeMenuCard />
          <CafeMenuCard />
          <CafeMenuCard />
        </div>
      </main>
      <div className="hidden md:block bg-white p-4">
        <img src={pro} alt="" />
      </div>
    </div>
  );
};

export default Explore;
