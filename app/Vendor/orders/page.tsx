'use client';

import React, { useState, useEffect } from 'react';

import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ProtectedRoute from '../../../shared/ProtectedRoute';
import { getAllOrdersForAdminOrVendor, updateOrderStatus } from '../../../services/order.api';
import toast from 'react-hot-toast';

interface OrderItem {
  product: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
  subtotal: number;
}

interface Order {
  _id: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: string;
  statusHistory: {
    status: string;
    timestamp: string;
    updatedBy: string;
  }[];
  createdAt: string;
  updatedAt: string;
  statusInfo: {
    currentStatus: string;
    statusDisplay: string;
    lastUpdated: string;
    totalStatusChanges: number;
    isRecent: boolean;
    canBeCancelled: boolean;
  };
}

const VendorOrdersPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrdersForAdminOrVendor();
      setOrders(response.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      fetchOrders(); 
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error(error.response?.data?.msg || 'Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-900/50 text-yellow-400 border border-yellow-500/50';
      case 'processing': return 'bg-blue-900/50 text-blue-400 border border-blue-500/50';
      case 'shipped': return 'bg-purple-900/50 text-purple-400 border border-purple-500/50';
      case 'delivered': return 'bg-green-900/50 text-green-400 border border-green-500/50';
      case 'cancelled': return 'bg-red-900/50 text-red-400 border border-red-500/50';
      default: return 'bg-gray-800 text-gray-400 border border-gray-600';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['vendor']} redirectPath="/">
        <div className="min-h-screen bg-[#050a14]">
          <Navbar />
          <div className="flex">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <main className={`flex-1 p-4 lg:p-6 transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`}>
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['vendor']} redirectPath="/">
      <div className="min-h-screen bg-[#050a14]">
        <Navbar />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <main className={`flex-1 p-4 lg:p-6 transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`}>
            <div className="container-mobile-lg mx-auto max-w-7xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold neon-text">Orders Management</h1>
              </div>

              <div className="glass-card p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Search Orders</label>
                    <input
                      type="text"
                      placeholder="Search by customer name, email, or order ID"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 gaming-input rounded-md touch-button"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Status Filter</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 gaming-input rounded-md touch-button"
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

              <div className="glass-card rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-indigo-500/30">
                    <thead className="bg-[#1a1f2e]">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Items
                        </th>
                        <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#0f1420] divide-y divide-indigo-500/30">
                      {filteredOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-[#1a1f2e] transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-indigo-400">
                            {order._id}
                          </td>
                          <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-white">{order.user.name}</div>
                              <div className="text-sm text-gray-400">{order.user.email}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                            {order.items.length} item(s)
                          </td>
                          <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm font-medium text-indigo-400">
                            ${order.totalAmount.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                              {order.statusInfo.statusDisplay}
                            </span>
                          </td>
                          <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex flex-wrap gap-2">
                              {order.status === 'pending' && (
                                <button
                                  onClick={() => handleStatusUpdate(order._id, 'processing')}
                                  className="text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded touch-button"
                                >
                                  Process
                                </button>
                              )}
                              {order.status === 'processing' && (
                                <button
                                  onClick={() => handleStatusUpdate(order._id, 'shipped')}
                                  className="text-purple-400 hover:text-purple-300 border border-purple-500/30 px-2 py-1 rounded touch-button"
                                >
                                  Ship
                                </button>
                              )}
                              {order.status === 'shipped' && (
                                <button
                                  onClick={() => handleStatusUpdate(order._id, 'delivered')}
                                  className="text-green-400 hover:text-green-300 border border-green-500/30 px-2 py-1 rounded touch-button"
                                >
                                  Deliver
                                </button>
                              )}
                              {['pending', 'processing'].includes(order.status) && (
                                <button
                                  onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                                  className="text-red-400 hover:text-red-300 border border-red-500/30 px-2 py-1 rounded touch-button"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {filteredOrders.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-400">No orders found</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default VendorOrdersPage;