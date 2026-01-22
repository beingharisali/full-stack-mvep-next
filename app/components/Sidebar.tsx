"use client";

import Link from "next/link";
import { Home, Users, Settings, BarChart, ShoppingCart, Package, FileText } from "lucide-react";
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();

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
          // { href: '/products', icon: Package, label: 'Manage Products' },
          { href: '/Vendor/orders', icon: FileText, label: 'Orders' },
          // { href: '', icon: BarChart, label: 'Reports' },
          // { href: '', icon: Settings, label: 'Settings' },
        ];
      case 'customer':
        return [
          { href: '/Customer/dashboard', icon: Home, label: 'Home' },
          { href: '/Customer/products', icon: ShoppingCart, label: 'Products' },
          { href: '/Customer/orders', icon: Package, label: 'My Orders' },
          // { href: '', icon: FileText, label: 'Wishlist' },
          // { href: '', icon: Settings, label: 'Account' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="h-150vh w-64 bg-gray-900 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-700">
        {user ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard` : 'Dashboard'}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}