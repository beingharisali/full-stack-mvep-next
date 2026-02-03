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
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <main className={`flex-1 p-4 lg:p-6 transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`}>
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['vendor']} redirectPath="/">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <main className={`flex-1 p-4 lg:p-6 transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`}>
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Order History</h1>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search Orders</label>
                    <input
                      type="text"
                      placeholder="Search by customer name, email, or order ID"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">Order #{order._id}</h2>
                          <p className="text-sm text-gray-500">
                            Placed on {new Date(order.createdAt).toLocaleDateString()} by {order.user.name} ({order.user.email})
                          </p>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.statusInfo.statusDisplay}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-md font-medium text-gray-900 mb-3">Items</h3>
                        <div className="space-y-3">
                          {order.items.map((item: any) => (
                            <div key={item.product.id} className="flex items-center">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900">{item.product.name}</h4>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-gray-600">Customer:</span>
                          <span className="text-gray-900">{order.user.name}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="text-gray-900 capitalize">{order.paymentMethod || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-gray-600">Last Updated:</span>
                          <span className="text-gray-900">{new Date(order.updatedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredOrders.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <p className="text-gray-500">No order history found</p>
                  <p className="text-gray-400 text-sm mt-2">Completed orders (delivered/cancelled) containing your products will appear here</p>
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