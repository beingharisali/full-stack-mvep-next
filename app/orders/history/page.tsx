'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ProtectedRoute from '../../../shared/ProtectedRoute';
// import { getUserOrdersEnhanced } from '../../../services/order.api'; 
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
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  );

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['customer']} redirectPath="/">
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
    <ProtectedRoute allowedRoles={['customer']} redirectPath="/">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Completed Orders</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
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
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
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
                            <div key={item._id} className="flex items-center">
                              <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                                {item.images && item.images.length > 0 ? (
                                  <img 
                                    src={item.images[0]} 
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4 flex-1">
                                <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
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
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="text-gray-900 capitalize">
  {(order.paymentMethod ?? 'card').replace('-', ' ')}
</span>

                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-gray-600">Last Updated:</span>
                          <span className="text-gray-900">{order.statusInfo.formattedLastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredOrders.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <p className="text-gray-500">No completed orders found</p>
                  <p className="text-gray-400 text-sm mt-2">Your delivered and cancelled orders will appear here</p>
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