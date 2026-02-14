"use client";

import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

interface NavbarProps {
  onMenuToggle?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="glass-card border-b border-indigo-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <span className="text-xl font-bold neon-text group-hover:scale-105 transition-transform">
                MVEP
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {user?.role === "customer" && (
              <>
                <Link
                  href="/products"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    pathname === "/products"
                      ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                      : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                  }`}
                >
                  Products
                </Link>
                <Link
                  href="/cart"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    pathname === "/cart"
                      ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                      : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                  }`}
                >
                  🛒 Cart
                </Link>
                <Link
                  href="/checkout"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    pathname === "/checkout"
                      ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                      : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                  }`}
                >
                   Checkout
                </Link>
                <Link
                  href="/Customer/chat"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    pathname === "/Customer/chat"
                      ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                      : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                  }`}
                >
                  💬 Chat
                </Link>
                <Link
                  href="/orders/history"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    pathname === "/orders/history"
                      ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                      : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                  }`}
                >
                  📜 Order History
                </Link>
              </>
            )}

            {user?.role === "admin" && (
              <>
                <Link
                  href="/Admin/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    pathname === "/Admin/dashboard"
                      ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                      : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                  }`}
                >
                  DASHBOARD
                </Link>
                <Link
                  href="/Admin/products"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    pathname === "/Admin/products"
                      ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                      : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                  }`}
                >
                  PRODUCTS
                </Link>
                <Link
                  href="/Admin/orders"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    pathname === "/Admin/orders"
                      ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                      : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                  }`}
                >
                  ORDERS
                </Link>
                <Link
                  href="/Admin/orders/history"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    pathname === "/Admin/orders/history"
                      ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                      : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                  }`}
                >
                  ORDERS HISTORY
                </Link>
              </>
            )}

            {user?.role === "vendor" && (
              <>
                <Link
                  href="/Vendor/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    pathname === "/Vendor/dashboard"
                      ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                      : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                  }`}
                >
                  🏪 Merchant Stall
                </Link>
                <Link
                  href="/Vendor/products"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    pathname === "/Vendor/products"
                      ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                      : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                  }`}
                >
                  📦 Cart
                </Link>
                <Link
                  href="/Vendor/orders"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    pathname === "/Vendor/orders"
                      ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                      : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                  }`}
                >
                  📋 Order Requests
                </Link>
                <Link
                  href="/Vendor/chat"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    pathname === "/Vendor/chat"
                      ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                      : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                  }`}
                >
                  💬 Chat
                </Link>
                <Link
                  href="/Vendor/orders/history"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    pathname === "/Vendor/orders/history"
                      ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                      : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                  }`}
                >
                  📜 Order History
                </Link>
              </>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300 flex items-center gap-2">
                  <span className="text-indigo-400">⚡</span>
                  {user.firstName} {user.lastName}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white gaming-btn rounded-md transition-all"
                >
                  🚪 Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-indigo-400 border border-indigo-500/50 rounded-md hover:bg-indigo-500/10 transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white gaming-btn rounded-md transition-all"
                >
                  Create Character
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={onMenuToggle}
              className="text-gray-400 hover:text-indigo-400 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;