'use client';

import React, { useState, useEffect } from 'react';

import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import ProtectedRoute from '../../../../shared/ProtectedRoute';
import { getAllOrdersForAdminOrVendor } from '../../../../services/order.api';
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

const VendorOrderHistoryPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('delivered,cancelled'); 
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrdersForAdminOrVendor();
      const completedOrders = response.orders.filter((order: any) => 
        ['delivered', 'cancelled'].includes(order.status)
      );
      setOrders(completedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch order history');
    } finally {
      setLoading(false);
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
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter.includes(',') ? 
        statusFilter.split(',').some(s => s.trim() === order.status) : 
        order.status === statusFilter);
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
                <h1 className="text-2xl sm:text-3xl font-bold neon-text">Order History</h1>
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
                      <option value="delivered,cancelled">Completed Orders</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="all">All Statuses</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="glass-card rounded-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                        <div>
                          <h2 className="text-lg font-semibold text-white">Order #{order._id}</h2>
                          <p className="text-sm text-gray-400">
                            Placed on {new Date(order.createdAt).toLocaleDateString()} by {order.user.name} ({order.user.email})
                          </p>
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.statusInfo.statusDisplay}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-indigo-500/30 pt-4">
                        <h3 className="text-md font-medium text-white mb-3">Items</h3>
                        <div className="space-y-3">
                          {order.items.map((item: any) => (
                            <div key={item.product.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-white">{item.product.name}</h4>
                                <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                              </div>
                              <div className="text-sm font-medium text-indigo-400">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-indigo-500/30 pt-4 mt-4">
                        <div className="flex flex-col sm:flex-row justify-between gap-1">
                          <span className="text-gray-400">Total Amount:</span>
                          <span className="font-semibold text-white">${order.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between gap-1 mt-1">
                          <span className="text-gray-400">Customer:</span>
                          <span className="text-white">{order.user.name}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between gap-1 mt-1">
                          <span className="text-gray-400">Payment Method:</span>
                          <span className="text-white capitalize">{order.paymentMethod || 'N/A'}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between gap-1 mt-1">
                          <span className="text-gray-400">Last Updated:</span>
                          <span className="text-white">{new Date(order.updatedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredOrders.length === 0 && (
                <div className="glass-card rounded-lg p-12 text-center">
                  <p className="text-gray-400">No order history found</p>
                  <p className="text-gray-500 text-sm mt-2">Completed orders (delivered/cancelled) containing your products will appear here</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default VendorOrderHistoryPage;