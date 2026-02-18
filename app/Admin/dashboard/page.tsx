"use client";

import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import React, { useState, useEffect } from "react";
import ProtectedRoute from "../../../shared/ProtectedRoute";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from 'next/navigation';

function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
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
      <div className="min-h-screen bg-[#050a14] container-mobile-xs sm:container-mobile-sm md:container-mobile-md lg:container-mobile-lg xl:container-tablet 2xl:container-desktop">
        <Navbar onMenuToggle={toggleSidebar} sidebarOpen={sidebarOpen} />
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
            <div className="max-w-7xl mx-auto p-4 lg:p-6 container-mobile-xs sm:container-mobile-sm md:container-mobile-md lg:container-mobile-lg xl:container-tablet 2xl:container-desktop">
              <div className="mb-8">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold neon-text mb-2">
                   Welcome back, {user?.firstName}!
                </h1>
                <p className="text-gray-400">Manage all activities here</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="glass-card rounded-lg p-4 hover:scale-105 transition-all duration-300">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-indigo-400">
                    Products
                  </h2>
                  <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">
                    Add, edit, and manage all products
                  </p>
                  <button
                    onClick={() => router.push("/Admin/products")}
                    className="px-3 py-2 sm:px-4 sm:py-2 gaming-btn text-white rounded-md inline-block transition-all text-sm sm:text-base touch-button"
                  >
                    Manage Products
                  </button>
                </div>

                <div className="glass-card rounded-lg p-4 hover:scale-105 transition-all duration-300">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-green-400">
                    Analytics
                  </h2>
                  <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">
                    View comprehensive statistics
                  </p>
                  <button
                    onClick={() => router.push("/Admin/analytics")}
                    className="px-3 py-2 sm:px-4 sm:py-2 gaming-btn text-white rounded-md inline-block transition-all text-sm sm:text-base touch-button"
                  >
                    View Analytics
                  </button>
                </div>

                <div className="glass-card rounded-lg p-4 hover:scale-105 transition-all duration-300">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-purple-400">
                    Orders
                  </h2>
                  <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">
                    Monitor and manage all active Orders
                  </p>
                  <button
                    onClick={() => router.push("/Admin/orders")}
                    className="px-3 py-2 sm:px-4 sm:py-2 gaming-btn text-white rounded-md inline-block transition-all text-sm sm:text-base touch-button"
                  >
                    Manage Orders
                  </button>
                </div>

                <div className="glass-card rounded-lg p-4 hover:scale-105 transition-all duration-300">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-yellow-400">
                    Categories
                  </h2>
                  <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">
                    Manage products categories
                  </p>
                  <button
                    onClick={() => router.push("/Admin/categories")}
                    className="px-3 py-2 sm:px-4 sm:py-2 gaming-btn text-white rounded-md inline-block transition-all text-sm sm:text-base touch-button"
                  >
                    Manage Categories
                  </button>
                </div>

                <div className="glass-card rounded-lg p-4 hover:scale-105 transition-all duration-300">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-red-400">
                    Settings
                  </h2>
                  <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">
                    Configure settings
                  </p>
                  <button
                    onClick={() => router.push("/Admin/settings")}
                    className="px-3 py-2 sm:px-4 sm:py-2 gaming-btn text-white rounded-md inline-block transition-all text-sm sm:text-base touch-button"
                  >
                    Settings
                  </button>
                </div>

                <div className="glass-card rounded-lg p-4 hover:scale-105 transition-all duration-300">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-indigo-400">
                    Users
                  </h2>
                  <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">
                    Manage all Users
                  </p>
                  <button
                    onClick={() => router.push("/Admin/accounts")}
                    className="px-3 py-2 sm:px-4 sm:py-2 gaming-btn text-white rounded-md inline-block transition-all text-sm sm:text-base touch-button"
                  >
                    Manage Users
                  </button>
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