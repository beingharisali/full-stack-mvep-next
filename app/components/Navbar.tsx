"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

interface NavbarProps {
  onMenuToggle?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="glass-card border-b border-indigo-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button 
              onClick={() => handleNavigation("/")} 
              className="flex-shrink-0 flex items-center group"
            >
              <span className="text-xl font-bold neon-text group-hover:scale-105 transition-transform">
                MVEP
              </span>
            </button>
          </div>

          <div className="hidden md:flex items-center justify-center flex-1 px-4">
            <div className="flex items-center space-x-2 lg:space-x-4">
              {user?.role === "customer" && (
                <>
                  <button
                    onClick={() => handleNavigation("/products")}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                      pathname === "/products"
                        ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                        : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                    }`}
                  >
                    Products
                  </button>
                  <button
                    onClick={() => handleNavigation("/cart")}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                      pathname === "/cart"
                        ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                        : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                    }`}
                  >
                    🛒 Cart
                  </button>
                  <button
                    onClick={() => handleNavigation("/checkout")}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                      pathname === "/checkout"
                        ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                        : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                    }`}
                  >
                    Checkout
                  </button>
                  <button
                    onClick={() => handleNavigation("/Customer/chat")}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                      pathname === "/Customer/chat"
                        ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                        : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                    }`}
                  >
                    💬 Chat
                  </button>
                  <button
                    onClick={() => handleNavigation("/orders/history")}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                      pathname === "/orders/history"
                        ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                        : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                    }`}
                  >
                    📜 Order History
                  </button>
                </>
              )}

              {user?.role === "admin" && (
                <>
                  <button
                    onClick={() => handleNavigation("/Admin/dashboard")}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                      pathname === "/Admin/dashboard"
                        ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                        : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                    }`}
                  >
                    DASHBOARD
                  </button>
                  <button
                    onClick={() => handleNavigation("/Admin/products")}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                      pathname === "/Admin/products"
                        ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                        : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                    }`}
                  >
                    PRODUCTS
                  </button>
                  <button
                    onClick={() => handleNavigation("/Admin/orders")}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                      pathname === "/Admin/orders"
                        ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                        : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                    }`}
                  >
                    ORDERS
                  </button>
                  <button
                    onClick={() => handleNavigation("/Admin/orders/history")}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                      pathname === "/Admin/orders/history"
                        ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                        : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                    }`}
                  >
                    ORDERS HISTORY
                  </button>
                </>
              )}

              {user?.role === "vendor" && (
                <>
                  <button
                    onClick={() => handleNavigation("/Vendor/dashboard")}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                      pathname === "/Vendor/dashboard"
                        ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                        : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                    }`}
                  >
                    🏪 Vendor 
                  </button>
                  <button
                    onClick={() => handleNavigation("/Vendor/products")}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                      pathname === "/Vendor/products"
                        ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                        : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                    }`}
                  >
                    📦 Cart
                  </button>
                  <button
                    onClick={() => handleNavigation("/Vendor/orders")}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                      pathname === "/Vendor/orders"
                        ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                        : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                    }`}
                  >
                    📋 Order Requests
                  </button>
                  <button
                    onClick={() => handleNavigation("/Vendor/chat")}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                      pathname === "/Vendor/chat"
                        ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                        : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                    }`}
                  >
                    💬 Chat
                  </button>
                  <button
                    onClick={() => handleNavigation("/Vendor/orders/history")}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                      pathname === "/Vendor/orders/history"
                        ? "text-indigo-400 bg-indigo-500/20 border border-indigo-500/50"
                        : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                    }`}
                  >
                    📜 Order History
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300 hidden lg:flex items-center gap-2 whitespace-nowrap">
                  <span className="text-indigo-400">⚡</span>
                  {user.firstName} {user.lastName}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white gaming-btn rounded-md transition-all whitespace-nowrap"
                >
                  🚪 Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleNavigation("/login")}
                  className="px-4 py-2 text-sm font-medium text-indigo-400 border border-indigo-500/50 rounded-md hover:bg-indigo-500/10 transition-all whitespace-nowrap"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation("/register")}
                  className="px-4 py-2 text-sm font-medium text-white gaming-btn rounded-md transition-all whitespace-nowrap"
                >
                  Register
                </button>
              </div>
            )}

            <div className="md:hidden flex items-center ml-3">
              <button
                onClick={onMenuToggle}
                className="text-gray-400 hover:text-indigo-400 transition-colors p-2"
                aria-label="Toggle menu"
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
      </div>
    </nav>
  );
};

export default Navbar;