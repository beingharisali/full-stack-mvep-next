'use client';

import Navbar from '@/app/components/Navbar'
import Sidebar from '@/app/components/Sidebar'
import Link from 'next/link';
import React from 'react'
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useAuth } from '../../../context/AuthContext';

function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['admin']} redirectPath="/">
      <div>
        <Navbar/>
        <div className='flex'>
        <Sidebar/>
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className='font-bold text-2xl mb-6'>Welcome to Admin Dashboard, {user?.firstName}!</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Manage Products</h2>
                <p className="text-gray-600 mb-4">View, add, edit, and manage all products</p>
                <Link 
                  href="/products" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block"
                >
                  Manage Products
                </Link>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
                <p className="text-gray-600 mb-4">View and manage all users in the system</p>
                <Link 
                  href="#" 
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 inline-block"
                >
                  Manage Users
                </Link>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">System Analytics</h2>
                <p className="text-gray-600 mb-4">View comprehensive system analytics</p>
                <Link 
                  href="#" 
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 inline-block"
                >
                  View Analytics
                </Link>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Orders Management</h2>
                <p className="text-gray-600 mb-4">Monitor and manage all orders</p>
                <Link 
                  href="#" 
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 inline-block"
                >
                  Manage Orders
                </Link>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Categories</h2>
                <p className="text-gray-600 mb-4">Manage product categories</p>
                <Link 
                  href="#" 
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 inline-block"
                >
                  Manage Categories
                </Link>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">System Settings</h2>
                <p className="text-gray-600 mb-4">Configure system-wide settings</p>
                <Link 
                  href="#" 
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 inline-block"
                >
                  System Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default AdminDashboardPage