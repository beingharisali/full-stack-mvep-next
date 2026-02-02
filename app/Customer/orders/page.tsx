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
    return;
  };


  const filteredOrders = orders.filter(order => {
    return statusFilter === 'all' || order.status === statusFilter;
  });

  const getStatusOptions = (order: OrderEnhanced) => {
    return [{
      value: order.status,
      label: order.statusInfo.statusDisplay,
      color: order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
             order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 
             order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 
             order.status === 'pending' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
    }];
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['customer']} redirectPath="/">
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-4 sm:p-6">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">My Orders</h1>
                <div className="flex justify-center items-center h-48 sm:h-64">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
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
            <main className="flex-1 p-4 sm:p-6">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">My Orders</h1>
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded relative text-sm sm:text-base" role="alert">
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">My Orders</h1>
              
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-2 py-1.5 sm:px-3 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-500 text-sm sm:text-base px-4">
                    {statusFilter === 'all' 
                      ? "You haven't placed any orders yet." 
                      : `No orders with status "${statusFilter}" found.`}
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Items
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th> */}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                            #{order._id.substring(0, 8)}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {order.items.length} item(s)
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-1">
                              <span className={`px-1.5 sm:px-2 inline-flex text-[10px] sm:text-xs leading-4 sm:leading-5 font-semibold rounded-full ${
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
                                <span className="text-[9px] sm:text-xs text-green-600">Updated</span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            ${order.totalAmount.toFixed(2)}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                            <div className="flex flex-col space-y-1 sm:space-y-2">
                              <button 
                                onClick={() => handleViewDetails(order._id)}
                                className="text-indigo-600 hover:text-indigo-900 text-left text-xs sm:text-sm"
                              >
                                View Details
                              </button>
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                disabled={updatingOrderId === order._id}
                                className={`text-[10px] sm:text-xs rounded px-1.5 py-0.5 sm:px-2 sm:py-1 ${
                                  getStatusOptions(order).find(opt => opt.value === order.status)?.color || 'bg-gray-100 text-gray-800'
                                }`}
                              > 
                                 {getStatusOptions(order).map(option => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select> 
                              {updatingOrderId === order._id && (
                                <span className="text-[9px] sm:text-xs text-gray-500">Updating...</span>
                              )}
                            </div> */}
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