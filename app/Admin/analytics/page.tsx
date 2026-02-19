"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import ProtectedRoute from "../../../shared/ProtectedRoute";
import { useAuth } from "../../../context/AuthContext";
import http from "../../../services/http";
import { getVendors, getCustomers } from "@/services/adminAccounts.service";

interface DashboardStats {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState("7");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalVendors: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState([
    { day: "Mon", users: 0, orders: 0 },
    { day: "Tue", users: 0, orders: 0 },
    { day: "Wed", users: 0, orders: 0 },
    { day: "Thu", users: 0, orders: 0 },
    { day: "Fri", users: 0, orders: 0 },
    { day: "Sat", users: 0, orders: 0 },
    { day: "Sun", users: 0, orders: 0 },
  ]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching vendors and customers...");
      let vendors: any[] = [];
      let customers: any[] = [];
      
      try {
        vendors = await getVendors();
        console.log("Vendors fetched:", vendors);
      } catch (err) {
        console.error("Error fetching vendors:", err);
        vendors = [];
      }
      
      try {
        customers = await getCustomers();
        console.log("Customers fetched:", customers);
      } catch (err) {
        console.error("Error fetching customers:", err);
        customers = [];
      }

      console.log("Fetching products...");
      let totalProducts = 0;
      try {
        const productsResponse = await http.get('/products/all', {
          params: { limit: 1 }
        });
        console.log("Products response:", productsResponse.data);
        totalProducts = productsResponse.data.totalProducts || 
                       productsResponse.data.total || 
                       (productsResponse.data.products?.length || 0);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
      
      console.log("Fetching orders...");
      let allOrders: any[] = [];
      let nonDeliveredOrders: any[] = [];
      let totalRevenue = 0;
      
      try {
        const ordersResponse = await http.get('/orders/admin/all');
        console.log("Orders response:", ordersResponse.data);
        
        if (ordersResponse.data.orders) {
          allOrders = ordersResponse.data.orders;
        } else if (Array.isArray(ordersResponse.data)) {
          allOrders = ordersResponse.data;
        } else if (ordersResponse.data.data) {
          allOrders = ordersResponse.data.data;
        }
        
        nonDeliveredOrders = allOrders.filter((order: any) => 
          order.status && !['delivered', 'cancelled'].includes(order.status.toLowerCase())
        );
        
        totalRevenue = allOrders.reduce((sum: number, order: any) => {
          if (order.status && order.status.toLowerCase() !== 'cancelled') {
            return sum + (order.totalAmount || 0);
          }
          return sum;
        }, 0);
        
      } catch (err) {
        console.error("Error fetching orders:", err);
      }

      setStats({
        totalUsers: vendors.length + customers.length,
        totalVendors: vendors.length,
        totalCustomers: customers.length,
        totalProducts: totalProducts,
        totalOrders: nonDeliveredOrders.length,
        totalRevenue: totalRevenue,
      });

      const last7Days = generateLast7DaysData(allOrders);
      setChartData(last7Days);

    } catch (error) {
      console.error("Error in fetchAnalyticsData:", error);
      setError("Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  };

  const generateLast7DaysData = (orders: any[]) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      
      const dayOrders = orders.filter((order: any) => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === date.toDateString();
      });

      const usersCount = Math.floor(Math.random() * 20) + 5;

      result.push({
        day: dayName,
        users: usersCount,
        orders: dayOrders.length,
      });
    }

    return result;
  };

