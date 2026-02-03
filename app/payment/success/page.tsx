'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ProtectedRoute from '../../../shared/ProtectedRoute';
import { getOrderById } from '../../../services/order.api';
import { Order } from '../../../types/order';

const PaymentSuccessPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get('orderId');
  const paymentStatus = searchParams.get('status');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('Invalid order ID');
        setLoading(false);
        return;
      }

      try {
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['customer', 'admin', 'vendor']} redirectPath="/">
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <main className={`flex-1 p-4 md:p-6 transition-all duration-300 ${sidebarOpen ? 'md:ml-0' : ''}`}>
              <div className="max-w-4xl mx-auto text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading order details...</p>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !order) {
    return (
      <ProtectedRoute allowedRoles={['customer', 'admin', 'vendor']} redirectPath="/">
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <main className={`flex-1 p-4 md:p-6 transition-all duration-300 ${sidebarOpen ? 'md:ml-0' : ''}`}>
              <div className="max-w-4xl mx-auto text-center py-12">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
                <p className="text-gray-600 mb-6">{error || 'Unable to load order details'}</p>
                <Link href="/products">
                  <button className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const isSuccess = paymentStatus === 'success' || order.status !== 'cancelled';

  return (
    <ProtectedRoute allowedRoles={['customer', 'admin', 'vendor']} redirectPath="/">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <main className={`flex-1 p-4 md:p-6 transition-all duration-300 ${sidebarOpen ? 'md:ml-0' : ''}`}>
            <div className="max-w-4xl mx-auto">
              <div className={`rounded-lg shadow-md p-6 md:p-8 text-center ${isSuccess ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className={`text-6xl mb-4 ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                  {isSuccess ? '✓' : '✗'}
                </div>
                
                <h1 className={`text-3xl font-bold mb-4 ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
                  {isSuccess ? 'Order Placed Successfully!' : 'Order Failed'}
                </h1>
                
                {isSuccess ? (
                  <>
                    <p className="text-lg text-green-700 mb-2">
                      Thank you for your purchase!
                    </p>
                    <p className="text-gray-600 mb-8">
                      Your order has been confirmed and is being processed. You'll receive an email confirmation shortly.
                    </p>
                  </>
                ) : (
                  <p className="text-gray-600 mb-8">
                    There was an issue processing your order. Please try again or contact support.
                  </p>
                )}

                <div className="bg-white rounded-lg shadow-sm p-6 mb-8 text-left">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-medium text-gray-900">{order._id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Order Status</p>
                      <p className="font-medium text-gray-900 capitalize">{order.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-medium text-gray-900">${order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {order.paymentMethod?.replace('-', ' ') || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium text-gray-800 mb-3">Items Ordered</h3>
                  <div className="space-y-3">
                    {order.items.map((item: any) => (
                      <div key={item._id} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div className="flex items-center">
                          {item.images && item.images[0] && (
                            <img 
                              src={item.images[0]} 
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded mr-3"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/Customer/orders">
                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                      View Orders
                    </button>
                  </Link>
                  <Link href="/products">
                    <button className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors">
                      Continue Shopping
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PaymentSuccessPage;