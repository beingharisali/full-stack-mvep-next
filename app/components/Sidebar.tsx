"use client";

import { useRouter } from 'next/navigation';
import { Home, Settings, BarChart, ShoppingCart, Package, FileText, MessageSquare, X } from "lucide-react";
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';

interface MenuItem {
  href: string;
  icon: React.ComponentType<{ size: number }>;
  label: string;
}

export interface SidebarProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  onToggle?: () => void;
}

export default function Sidebar({ isOpen, setIsOpen, onToggle }: SidebarProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
        if (setIsOpen) {
          setIsOpen(false);
        }
      } else {
        setSidebarOpen(true);
        if (setIsOpen) {
          setIsOpen(true);
        }
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [setIsOpen]);

  const toggleSidebar = () => {
    if (setIsOpen) {
      setIsOpen(!isOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
    
    if (onToggle) {
      onToggle();
    }
  };

  const isSidebarOpen = isOpen !== undefined ? isOpen : sidebarOpen;

  const getMenuItems = (): MenuItem[] => {
    if (!user) return []; 

    switch (user.role) {
      case 'admin':
        return [
          { href: '/Admin/dashboard', icon: Home, label: 'Home' },
          { href: '/Admin/products', icon: ShoppingCart, label: 'Products' },
          { href: '/Admin/orders', icon: Package, label: 'Orders' },
          { href: '/Admin/analytics', icon: BarChart, label: 'Analytics' },
          { href: '/Admin/settings', icon: Settings, label: 'Settings' },
        ];
      case 'vendor':
        return [
          { href: '/Vendor/dashboard', icon: Home, label: 'Home' },
          { href: '/Vendor/products', icon: ShoppingCart, label: 'My Products' },
          { href: '/Vendor/orders', icon: FileText, label: 'Orders' },
          { href: '/Vendor/chat', icon: MessageSquare, label: 'Chat' },
        ];
      case 'customer':
        return [
          { href: '/Customer/dashboard', icon: Home, label: 'Home' },
          { href: '/Customer/products', icon: ShoppingCart, label: 'Products' },
          { href: '/Customer/orders', icon: Package, label: 'My Orders' },
          { href: '/Customer/chat', icon: MessageSquare, label: 'Chat' },
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}
      
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50
        transform transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:translate-x-0
        h-screen w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col
        ${isSidebarOpen ? 'block' : 'hidden'} lg:block
        shadow-2xl shadow-indigo-500/10
        border-r border-indigo-500/20
      `}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-indigo-500/20 bg-gradient-to-r from-indigo-600/10 to-purple-600/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {user ? user.role.charAt(0).toUpperCase() : 'M'}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-300">Welcome,</span>
              <h2 className="text-sm font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
              </h2>
            </div>
          </div>
          <button 
            onClick={toggleSidebar}
            className="lg:hidden w-8 h-8 rounded-lg bg-gray-800/50 hover:bg-gray-700 flex items-center justify-center transition-all hover:scale-110 border border-indigo-500/30"
            aria-label="Close sidebar"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item, index) => {
            const isActive = typeof window !== 'undefined' && window.location.pathname === item.href;
            
            return (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  if (window.innerWidth < 1024) { 
                    toggleSidebar();
                  }
                  router.push(item.href);
                }}
                className={`
                  w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-all duration-200 group relative overflow-hidden
                  ${isActive 
                    ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-white border border-indigo-500/30 shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-indigo-500/30'
                  }
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-r-full" />
                )}
                
                <div className={`
                  p-1.5 rounded-md transition-all duration-200
                  ${isActive 
                    ? 'bg-indigo-600/30 text-indigo-400' 
                    : 'text-gray-500 group-hover:text-indigo-400 group-hover:bg-indigo-600/20'
                  }
                `}>
                  <item.icon size={18} />
                </div>
                
                <span className="flex-1 text-sm font-medium">{item.label}</span>
                
                <span className={`
                  opacity-0 -translate-x-2 transition-all duration-200 text-indigo-400
                  ${isActive ? 'opacity-100 translate-x-0' : 'group-hover:opacity-100 group-hover:translate-x-0'}
                `}>
                  →
                </span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-indigo-500/20">
          <div className="text-xs text-gray-500 text-center">
            <span className="text-indigo-400">MVEP</span> v1.0.0
          </div>
        </div>
      </aside>
    </>
  );
}