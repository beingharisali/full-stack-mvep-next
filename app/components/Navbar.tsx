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
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">MVEP</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {user?.role === 'customer' && (
              <>
                <Link 
                  href="/products" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/products' 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  Products
                </Link>
                <Link 
                  href="/cart" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/cart' 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  Cart
                </Link>
                <Link 
                  href="/checkout" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/checkout' 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  Checkout
                </Link>
                <Link 
                  href="/Customer/chat" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/checkout' 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  Chat
                </Link>
                <Link 
                  href="/orders/history" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/orders/history' 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  Order History
                </Link>
              </>
            )}
            
            {user?.role === 'admin' && (
              <>
                <Link 
                  href="/Admin/dashboard" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/Admin/dashboard' 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/Admin/products" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/Admin/products' 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  Products
                </Link>
                <Link 
                  href="/Admin/orders" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/Admin/orders' 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  Orders
                </Link>
                <Link 
                  href="/Admin/orders/history" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/Admin/orders/history' 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  Order History
                </Link>
              </>
            )}
            
            {user?.role === 'vendor' && (
              <>
                <Link 
                  href="/Vendor/dashboard" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/Vendor/dashboard' 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/Vendor/products" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/Vendor/products' 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  Products
                </Link>
                <Link 
                  href="/Vendor/orders" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/Vendor/orders' 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  Orders
                </Link>

                <Link 
                  href="/Vendor/chat" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/Vendor/orders' 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  Chat
                </Link>

                <Link 
                  href="/Vendor/orders/history" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/Vendor/orders/history' 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  Order History
                </Link>
              </>
            )}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user.firstName} {user.lastName}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button 
              onClick={onMenuToggle}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;