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
        <div className="min-h-screen bg-[#050a14]">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-6">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold neon-text mb-6">Order Details</h1>
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
        <div className="min-h-screen bg-[#050a14]">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-6">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold neon-text mb-6">Order Details</h1>
                <div className="bg-red-900/30 border border-red-500/30 text-red-400 px-4 py-3 rounded relative" role="alert">
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
        <div className="min-h-screen bg-[#050a14]">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-6">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold neon-text mb-6">Order Details</h1>
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-white mb-2">Order not found</h3>
                  <p className="text-gray-400">The order you're looking for doesn't exist.</p>
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
      <div className="min-h-screen bg-[#050a14]">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold neon-text mb-6">Order Details</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="glass-card p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-white">Order #{order._id.substring(0, 8)}</h2>
                      <div className="flex flex-col items-end">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                          order.status === 'delivered' 
                            ? 'bg-green-900/50 text-green-400 border-green-500/50' 
                            : order.status === 'shipped' 
                              ? 'bg-blue-900/50 text-blue-400 border-blue-500/50' 
                              : order.status === 'processing' 
                                ? 'bg-yellow-900/50 text-yellow-400 border-yellow-500/50' 
                                : order.status === 'pending'
                                  ? 'bg-gray-800 text-gray-400 border-gray-600'
                                  : 'bg-red-900/50 text-red-400 border-red-500/50'
                        }`}>
                          {order.statusInfo?.statusDisplay || order.status}
                        </span>
                        {order.statusInfo?.isRecent && (
                          <span className="text-xs text-green-400 mt-1">Recently updated</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="border border-indigo-500/30 rounded-lg divide-y divide-indigo-500/30">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="p-4 flex">
                          <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-indigo-900/30 border border-indigo-500/30">
                            {item.images && item.images.length > 0 ? (
                              <img 
                                src={item.images[0]} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-indigo-400 text-2xl">
                              
                              </div>
                            )}
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="text-sm font-medium text-white">{item.product.name}</h3>
                            <p className="text-sm text-gray-400">
                              Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                            </p>
                            {item.product.description && (
                              <p className="text-xs text-gray-500 mt-1">{item.product.description}</p>
                            )}
                          </div>
                          <div className="text-sm font-medium text-yellow-400">
                            ${item.subtotal.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-indigo-500/30 pt-4 mt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span className="text-white">Total Amount:</span>
                        <span className="text-yellow-400">${order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Status History</h2>
                    <div className="space-y-4">
                      {order.statusHistory.map((history: any, index: number) => (
                        <div key={index} className="flex items-start">
                          <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-2 ${
                            index === order.statusHistory.length - 1 
                              ? 'bg-green-500' 
                              : 'bg-gray-600'
                          }`}></div>
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between">
                              <span className={`px-2 py-1 text-xs rounded-full border ${
                                history.status === 'delivered' 
                                  ? 'bg-green-900/50 text-green-400 border-green-500/50' 
                                  : history.status === 'shipped' 
                                    ? 'bg-blue-900/50 text-blue-400 border-blue-500/50' 
                                    : history.status === 'processing' 
                                      ? 'bg-yellow-900/50 text-yellow-400 border-yellow-500/50' 
                                      : history.status === 'pending'
                                        ? 'bg-gray-800 text-gray-400 border-gray-600'
                                        : 'bg-red-900/50 text-red-400 border-red-500/50'
                              }`}>
                                {history.statusDisplay || history.status}
                              </span>
                              <span className="text-sm text-gray-400">
                                {history.formattedTimestamp || new Date(history.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              Updated by: {history.updatedBy || 'System'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="glass-card p-6 mb-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Order Information</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Order ID</h3>
                        <p className="text-sm text-white">#{order._id}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Date Placed</h3>
                        <p className="text-sm text-white">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Last Updated</h3>
                        <p className="text-sm text-white">
                          {order.statusInfo?.formattedLastUpdated || new Date(order.updatedAt).toLocaleString()}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Status Changes</h3>
                        <p className="text-sm text-white">{order.statusInfo?.totalStatusChanges || 0} changes</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Order Status</h3>
                        <p className="text-sm text-white">
                          {order.statusInfo?.isFirstStatus ? 'First status' : 'Status updated'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Customer Information</h2>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-white">
                        {(order.user as any).name || 'Customer Name'}
                      </p>
                      <p className="text-sm text-gray-400">{(order.user as any).email || 'customer@example.com'}</p>
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