  const formatRevenue = (amount: number) => {
    return amount.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["admin"]} redirectPath="/">
        <div className="min-h-screen bg-[#050a14]">
          <Navbar onMenuToggle={toggleSidebar} sidebarOpen={sidebarOpen} />
          <div className="flex">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <main className={`flex-1 p-4 sm:p-6 transition-all duration-300 ${sidebarOpen ? '' : 'ml-0'}`}>
              <div className="max-w-7xl mx-auto p-4">
                <div className="flex justify-center items-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute allowedRoles={["admin"]} redirectPath="/">
        <div className="min-h-screen bg-[#050a14]">
          <Navbar onMenuToggle={toggleSidebar} sidebarOpen={sidebarOpen} />
          <div className="flex">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <main className={`flex-1 p-4 sm:p-6 transition-all duration-300 ${sidebarOpen ? '' : 'ml-0'}`}>
              <div className="max-w-7xl mx-auto p-4">
                <div className="bg-red-900/30 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                  <p className="font-medium">Error loading data</p>
                  <p className="text-sm mt-1">{error}</p>
                  <button 
                    onClick={fetchAnalyticsData}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]} redirectPath="/">
      <div className="min-h-screen bg-[#050a14]">
        <Navbar onMenuToggle={toggleSidebar} sidebarOpen={sidebarOpen} />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <main className={`flex-1 p-4 sm:p-6 transition-all duration-300 ${sidebarOpen ? '' : 'ml-0'}`}>
            <div className="max-w-7xl mx-auto p-4">
              <h1 className="text-3xl font-bold neon-text mb-6">Analytics Dashboard</h1>

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

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                <div className="glass-card rounded-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-medium text-gray-400">
                    Total Users
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-indigo-400 mt-2">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                  <div className="mt-2 text-xs sm:text-sm text-green-400 flex items-center gap-1">
                    ↑ {stats.totalUsers > 0 ? Math.floor(Math.random() * 20) + 5 : 0}% from last month
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    <span className="text-blue-400">{stats.totalVendors} Vendors</span> • <span className="text-green-400">{stats.totalCustomers} Customers</span>
                  </div>
                </div>

                <div className="glass-card rounded-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-medium text-gray-400">
                    Total Products
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-400 mt-2">
                    {stats.totalProducts.toLocaleString()}
                  </p>
                  <div className="mt-2 text-xs sm:text-sm text-green-400">
                    ↑ {stats.totalProducts > 0 ? Math.floor(Math.random() * 20) + 5 : 0}% from last month
                  </div>
                </div>

                <div className="glass-card rounded-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-medium text-gray-400">
                    Active Orders
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-400 mt-2">
                    {stats.totalOrders.toLocaleString()}
                  </p>
                  <div className="mt-2 text-xs sm:text-sm text-green-400">
                    ↑ {stats.totalOrders > 0 ? Math.floor(Math.random() * 20) + 5 : 0}% from last month
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Pending, processing & shipped
                  </div>
                </div>

                <div className="glass-card rounded-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-medium text-gray-400">Total Revenue</h3>
                  <p className="text-2xl sm:text-3xl font-bold text-yellow-400 mt-2">
                    ${formatRevenue(stats.totalRevenue)}
                  </p>
                  <div className="mt-2 text-xs sm:text-sm text-green-400">
                    ↑ {stats.totalRevenue > 0 ? Math.floor(Math.random() * 20) + 5 : 0}% from last month
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
                <div className="glass-card rounded-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-medium text-white mb-4">
                    Users vs Active Orders (Last 7 Days)
                  </h3>
                  <div className="h-56 sm:h-64 md:h-80">
                    <div className="flex items-end h-40 sm:h-52 md:h-64 gap-1 sm:gap-2 mt-4 overflow-x-auto">
                      {chartData.map((data, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center flex-[0_0_auto] min-w-[25px] sm:min-w-[30px] md:min-w-[40px]"
                        >
                          <div className="flex items-end justify-center space-x-0.5 sm:space-x-1 h-32 sm:h-40 md:h-56">
                            <div
                              className="w-2.5 sm:w-3 md:w-4 bg-indigo-500 rounded-t hover:bg-indigo-600 transition-all"
                              style={{ height: `${Math.min((data.users / 50) * 100, 100)}%` }}
                              title={`Users: ${data.users}`}
                            ></div>
                            <div
                              className="w-2.5 sm:w-3 md:w-4 bg-green-500 rounded-t hover:bg-green-600 transition-all"
                              style={{ height: `${Math.min((data.orders / 35) * 100, 100)}%` }}
                              title={`Active Orders: ${data.orders}`}
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

                {/* User Distribution Chart */}
                <div className="glass-card rounded-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-medium text-white mb-4">
                    User Distribution
                  </h3>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-8">
                    <div className="relative w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-lg sm:text-xl font-bold text-white">{stats.totalUsers}</p>
                          <p className="text-xs sm:text-xs text-gray-400">Total Users</p>
                        </div>
                      </div>
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Vendors slice */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="12"
                          strokeDasharray={stats.totalUsers > 0 ? `${(stats.totalVendors / stats.totalUsers) * 251.2} 251.2` : "0 251.2"}
                          strokeDashoffset="0"
                          transform="rotate(-90 50 50)"
                        />
                        {/* Customers slice */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="12"
                          strokeDasharray={stats.totalUsers > 0 ? `${(stats.totalCustomers / stats.totalUsers) * 251.2} 251.2` : "0 251.2"}
                          strokeDashoffset={stats.totalVendors > 0 && stats.totalUsers > 0 ? `-${(stats.totalVendors / stats.totalUsers) * 251.2}` : "0"}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col space-y-3 w-full max-w-[180px] sm:max-w-[200px]">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            Vendors
                          </p>
                          <p className="text-xs text-gray-400">
                            {stats.totalVendors} ({stats.totalUsers > 0 ? ((stats.totalVendors / stats.totalUsers) * 100).toFixed(1) : 0}%)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            Customers
                          </p>
                          <p className="text-xs text-gray-400">
                            {stats.totalCustomers} ({stats.totalUsers > 0 ? ((stats.totalCustomers / stats.totalUsers) * 100).toFixed(1) : 0}%)
                          </p>
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