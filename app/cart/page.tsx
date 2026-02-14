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
      <div className="min-h-screen bg-[#050a14]">
        <Navbar />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <main className={`flex-1 p-4 lg:p-6 transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`}>
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl md:text-3xl font-bold neon-text mb-6">Your Cart</h1>
              
              {cart.items.length === 0 ? (
                <div className="glass-card rounded-lg p-8 text-center">
                  <h3 className="text-lg font-medium text-white mb-2">Your cart is empty</h3>
                  <p className="text-gray-400 mb-6">Looks like you haven't added anything to your cart yet</p>
                  <Link href="/products">
                    <button className="px-6 py-3 gaming-btn text-white rounded-md transition-all">
                      Start Shopping
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="glass-card rounded-lg overflow-hidden">
                  <div className="divide-y divide-indigo-500/30">
                    {cart.items.map((item) => (
                      <div key={item._id} className="p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row">
                          <div className="flex-shrink-0 w-full sm:w-24 h-24 sm:h-24 rounded-md overflow-hidden mb-4 sm:mb-0 border border-indigo-500/30">
                            {item.images && item.images.length > 0 ? (
                              <img
                                src={item.images[0]}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-indigo-900/30 flex items-center justify-center text-indigo-400 text-2xl">
                                
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 sm:ml-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                              <div className="mb-3 sm:mb-0">
                                <h3 className="text-lg font-medium text-white">{item.name}</h3>
                                <p className="mt-1 text-sm text-indigo-400">💰 {item.price.toFixed(2)} gold each</p>
                              </div>
                              <p className="text-lg font-medium text-yellow-400">💰 {(item.price * item.quantity).toFixed(2)} gold</p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center mt-4 space-y-3 sm:space-y-0">
                              <div className="flex items-center">
                                <button
                                  onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                  className="px-3 py-1 bg-indigo-900/50 rounded-l-md text-indigo-400 hover:bg-indigo-800/50 disabled:opacity-50 disabled:cursor-not-allowed border border-indigo-500/30"
                                  disabled={item.quantity <= 1}
                                >
                                  -
                                </button>
                                <span className="px-4 py-1 bg-[#1a1f2e] text-white min-w-[40px] text-center border-t border-b border-indigo-500/30">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                  className="px-3 py-1 bg-indigo-900/50 rounded-r-md text-indigo-400 hover:bg-indigo-800/50 disabled:opacity-50 disabled:cursor-not-allowed border border-indigo-500/30"
                                  disabled={item.quantity >= item.stock}
                                >
                                  +
                                </button>
                              </div>
                              
                              <button
                                onClick={() => handleRemoveFromCart(item._id)}
                                className="ml-0 sm:ml-6 text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-indigo-500/30 p-4 md:p-6 bg-[#1a1f2e]">
                    <div className="flex justify-between text-lg font-medium text-white mb-4">
                      <p>Subtotal ({getCartItemCount()} items)</p>
                      <p className="text-yellow-400">💰 {getCartTotal().toFixed(2)} gold</p>
                    </div>
                    <p className="text-sm text-gray-400 mb-6">
                      Shipping and taxes calculated at checkout.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Link href="/checkout" className="w-full">
                        <button
                          type="button"
                          className="w-full gaming-btn text-white rounded-md shadow-sm py-3 px-4 text-base font-medium"
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