"use client";

import Link from "next/link";
import { Home, Users, Settings, BarChart, ShoppingCart, Package, FileText, X } from "lucide-react";
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function Sidebar({ isOpen, setIsOpen }: { isOpen?: boolean; setIsOpen?: (open: boolean) => void }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    if (setIsOpen) {
      setIsOpen(!isOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const isSidebarOpen = isOpen !== undefined ? isOpen : sidebarOpen;

  const getMenuItems = () => {
    if (!user) return []; 

    switch (user.role) {
      case 'admin':
        return [
          { href: '/Admin/dashboard', icon: Home, label: 'Home' },
          { href: '/Admin/products', icon: ShoppingCart, label: 'Products' },
          { href: '/Admin/users', icon: Users, label: 'Users' },
          { href: '/Admin/orders', icon: Package, label: 'Orders' },
          { href: '/Admin/analytics', icon: BarChart, label: 'Analytics' },
          { href: '/Admin/settings', icon: Settings, label: 'Settings' },
        ];
      case 'vendor':
        return [
          { href: '/Vendor/dashboard', icon: Home, label: 'Home' },
          { href: '/products', icon: ShoppingCart, label: 'Products' },
          { href: '/Vendor/orders', icon: FileText, label: 'Orders' },
        ];
      case 'customer':
        return [
          { href: '/Customer/dashboard', icon: Home, label: 'Home' },
          { href: '/Customer/products', icon: ShoppingCart, label: 'Products' },
          { href: '/Customer/orders', icon: Package, label: 'My Orders' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <aside className={`
        fixed md:relative inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        h-screen w-64 bg-gray-900 text-white flex flex-col
      `}>
        <div className="h-16 flex items-center justify-between px-4 text-lg font-bold border-b border-gray-700">
          <span>{user ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard` : 'Dashboard'}</span>
          <button 
            onClick={toggleSidebar}
            className="md:hidden text-white hover:text-gray-300"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              onClick={() => {
                if (window.innerWidth < 768) {
                  toggleSidebar();
                }
              }}
            >
              <item.icon size={20} />
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <button
        onClick={toggleSidebar}
        className="fixed top-20 left-4 z-30 md:hidden bg-gray-900 text-white p-2 rounded-full shadow-lg"
        aria-label="Toggle sidebar"
      >
        <svg
          className={`w-5 h-5 transform transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </>
  );
}