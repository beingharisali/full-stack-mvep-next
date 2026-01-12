"use client";

import Link from "next/link";
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/"; 
  };

  return (
    <header className="text-gray-600 body-font border-b">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link
          href="/"
          className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
        >
          <span className="ml-3 text-xl">MVEP</span>
        </Link>

        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <Link href="/Admin/dashboard" className="mr-5 hover:text-gray-900">
            Home
          </Link>
          <Link href="/products" className="mr-5 hover:text-gray-900">
            Products
          </Link>
          <Link href="#" className="mr-5 hover:text-gray-900">
            Contact
          </Link>
          <Link href="#" className="mr-5 hover:text-gray-900">
            Third Link
          </Link>
        </nav>

        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Hello, {user.firstName} ({user.role})</span>
            <button 
              onClick={handleLogout}
              className="inline-flex items-center bg-red-600 text-white border-0 py-1 px-3 rounded text-base hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link 
            href="/"
            className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 hover:bg-gray-200 rounded text-base"
          >
            Login
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              className="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </header>
  );
}