'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ProtectedRoute from '../../../shared/ProtectedRoute';
import { useAuth } from '../../../context/AuthContext'; 
import toast from 'react-hot-toast';
import { getUserOrdersEnhanced, OrderEnhanced } from '../../../services/order.api';

interface OrderItem {
  _id: string;
  product: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
}

interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  statusHistory: {
    status: string;
    timestamp: string;
    updatedBy: string;
  }[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
  statusInfo: {
    currentStatus: string;
    statusDisplay: string;
    lastUpdated: string;
    formattedLastUpdated: string;
    totalStatusChanges: number;
    isRecent: boolean;
    isFirstStatus: boolean;
    canBeCancelled: boolean;
  };
}

const OrderHistoryPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<OrderEnhanced[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useAuth(); 

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getUserOrdersEnhanced();
      const completedOrders = response.filter((order: any) => 
        ['delivered', 'cancelled'].includes(order.status)
      );
      setOrders(completedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
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

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  );

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['customer']} redirectPath="/">
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
    <ProtectedRoute allowedRoles={['customer']} redirectPath="/">
      <div className="min-h-screen bg-[#050a14]">
        <Navbar onMenuToggle={toggleSidebar} sidebarOpen={sidebarOpen} />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <main className={`flex-1 p-4 sm:p-6 transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`}>
            <div className="max-w-7xl mx-auto p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold neon-text">Order History</h1>
              </div>

              <div className="glass-card p-4 rounded-lg mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Status Filter</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 gaming-input rounded-md touch-button"
                  >
                    <option value="all">All Completed Orders</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
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
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
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
                            <div key={item._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-4">
                                <div className="flex-shrink-0 w-16 h-16 bg-indigo-900/30 rounded-md overflow-hidden border border-indigo-500/30">
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
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-white truncate">{item.name}</h4>
                                  <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <div className="text-sm font-medium text-yellow-400">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-indigo-500/30 pt-4 mt-4">
                        <div className="flex flex-col sm:flex-row justify-between gap-1">
                          <span className="text-gray-400">Total Amount:</span>
                          <span className="font-semibold text-yellow-400">${order.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between gap-1 mt-1">
                          <span className="text-gray-400">Payment Method:</span>
                          <span className="text-gray-300 capitalize">
                            {(order.paymentMethod ?? 'card').replace('-', ' ')}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between gap-1 mt-1">
                          <span className="text-gray-400">Last Updated:</span>
                          <span className="text-gray-300">{order.statusInfo.formattedLastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredOrders.length === 0 && (
                <div className="glass-card rounded-lg p-12 text-center">
                  <p className="text-gray-400">No completed orders found</p>
                  <p className="text-gray-500 text-sm mt-2">Your delivered and cancelled orders will appear here</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OrderHistoryPage;