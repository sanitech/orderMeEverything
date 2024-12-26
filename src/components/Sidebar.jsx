import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const Sidebar = () => {
  const location = useLocation(); // Get the current URL location
  const [activeLink, setActiveLink] = useState("Dashboard"); // Default active link
  const links = [
    { label: "Dashboard", icon: "dashboard", link: "/dashboard", active: true },
    { label: "Category", icon: "category", link: "category" },
    { label: "Menu", icon: "restaurant_menu", link: "menu" },
    { label: "Order", icon: "shopping_cart", link: "order" },
    { label: "Staff", icon: "groups", link: "staff" },
    { label: "Report", icon: "flag", link: "report" },
    { label: "My QR-Code", icon: "qr_code", link: "myqrcode" },
    { label: "Settings", icon: "settings", link: "setting" },
    { label: "Logout", icon: "logout", link: "logout", danger: true },
  ];

  const currentHour = new Date().getHours();
  let greetingMessage;

  // Set greeting message based on the hour
  if (currentHour < 12) {
    greetingMessage = "Good Morning ☀️";
  } else if (currentHour < 18) {
    greetingMessage = "Good Afternoon 🌟";
  } else {
    greetingMessage = "Good Evening 🌙";
  }

  const { logout, user } = useContext(AuthContext);
  // Update activeLink based on the current URL
  useEffect(() => {
    const currentPath = location.pathname.split("/")[2]
      ? location.pathname.split("/")[2]
      : "/dashboard";
    const matchingLink = links.find((links) => links.link === currentPath);

    if (matchingLink) {
      setActiveLink(matchingLink.link); // Set the active link if found
    } else {
      setActiveLink("dashboard"); // Default to "Dashboard" if no matching link
    }
  }, [location.pathname]); // Depend on pathname changes

  return (
    <div className="h-screen bg-white flex flex-col justify-between shadow-lg z-10">
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="flex items-center justify-center p-4">
          <h1 className="text-orange-500 text-2xl font-bold">Mesobit</h1>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center text-center px-4">
          <div className="w-20 h-20 rounded-full border-4 border-orange-300 border-dashed p-1 overflow-hidden">
            <img
              src={
                user.profile_pic ||
                "https://images.squarespace-cdn.com/content/v1/5c9051237d0c9173e4e58a19/1577342981336-U4F44HW0V00ORCG3SDHE/Meals.png"
              }
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h2 className="mt-4 text-lg font-semibold">{user.vendor_name}</h2>
          <p className="text-sm text-gray-500">{greetingMessage}</p>
        </div>

        {/* Navigation Links */}
        <nav className="mt-5">
          <ul className="space-y-2">
            {links.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.link === "logout" ? "#" : item.link} // Prevent navigation for logout
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                    activeLink === item.link
                      ? "text-orange-500 bg-orange-100"
                      : item.danger
                      ? "text-red-500 hover:bg-red-100"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    if (item.link === "logout") {
                      logout(); // Call the logout function
                      return; // Stop further execution
                    }
                    setActiveLink(item.link); // Set the active link for other navigation items
                  }}
                >
                  <span className="material-icons">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom Section */}
      {/* <div className="px-4 py-6">
        <div className="p-4 bg-orange-50 rounded-lg text-center">
          <p className="text-sm font-medium">
            Upgrade your account to get free vouchers
          </p>
          <button className="mt-4 px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg">
            Upgrade now
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default Sidebar;
