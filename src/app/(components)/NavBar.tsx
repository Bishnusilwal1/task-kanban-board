import React from "react";
import { Search, AtSign, Bell } from "lucide-react";
import Image from "next/image";

const TopBar: React.FC = () => {
  return (
    <>
      <div className="bg-[#15161A]">
        <nav
          className="h-16 fixed bg-gradient-to-r  bg-[#333330] w-full flex items-center justify-between pr-5"
          aria-label="Top navigation bar "
        >
          {/* Left Section with Title */}
          <div className="flex items-center px-5">
            <div className="text-custom-them text-xs sm:text-xl font-bold text-[#F65930] flex-1 font-martian-mono whitespace-nowrap">
              KANBAN-BOARD
            </div>
          </div>

          {/* Search Section */}
          <div className="relative w-full sm:w-1/2 px-5">
            {" "}
            {/* Make the search section take 50% */}
            <input
              id="search-input"
              type="text"
              placeholder="Search Task..."
              className="w-full py-2 pl-10 pr-4 bg-[#5c5c56]/50 rounded-lg text-white text-sm placeholder-gray-500 text-center focus:outline-none focus:ring-2 focus:ring-orange-500 font-martian-mono"
            />
            <span className="absolute left-6 top-2 text-gray-500">
              <Search className="w-5 h-5 text-custom-them" aria-hidden="true" />
            </span>
          </div>

          {/* Icons Section */}
          <div className="flex space-x-2 px-5">
            <button
              type="button"
              className="focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Mentions"
            >
              <AtSign className="w-7 h-7 text-white" />
            </button>
            <button
              type="button"
              className="focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Notifications"
            >
              <Bell className="w-7 h-7 text-white" />
            </button>

            {/* Avatar Section */}
            <button
              type="button"
              className="focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="User Avatar"
            >
              <div className="w-10 h-10 overflow-hidden rounded-full">
                <Image
                  src="/assets/avatar.avif"
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default TopBar;
