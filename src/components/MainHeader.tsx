"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function MainHeader() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="w-full h-12 bg-[#222325] flex items-center justify-between px-6 shadow-md">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <img
          src="/svgs/mmlogo.svg"
          alt="App Logo"
          className="w-6 h-6 object-contain"
        />
      </div>

      {/* Right: Icons + Profile */}
      <div className="flex items-center gap-1 relative">
        {/* Notification Icon */}
        <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
          <img
            src="/svgs/headIcon1.svg"
            alt="Notification"
            className="w-4.5 h-4.5 object-contain"
          />
        </button>

        {/* Settings Icon */}
        <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
          <img
            src="/svgs/headIcon2.svg"
            alt="Settings"
            className="w-4.5 h-4.5 object-contain"
          />
        </button>
          <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
          <img
            src="/svgs/settingsIcon.svg"
            alt="Settings"
            className="w-4.5 h-4.5 object-contain"
          />
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center gap-1 bg-[#d9d9d94a] rounded-full px-2 py-1 cursor-pointer">
        <div className="border-3 border-[#F43F46] rounded-full">
            <img
            src="/images/profileLogo.png" // replace with your avatar image
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center"
          >
            {dropdownOpen ? (
              <ChevronUp className="w-5 h-5 mt-1.5" />
            ) : (
              <ChevronDown className="w-5 h-5 mt-1.5" />
            )}
          </button>
        </div>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-[#2c2c2c] rounded-md shadow-lg overflow-hidden z-1000">
            <ul className="flex flex-col">
              <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Profile</li>
              <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Settings</li>
              <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Logout</li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
