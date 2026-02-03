'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import ProtectedRoute from '../../../../shared/ProtectedRoute';
import { getSingleOrderEnhanced, OrderEnhanced } from '../../../../services/order.api';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderEnhanced | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (id) {
          const orderData = await getSingleOrderEnhanced(id as string);
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
            <main className="flex-1 p-6 lg:p-6">
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
            <main className="flex-1 p-6 lg:p-6">
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
            <main className="flex-1 p-6 lg:p-6">
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
          <main className="flex-1 p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Details</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-800">Order #{order._id.substring(0, 8)}</h2>
                      <div className="flex flex-col items-end">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'delivered' 
                            ? 'bg-green-100 text-green-800' 
                            : order.status === 'shipped' 
                              ? 'bg-blue-100 text-blue-800' 
                              : order.status === 'processing' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : order.status === 'pending'
                                  ? 'bg-gray-100 text-gray-800'
                                  : 'bg-red-100 text-red-800'
                        }`}>
                          {order.statusInfo.statusDisplay}
                        </span>
                        {order.statusInfo.isRecent && (
                          <span className="text-xs text-green-600 mt-1">Recently updated</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="border rounded-lg divide-y divide-gray-200">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="p-4 flex">
                          <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-gray-200">
                            <div className="w-full h-full bg-gray-200 border-2 border-dashed rounded-xl" />
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="text-sm font-medium text-gray-900">{item.product.name}</h3>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                            </p>
                            {item.product.description && (
                              <p className="text-xs text-gray-400 mt-1">{item.product.description}</p>
                            )}
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            ${item.subtotal.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total Amount:</span>
                        <span>${order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Status History</h2>
                    <div className="space-y-4">
                      {order.statusHistory.map((history: any, index: number) => (
                        <div key={index} className="flex items-start">
                          <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-2 ${
                            index === order.statusHistory.length - 1 
                              ? 'bg-green-500' 
                              : 'bg-gray-300'
                          }`}></div>
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                history.status === 'delivered' 
                                  ? 'bg-green-100 text-green-800' 
                                  : history.status === 'shipped' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : history.status === 'processing' 
                                      ? 'bg-yellow-100 text-yellow-800' 
                                      : history.status === 'pending'
                                        ? 'bg-gray-100 text-gray-800'
                                        : 'bg-red-100 text-red-800'
                              }`}>
                                {history.statusDisplay || history.status}
                              </span>
                              <span className="text-sm text-gray-500">
                                {history.formattedTimestamp || new Date(history.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Updated by: {history.updatedBy || 'System'}
                            </p>
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
                        <h3 className="text-sm font-medium text-gray-500">Order ID</h3>
                        <p className="text-sm text-gray-900">#{order._id}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Date Placed</h3>
                        <p className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                        <p className="text-sm text-gray-900">
                          {order.statusInfo.formattedLastUpdated || new Date(order.updatedAt).toLocaleString()}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Status Changes</h3>
                        <p className="text-sm text-gray-900">{order.statusInfo.totalStatusChanges} changes</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Order Status</h3>
                        <p className="text-sm text-gray-900">
                          {order.statusInfo.isFirstStatus ? 'First status' : 'Status updated'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h2>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-900">
                        {(order.user as any).name || 'Customer Name'}
                      </p>
                      <p className="text-sm text-gray-900">{(order.user as any).email || 'customer@example.com'}</p>
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