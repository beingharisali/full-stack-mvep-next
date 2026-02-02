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
    if (newStatus === 'cancelled') {
      handleCancelOrder(orderId);
      return;
    }
    
    try {
      setUpdatingOrderId(orderId);
      const response = await updateOrderStatusEnhanced(orderId, newStatus);
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { 
              ...order, 
              status: response.order.status as any,
              statusInfo: {
                ...order.statusInfo,
                currentStatus: response.order.status,
                statusDisplay: response.order.statusDisplay,
                lastUpdated: response.order.lastUpdated
              }
            } 
          : order
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    
    try {
      setUpdatingOrderId(orderId);
      const response = await cancelOrder(orderId);
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { 
              ...order, 
              status: response.order.status,
              statusInfo: response.order.statusInfo
            } 
          : order
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel order');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    return statusFilter === 'all' || order.status === statusFilter;
  });

  const getStatusOptions = (order: OrderEnhanced) => {
    const baseOptions = [
      { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
      { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
      { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' }
    ];
    
    if (order.statusInfo.canBeCancelled) {
      return [...baseOptions, { value: 'cancelled', label: 'Cancel Order', color: 'bg-red-100 text-red-800' }];
    }
    
    return baseOptions;
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['customer']} redirectPath="/">
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>
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
                <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>
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

  return (
    <ProtectedRoute allowedRoles={['customer']} redirectPath="/">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>
              
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-wrap gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-500">
                    {statusFilter === 'all' 
                      ? "You haven't placed any orders yet." 
                      : `No orders with status "${statusFilter}" found.`}
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Items
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Amount
                        </th>
                        {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th> */}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order._id.substring(0, 8)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.items.length} item(s)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-1">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                                <span className="text-xs text-green-600">Recently updated</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${order.totalAmount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {/* <div className="flex flex-col space-y-2">
                              <button 
                                onClick={() => handleViewDetails(order._id)}
                                className="text-indigo-600 hover:text-indigo-900 text-left"
                              >
                                View Details
                              </button>
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                disabled={updatingOrderId === order._id}
                                className={`text-xs rounded px-2 py-1 ${
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
                                <span className="text-xs text-gray-500">Updating...</span>
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