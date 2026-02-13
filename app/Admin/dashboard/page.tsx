"use client";

import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import ProtectedRoute from "../../../shared/ProtectedRoute";
import { useAuth } from "../../../context/AuthContext";

function AdminDashboardPage() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        if (window.innerWidth < 1024) {
          setSidebarOpen(false);
        } else {
          setSidebarOpen(true);
        }
      };

      handleResize();

      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <ProtectedRoute allowedRoles={["admin"]} redirectPath="/">
      <div className="min-h-screen bg-[#050a14]">
        <Navbar onMenuToggle={toggleSidebar} />
        <div className="flex">
          <Sidebar
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
            onToggle={toggleSidebar}
          />
          <main
            className={`flex-1 transition-all duration-300 ${
              sidebarOpen ? "lg:ml-0" : ""
            } ${typeof window !== "undefined" && window.innerWidth < 1024 ? "ml-0" : ""}`}
          >
            <div className="max-w-7xl mx-auto p-4 lg:p-6">
              <div className="mb-8">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold neon-text mb-2">
                  ⚔️ Welcome back, {user?.firstName}!
                </h1>
                <p className="text-gray-400">Manage all activities here</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="glass-card rounded-lg p-4 hover:scale-105 transition-all duration-300">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-indigo-400">
                    Products
                  </h2>
                  <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">
                    Add, edit, and manage all items
                  </p>
                  <Link
                    href="/Admin/products"
                    className="px-3 py-2 sm:px-4 sm:py-2 gaming-btn text-white rounded-md inline-block transition-all text-sm sm:text-base"
                  >
                    Manage Items
                  </Link>
                </div>

                <div className="glass-card rounded-lg p-4 hover:scale-105 transition-all duration-300">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-green-400">
                    Analytics
                  </h2>
                  <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">
                    View comprehensive statistics
                  </p>
                  <Link
                    href="/Admin/analytics"
                    className="px-3 py-2 sm:px-4 sm:py-2 gaming-btn text-white rounded-md inline-block transition-all text-sm sm:text-base"
                  >
                    View Analytics
                  </Link>
                </div>

                <div className="glass-card rounded-lg p-4 hover:scale-105 transition-all duration-300">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-purple-400">
                    Orders
                  </h2>
                  <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">
                    Monitor and manage all active Orders
                  </p>
                  <Link
                    href="/Admin/orders"
                    className="px-3 py-2 sm:px-4 sm:py-2 gaming-btn text-white rounded-md inline-block transition-all text-sm sm:text-base"
                  >
                    Manage Orders
                  </Link>
                </div>

                <div className="glass-card rounded-lg p-4 hover:scale-105 transition-all duration-300">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-yellow-400">
                    Categories
                  </h2>
                  <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">
                    Manage item categories
                  </p>
                  <Link
                    href="/Admin/categories"
                    className="px-3 py-2 sm:px-4 sm:py-2 gaming-btn text-white rounded-md inline-block transition-all text-sm sm:text-base"
                  >
                    Manage Categories
                  </Link>
                </div>

                <div className="glass-card rounded-lg p-4 hover:scale-105 transition-all duration-300">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-red-400">
                    Settings
                  </h2>
                  <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">
                    Configure settings
                  </p>
                  <Link
                    href="/Admin/settings"
                    className="px-3 py-2 sm:px-4 sm:py-2 gaming-btn text-white rounded-md inline-block transition-all text-sm sm:text-base"
                  >
                    Settings
                  </Link>
                </div>

                <div className="glass-card rounded-lg p-4 hover:scale-105 transition-all duration-300">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-indigo-400">
                    Users
                  </h2>
                  <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">
                    Manage all Users
                  </p>
                  <Link
                    href="/Admin/accounts"
                    className="px-3 py-2 sm:px-4 sm:py-2 gaming-btn text-white rounded-md inline-block transition-all text-sm sm:text-base"
                  >
                    Manage Users
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default AdminDashboardPage;
