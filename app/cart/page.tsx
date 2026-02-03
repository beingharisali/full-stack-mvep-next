'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProtectedRoute from '../../shared/ProtectedRoute';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartItemCount } = useCart();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleRemoveFromCart = async (productId: string) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await updateQuantity(productId, quantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleCheckout = () => {
    console.log('Proceeding to checkout');
  };

  return (
    <ProtectedRoute allowedRoles={['customer', 'admin', 'vendor']} redirectPath="/">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <main className={`flex-1 p-4 lg:p-6 transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`}>
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
              
              {cart.items.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet</p>
                  <Link href="/products">
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      Start Shopping
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    {cart.items.map((item) => (
                      <div key={item._id} className="p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row">
                          <div className="flex-shrink-0 w-full sm:w-24 h-24 sm:h-24 rounded-md overflow-hidden mb-4 sm:mb-0">
                            {item.images && item.images.length > 0 ? (
                              <img
                                src={item.images[0]}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 border-2 border-dashed rounded-xl" />
                            )}
                          </div>
                          
                          <div className="flex-1 sm:ml-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                              <div className="mb-3 sm:mb-0">
                                <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                              </div>
                              <p className="text-lg font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center mt-4 space-y-3 sm:space-y-0">
                              <div className="flex items-center">
                                <button
                                  onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                  className="px-3 py-1 bg-gray-200 rounded-l-md text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={item.quantity <= 1}
                                >
                                  -
                                </button>
                                <span className="px-4 py-1 bg-gray-100 text-gray-800 min-w-[40px] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                  className="px-3 py-1 bg-gray-200 rounded-r-md text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={item.quantity >= item.stock}
                                >
                                  +
                                </button>
                              </div>
                              
                              <button
                                onClick={() => handleRemoveFromCart(item._id)}
                                className="ml-0 sm:ml-6 text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-200 p-4 md:p-6 bg-gray-50">
                    <div className="flex justify-between text-lg font-medium text-gray-900 mb-4">
                      <p>Subtotal ({getCartItemCount()} items)</p>
                      <p>${getCartTotal().toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">
                      Shipping and taxes calculated at checkout.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Link href="/checkout" className="w-full">
                        <button
                          type="button"
                          className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Checkout
                        </button>
                      </Link>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CartPage;