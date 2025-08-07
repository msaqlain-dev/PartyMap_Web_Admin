"use client";

import { useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import useUIStore from "../store/uiStore";

const Layout = ({ children }) => {
  const { sidebarOpen, setSidebarOpen, closeAllDropdowns } = useUIStore();

  // Update the useEffect for handling clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close dropdowns if clicking on the notifications sidebar
      if (event.target.closest(".notifications-sidebar")) {
        return;
      }
      closeAllDropdowns();
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [closeAllDropdowns]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
