'use client';

import Navbar from '@/app/components/Navbar'
import Sidebar from '@/app/components/Sidebar'
import Link from 'next/link';
import React, { useState } from 'react'
import ProtectedRoute from '../../../shared/ProtectedRoute';
import { useAuth } from '../../../context/AuthContext';

function AdminDashboardPage() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={['admin']} redirectPath="/">
      <div className="min-h-screen bg-gray-50">
        <Navbar/>
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <main className={`flex-1 p-4 md:p-6 transition-all duration-300 ${sidebarOpen ? 'md:ml-0' : ''}`}>
            <div className="max-w-7xl mx-auto">
              <h1 className='text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6'>Welcome to Admin Dashboard, {user?.firstName}!</h1>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3">Manage Products</h2>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">View, add, edit, and manage all products</p>
                  <Link 
                    href="/Admin/products" 
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block transition-colors text-sm sm:text-base"
                  >
                    Manage Products
                  </Link>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3">Manage Users</h2>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">View and manage all users in the system</p>
                  <Link 
                    href="/Admin/users" 
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 inline-block transition-colors text-sm sm:text-base"
                  >
                    Manage Users
                  </Link>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3">System Analytics</h2>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">View comprehensive system analytics</p>
                  <Link 
                    href="/Admin/analytics" 
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 inline-block transition-colors text-sm sm:text-base"
                  >
                    View Analytics
                  </Link>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3">Orders Management</h2>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">Monitor and manage all orders</p>
                  <Link 
                    href="/Admin/orders" 
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 inline-block transition-colors text-sm sm:text-base"
                  >
                    Manage Orders
                  </Link>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3">Categories</h2>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">Manage product categories</p>
                  <Link 
                    href="/Admin/categories" 
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 inline-block transition-colors text-sm sm:text-base"
                  >
                    Manage Categories
                  </Link>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3">System Settings</h2>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">Configure system-wide settings</p>
                  <Link 
                    href="/Admin/settings" 
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-red-600 text-white rounded-md hover:bg-red-700 inline-block transition-colors text-sm sm:text-base"
                  >
                    System Settings
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default AdminDashboardPage