"use client";

import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="text-gray-600 body-font border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto flex flex-wrap p-4 flex-col md:flex-row items-center justify-between">
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link
            href="/"
            className="flex title-font font-medium items-center text-gray-900"
          >
            <span className="ml-3 text-xl md:text-2xl">MVEP</span>
          </Link>
          
          <button 
            onClick={toggleMenu}
            className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className="hidden md:flex md:ml-auto md:items-center text-base justify-center space-x-5">
          <Link href="/products" className="hover:text-gray-900 transition-colors">
            Products
          </Link>
          <Link href="/cart" className="hover:text-gray-900 transition-colors">
            Cart
          </Link>
          <Link href="/checkout" className="hover:text-gray-900 transition-colors">
            Checkout
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4 mt-4 md:mt-0">
          {user ? (
            <>
              <span className="text-gray-700 text-sm">
                Hello, {user.firstName} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center bg-red-600 text-white border-0 py-1 px-3 rounded text-base hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 hover:bg-gray-200 rounded text-base transition-colors"
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
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-3">
            <div className="flex flex-col space-y-2 pb-3 border-b">
              <Link 
                href="/products" 
                className="hover:text-gray-900 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                href="/cart" 
                className="hover:text-gray-900 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Cart
              </Link>
              <Link 
                href="/checkout" 
                className="hover:text-gray-900 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Checkout
              </Link>
            </div>
            
            <div className="pt-3">
              {user ? (
                <div className="space-y-3">
                  <div className="text-gray-700 text-sm">
                    Hello, {user.firstName} ({user.role})
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full inline-flex items-center justify-center bg-red-600 text-white border-0 py-2 px-4 rounded hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/"
                  className="w-full inline-flex items-center justify-center bg-gray-100 border-0 py-2 px-4 hover:bg-gray-200 rounded transition-colors"
                  onClick={() => setIsMenuOpen(false)}
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
          </div>
        </div>
      )}
    </header>
  );
}