'use client';

import { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import Sidebar from '@/app/components/Sidebar';
import ProtectedRoute from '../../../shared/ProtectedRoute';
import { useAuth } from '../../../context/AuthContext';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('7');

  const stats = {
    totalUsers: 124,
    totalProducts: 89,
    totalOrders: 342,
    revenue: 24560,
  };

  const chartData = [
    { day: 'Mon', users: 40, orders: 30 },
    { day: 'Tue', users: 30, orders: 25 },
    { day: 'Wed', users: 20, orders: 15 },
    { day: 'Thu', users: 27, orders: 22 },
    { day: 'Fri', users: 18, orders: 18 },
    { day: 'Sat', users: 23, orders: 20 },
    { day: 'Sun', users: 34, orders: 28 },
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']} redirectPath="/">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">System Analytics</h1>
              
              <div className="mb-6 flex justify-end">
                <select 
                  value={dateRange} 
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-medium text-gray-500">Total Users</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                  <div className="mt-2 text-sm text-green-500">↑ 12% from last month</div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-medium text-gray-500">Total Products</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
                  <div className="mt-2 text-sm text-green-500">↑ 5% from last month</div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-medium text-gray-500">Total Orders</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
                  <div className="mt-2 text-sm text-green-500">↑ 18% from last month</div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-medium text-gray-500">Revenue</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">${stats.revenue.toLocaleString()}</p>
                  <div className="mt-2 text-sm text-green-500">↑ 22% from last month</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Users vs Orders</h3>
                  <div className="h-80">
                    <div className="flex items-end h-64 gap-2 mt-4">
                      {chartData.map((data, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div className="flex items-end justify-center space-x-1 h-56">
                            <div 
                              className="w-6 bg-blue-500 rounded-t hover:bg-blue-600" 
                              style={{ height: `${(data.users / 50) * 100}%` }}
                              title={`Users: ${data.users}`}
                            ></div>
                            <div 
                              className="w-6 bg-green-500 rounded-t hover:bg-green-600" 
                              style={{ height: `${(data.orders / 35) * 100}%` }}
                              title={`Orders: ${data.orders}`}
                            ></div>
                          </div>
                          <span className="text-xs mt-2">{data.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">User Distribution</h3>
                  <div className="flex items-center justify-center gap-8">
                    <div className="relative w-48 h-48">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-xl font-bold">124</p>
                          <p className="text-xs text-gray-500">Total Users</p>
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
                          strokeDasharray="163.36281798666925" 
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
                          strokeDasharray="125.66370614359172" 
                          strokeDashoffset="-163.36281798666925"
                          transform="rotate(-90 50 50)"
                        />
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="40" 
                          fill="none" 
                          stroke="#ef4444" 
                          strokeWidth="12" 
                          strokeDasharray="50.26548245723769" 
                          strokeDashoffset="-289.02652413026097"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                        <div>
                          <p className="text-sm font-medium">Customers</p>
                          <p className="text-xs text-gray-500">65%</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                        <div>
                          <p className="text-sm font-medium">Vendors</p>
                          <p className="text-xs text-gray-500">25%</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                        <div>
                          <p className="text-sm font-medium">Admins</p>
                          <p className="text-xs text-gray-500">10%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">John Doe</div>
                          <div className="text-sm text-gray-500">john@example.com</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Created a new product
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          2 minutes ago
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">Jane Smith</div>
                          <div className="text-sm text-gray-500">jane@example.com</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Placed an order
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          15 minutes ago
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">Bob Johnson</div>
                          <div className="text-sm text-gray-500">bob@example.com</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Updated profile
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          1 hour ago
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">Alice Williams</div>
                          <div className="text-sm text-gray-500">alice@example.com</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Registered account
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          3 hours ago
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}