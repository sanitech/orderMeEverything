import React from "react";

const BusinessTable = () => {
  const businesses = [
    {
      businessName: "GQ Creators",
      productName: "Data Protection",
      progress: "339 sold",
      rating: 5,
    },
    {
      businessName: "Dribbbblers Agency",
      productName: "Job Search",
      progress: "212 sold",
      rating: 4.5,
    },
    {
      businessName: "Popular_My",
      productName: "Financial Transactions",
      progress: "194 sold",
      rating: 4,
    },
  ];

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex flex-1">
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <span key={`full-${i}`} className="text-black">
              ★
            </span>
          ))}
        {halfStar && <span className="text-black">☆</span>}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <span key={`empty-${i}`} className="text-gray-400">
              ☆
            </span>
          ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 flex-1">
      <table className="w-full text-left border-collapse">
        {/* Table Header */}
        <thead>
          <tr className="text-sm text-gray-500 border-b">
            <th className="py-3">Business name</th>
            <th className="py-3">Product Name</th>
            <th className="py-3">Progress</th>
            <th className="py-3">Rating</th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {businesses.map((business, index) => (
            <tr
              key={index}
              className={`text-sm ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <td className="py-4">{business.businessName}</td>
              <td className="py-4">{business.productName}</td>
              <td className="py-4">{business.progress}</td>
              <td className="py-4">{renderStars(business.rating)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusinessTable;
