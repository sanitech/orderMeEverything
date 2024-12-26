import React from "react";

const TopProductsTable = () => {
  const products = [
    { name: "Viso Suite Platform", progress: "$52,318", growth: "+1.2%" },
    { name: "ChatGPT Software", progress: "$49,111", growth: "+1.1%" },
    { name: "Jupyter Notebooks", progress: "$34,839", growth: "+0.8%" },
    { name: "Infosys Nia", progress: "$22,000", growth: "+0.5%" },
  ];

  return (
    <div className=" w-full  bg-white rounded-lg shadow-lg p-6">
      {/* Table Header */}
      <h2 className="text-lg font-semibold mb-4">Top products</h2>
      <table className="w-full">
        <thead>
          <tr className="text-sm  text-gray-500 border-b">
            <th className=" py-2 text-left">Product name</th>
            <th className=" py-2 text-left">Progress</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr
              key={index}
              className={`text-sm ${
                index % 2 === 0
                  ? "bg-gray-50 flex justify-between"
                  : "bg-white flex justify-between"
              }`}
            >
              <td className="py-3 flex flex-1 items-center gap-2 pr-4 ">
                <span className="text-green-500 font-bold">+</span>
                {product.name}
              </td>
              <td className="py-3 flex items-center justify-between gap-5">
                <span>{product.progress}</span>
                <span
                  className={`${
                    product.growth.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  } text-sm font-semibold`}
                >
                  {product.growth}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopProductsTable;
