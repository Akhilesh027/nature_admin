// components/TopNavigation.js
import React, { useState } from "react";
import { Menu, User, Settings, LogOut } from "lucide-react"; // ✅ lightweight icons

const TopNavigation = ({ toggleSidebar }) => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow px-4 py-3 flex justify-between items-center">
      {/* Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        <Menu size={20} />
      </button>

      {/* Right side - Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center focus:outline-none"
        >
          <img
            src="https://via.placeholder.com/40"
            alt="Admin"
            className="w-10 h-10 rounded-full border"
          />
          <span className="ml-2 font-medium text-gray-700">Admin User</span>
        </button>

        {/* Dropdown Menu */}
        {open && (
          <ul className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow border py-2 z-50">
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <User size={16} className="mr-2" /> Profile
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Settings size={16} className="mr-2" /> Settings
              </a>
            </li>
            <li>
              <hr className="my-1 border-gray-200" />
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut size={16} className="mr-2" /> Logout
              </a>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default TopNavigation;
