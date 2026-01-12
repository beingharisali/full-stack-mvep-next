"use client";

import Link from "next/link";
import { Home, Users, Settings, BarChart, ShoppingCart } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 bg-gray-900 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-700">
        Dashboard
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link
          href="#"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <Home size={20} />
          <span>Home</span>
        </Link>

        <Link
          href="#"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <Users size={20} />
          <span>Users</span>
        </Link>

        <Link
          href="/products"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <ShoppingCart size={20} />
          <span>Products</span>
        </Link>

        <Link
          href="#"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <BarChart size={20} />
          <span>Reports</span>
        </Link>

        <Link
          href="#"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </nav>
    </aside>
  );
}
