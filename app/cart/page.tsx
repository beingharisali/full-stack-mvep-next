'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProtectedRoute from '../../shared/ProtectedRoute';
import { useCart } from '../../context/CartContext';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartItemCount } = useCart();

  const handleCheckout = () => {
    console.log('Proceeding to checkout');
  };

  return (
    <ProtectedRoute allowedRoles={['customer', 'admin', 'vendor']} redirectPath="/">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
              
              {cart.items.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500">Looks like you haven't added anything to your cart yet</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    {cart.items.map((item) => (
                      <div key={item._id} className="p-6 flex flex-col sm:flex-row">
                        <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
                          {item.images && item.images.length > 0 ? (
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-full h-full object-center object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 border-2 border-dashed rounded-xl" />
                          )}
                        </div>
                        
                        <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                              <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                            </div>
                            <p className="text-lg font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          
                          <div className="mt-4 flex items-center">
                            <div className="flex items-center">
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                className="px-3 py-1 bg-gray-200 rounded-l-md text-gray-600 hover:bg-gray-300"
                                disabled={item.quantity <= 1}
                              >
                                -
                              </button>
                              <span className="px-4 py-1 bg-gray-100 text-gray-800 min-w-[40px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className="px-3 py-1 bg-gray-200 rounded-r-md text-gray-600 hover:bg-gray-300"
                                disabled={item.quantity >= item.stock}
                              >
                                +
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="ml-6 text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-200 p-6">
                    <div className="flex justify-between text-lg font-medium text-gray-900 mb-4">
                      <p>Subtotal</p>
                      <p>${getCartTotal().toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">
                      Shipping and taxes calculated at checkout.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                      <button
                        onClick={handleCheckout}
                        className="flex-1 bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Checkout
                      </button>
                      <button
                        className="flex-1 bg-white border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Continue Shopping
                      </button>
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