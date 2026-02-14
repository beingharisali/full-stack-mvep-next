'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ProtectedRoute from '../../../shared/ProtectedRoute';
import { getUserOrdersEnhanced, OrderEnhanced, updateOrderStatusEnhanced, cancelOrder } from '../../../services/order.api';

const OrdersPage: React.FC = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderEnhanced[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getUserOrdersEnhanced();
        setOrders(ordersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleViewDetails = (orderId: string) => {
    router.push(`/Customer/orders/${orderId}`);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setError('Only admins and vendors can change order status');
    setTimeout(() => setError(null), 3000); 
    return;
  };

  const filteredOrders = orders.filter(order => {
    return statusFilter === 'all' || order.status === statusFilter;
  });

  const getStatusOptions = (order: OrderEnhanced) => {
    return [{
      value: order.status,
      label: order.statusInfo?.statusDisplay || order.status,
      color: order.status === 'delivered' ? 'bg-green-900/50 text-green-400 border border-green-500/50' : 
             order.status === 'shipped' ? 'bg-blue-900/50 text-blue-400 border border-blue-500/50' : 
             order.status === 'processing' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-500/50' : 
             order.status === 'pending' ? 'bg-gray-800 text-gray-400 border border-gray-600' : 'bg-red-900/50 text-red-400 border border-red-500/50'
    }];
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['customer']} redirectPath="/">
        <div className="min-h-screen bg-[#050a14]">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-4 lg:p-6">
              <div className="container-mobile-lg mx-auto max-w-7xl">
                <h1 className="text-2xl sm:text-3xl font-bold neon-text mb-4 sm:mb-6">My Orders</h1>
                <div className="flex justify-center items-center h-48 sm:h-64">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
            <main className="flex-1 p-4 lg:p-6">
              <div className="container-mobile-lg mx-auto max-w-7xl">
                <h1 className="text-2xl sm:text-3xl font-bold neon-text mb-4 sm:mb-6">My Orders</h1>
                <div className="bg-red-900/30 border border-red-500/30 text-red-400 px-3 py-2 sm:px-4 sm:py-3 rounded relative text-sm sm:text-base" role="alert">
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

  return (
    <ProtectedRoute allowedRoles={['customer']} redirectPath="/">
      <div className="min-h-screen bg-[#050a14]">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6">
            <div className="container-mobile-lg mx-auto max-w-7xl">
              <h1 className="text-2xl sm:text-3xl font-bold neon-text mb-4 sm:mb-6">My Orders</h1>
              
              <div className="glass-card p-4 mb-6">
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Filter by Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-2 py-1.5 sm:px-3 sm:py-2 text-sm sm:text-base gaming-input rounded-md touch-button"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {filteredOrders.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <h3 className="text-base sm:text-lg font-medium text-white mb-2">No orders found</h3>
                  <p className="text-gray-400 text-sm sm:text-base px-4">
                    {statusFilter === 'all' 
                      ? "You haven't placed any orders yet." 
                      : `No orders with status "${statusFilter}" found.`}
                  </p>
                </div>
              ) : (
                <div className="glass-card rounded-lg overflow-x-auto">
                  <table className="min-w-full divide-y divide-indigo-500/30">
                    <thead className="bg-[#1a1f2e]">
                      <tr>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Items
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Payment
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Total
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#0f1420] divide-y divide-indigo-500/30">
                      {filteredOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-[#1a1f2e] transition-colors">
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-indigo-400">
                            #{order._id.substring(0, 8)}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-400">
                            {order.items.length} item(s)
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-1">
                              <span className={`px-1.5 sm:px-2 inline-flex text-[10px] sm:text-xs leading-4 sm:leading-5 font-semibold rounded-full ${
                                order.status === 'delivered' 
                                  ? 'bg-green-900/50 text-green-400 border border-green-500/50' 
                                  : order.status === 'shipped' 
                                    ? 'bg-blue-900/50 text-blue-400 border border-blue-500/50' 
                                    : order.status === 'processing' 
                                      ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-500/50' 
                                      : order.status === 'pending'
                                        ? 'bg-gray-800 text-gray-400 border border-gray-600'
                                        : 'bg-red-900/50 text-red-400 border border-red-500/50'
                              }`}>
                                {order.statusInfo?.statusDisplay || order.status}
                              </span>
                              {order.statusInfo?.isRecent && (
                                <span className="text-[9px] sm:text-xs text-green-400">Updated</span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-1">
                              <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs rounded-full capitalize border ${
                                order.paymentMethod === 'stripe' ? 'bg-blue-900/50 text-blue-400 border-blue-500/50' :
                                order.paymentMethod === 'braintree' ? 'bg-purple-900/50 text-purple-400 border-purple-500/50' :
                                order.paymentMethod === 'paypal' ? 'bg-indigo-900/50 text-indigo-400 border-indigo-500/50' :
                                order.paymentMethod === 'cash-on-delivery' ? 'bg-yellow-900/50 text-yellow-400 border-yellow-500/50' :
                                'bg-gray-800 text-gray-400 border-gray-600'
                              }`}>
                                {order.paymentMethod?.replace('-', ' ') || 'N/A'}
                              </span>
                              {order.transactionId && (
                                <span className="text-[9px] sm:text-xs text-gray-500 truncate max-w-[80px]">
                                  TXN: {order.transactionId.substring(0, 8)}...
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-yellow-400">
                            ${order.totalAmount.toFixed(2)}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                            <div className="flex flex-col space-y-1 sm:space-y-2">
                              <button 
                                onClick={() => handleViewDetails(order._id)}
                                className="text-indigo-400 hover:text-indigo-300 text-left text-xs sm:text-sm transition-colors touch-button"
                              >
                                View Details
                              </button>
                              <span className={`text-[10px] sm:text-xs rounded px-1.5 py-0.5 sm:px-2 sm:py-1 border ${
                                getStatusOptions(order).find(opt => opt.value === order.status)?.color || 'bg-gray-800 text-gray-400 border-gray-600'
                              }`}>
                                {order.statusInfo?.statusDisplay || order.status}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OrdersPage;