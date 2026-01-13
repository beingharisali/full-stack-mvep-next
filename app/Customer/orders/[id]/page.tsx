'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import ProtectedRoute from '../../../../shared/ProtectedRoute';
import { getOrderById, Order } from '../../../../services/order.api';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (id) {
          const orderData = await getOrderById(id as string);
          setOrder(orderData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['customer']} redirectPath="/">
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Details</h1>
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute allowedRoles={['customer']} redirectPath="/">
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Details</h1>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!order) {
    return (
      <ProtectedRoute allowedRoles={['customer']} redirectPath="/">
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Details</h1>
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Order not found</h3>
                  <p className="text-gray-500">The order you're looking for doesn't exist.</p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['customer']} redirectPath="/">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Details</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-800">Order # {order._id.substring(0, 8)}</h2>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'delivered' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'shipped' 
                            ? 'bg-blue-100 text-blue-800' 
                            : order.status === 'processing' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : order.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="border rounded-lg divide-y divide-gray-200">
                      {order.items.map((item, index) => (
                        <div key={index} className="p-4 flex">
                          <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-gray-200">
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
                          <div className="ml-4 flex-1">
                            <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Information</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Date Placed</h3>
                        <p className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                        <p className="text-lg font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
                        <p className="text-sm text-gray-900 capitalize">{order.paymentMethod}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Transaction ID</h3>
                        <p className="text-sm text-gray-900">{order.transactionId || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping Address</h2>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-900">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </p>
                      <p className="text-sm text-gray-900">{order.shippingAddress.email}</p>
                      <p className="text-sm text-gray-900">{order.shippingAddress.phone}</p>
                      <p className="text-sm text-gray-900">{order.shippingAddress.address}</p>
                      <p className="text-sm text-gray-900">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                      <p className="text-sm text-gray-900">{order.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OrderDetailPage;