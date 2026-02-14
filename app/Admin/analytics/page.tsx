"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import ProtectedRoute from "../../../shared/ProtectedRoute";
import { useAuth } from "../../../context/AuthContext";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState("7");

  const stats = {
    totalUsers: 124,
    totalProducts: 89,
    totalOrders: 342,
    revenue: 24560,
  };

  const chartData = [
    { day: "Mon", users: 40, orders: 30 },
    { day: "Tue", users: 30, orders: 25 },
    { day: "Wed", users: 20, orders: 15 },
    { day: "Thu", users: 27, orders: 22 },
    { day: "Fri", users: 18, orders: 18 },
    { day: "Sat", users: 23, orders: 20 },
    { day: "Sun", users: 34, orders: 28 },
  ];

  return (
    <ProtectedRoute allowedRoles={["admin"]} redirectPath="/">
      <div className="min-h-screen bg-[#050a14]">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4 lg:p-6">
            <div className="container-mobile-lg mx-auto max-w-7xl">
              <h1 className="text-3xl font-bold neon-text mb-6">Analytics</h1>

              <div className="mb-6 flex justify-end">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 gaming-input rounded-md touch-button"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="glass-card rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-400">
                    Total users
                  </h3>
                  <p className="text-3xl font-bold text-indigo-400 mt-2">
                    {stats.totalUsers}
                  </p>
                  <div className="mt-2 text-sm text-green-400 flex items-center gap-1">
                    ↑ 12% from last month
                  </div>
                </div>

                <div className="glass-card rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-400">
                    Total Products
                  </h3>
                  <p className="text-3xl font-bold text-purple-400 mt-2">
                    {stats.totalProducts}
                  </p>
                  <div className="mt-2 text-sm text-green-400">
                    ↑ 5% from last month
                  </div>
                </div>

                <div className="glass-card rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-400">
                    Total orders
                  </h3>
                  <p className="text-3xl font-bold text-blue-400 mt-2">
                    {stats.totalOrders}
                  </p>
                  <div className="mt-2 text-sm text-green-400">
                    ↑ 18% from last month
                  </div>
                </div>

                <div className="glass-card rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-400">Selling</h3>
                  <p className="text-3xl font-bold text-yellow-400 mt-2">
                    ${stats.revenue.toLocaleString()}
                  </p>
                  <div className="mt-2 text-sm text-green-400">
                    ↑ 22% from last month
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="glass-card rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-4">
                    users vs orders
                  </h3>
                  <div className="h-80">
                    <div className="flex items-end h-64 gap-2 mt-4">
                      {chartData.map((data, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center flex-1"
                        >
                          <div className="flex items-end justify-center space-x-1 h-56">
                            <div
                              className="w-6 bg-indigo-500 rounded-t hover:bg-indigo-600 transition-all"
                              style={{ height: `${(data.users / 50) * 100}%` }}
                              title={`users: ${data.users}`}
                            ></div>
                            <div
                              className="w-6 bg-green-500 rounded-t hover:bg-green-600 transition-all"
                              style={{ height: `${(data.orders / 35) * 100}%` }}
                              title={`Orders: ${data.orders}`}
                            ></div>
                          </div>
                          <span className="text-xs mt-2 text-gray-400">
                            {data.day}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-4">
                    user Distribution
                  </h3>
                  <div className="flex items-center justify-center gap-8">
                    <div className="relative w-48 h-48">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-xl font-bold text-white">124</p>
                          <p className="text-xs text-gray-400">Total users</p>
                        </div>
                      </div>
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="12"
                          strokeDasharray="163.36"
                          strokeDashoffset="0"
                          transform="rotate(-90 50 50)"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="12"
                          strokeDasharray="125.66"
                          strokeDashoffset="-163.36"
                          transform="rotate(-90 50 50)"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="12"
                          strokeDasharray="50.26"
                          strokeDashoffset="-289.02"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            Sales
                          </p>
                          <p className="text-xs text-gray-400">65%</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            vendors
                          </p>
                          <p className="text-xs text-gray-400">25%</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            Customers
                          </p>
                          <p className="text-xs text-gray-400">10%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
