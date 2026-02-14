'use client';

import Navbar from '@/app/components/Navbar'
import Sidebar from '@/app/components/Sidebar'
import Link from 'next/link';
import React, { useState, useEffect } from 'react'
import ProtectedRoute from '../../../shared/ProtectedRoute';
import { useAuth } from '../../../context/AuthContext';

function VendorDashboardPage() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
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
    }
  }, []);

  return (
    <ProtectedRoute allowedRoles={['vendor']} redirectPath="/">
      <div className="min-h-screen bg-[#050a14]">
        <Navbar onMenuToggle={toggleSidebar}/>
        <div className='flex'>
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} onToggle={toggleSidebar} />
          <div className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-0' : ''
          } ${typeof window !== 'undefined' && window.innerWidth < 1024 ? 'ml-0' : ''}`}>
            <div className="max-w-7xl mx-auto p-4 lg:p-6">
              <h1 className='font-bold text-xl sm:text-2xl mb-4 sm:mb-6 neon-text'>Welcome to Vendor Dashboard, {user?.firstName}!</h1>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="glass-card rounded-lg p-4 sm:p-6 hover:scale-105 transition-all duration-300">
                  <h2 className="text-lg sm:text-xl font-semibold text-indigo-400 mb-3 sm:mb-4">Manage Products</h2>
                  <p className="text-gray-400 mb-4 text-sm sm:text-base">View, add, edit, and manage your products</p>
                  <Link 
                    href="/Vendor/products" 
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 inline-block text-sm sm:text-base"
                  >
                    Manage Products
                  </Link>
                </div>
                
                <div className="glass-card rounded-lg p-4 sm:p-6 hover:scale-105 transition-all duration-300">
                  <h2 className="text-lg sm:text-xl font-semibold text-purple-400 mb-3 sm:mb-4">View Orders</h2>
                  <p className="text-gray-400 mb-4 text-sm sm:text-base">Check and manage customer orders</p>
                  <Link 
                    href="/Vendor/orders" 
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 inline-block text-sm sm:text-base"
                  >
                    View Orders
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

export default VendorDashboardPage