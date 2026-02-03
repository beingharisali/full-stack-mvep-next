'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/app/components/Navbar';
import Sidebar from '@/app/components/Sidebar';
import ProtectedRoute from '../../../shared/ProtectedRoute';
import { useAuth } from '../../../context/AuthContext';
import { getVendorOrders, getAllOrdersForAdminOrVendor, updateOrderStatusEnhanced, OrderEnhanced } from '../../../services/order.api';

interface OrderDisplay {
  _id: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  products: Array<{
    _id: string;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  statusHistory: any[];
  statusInfo: any;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export default function VendorOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const response = await getAllOrdersForAdminOrVendor();
      
      const transformedOrders: OrderDisplay[] = response.orders.map(order => ({
        _id: order._id,
        customer: {
          firstName: order.user.name.split(' ')[0] || '',
          lastName: order.user.name.split(' ')[1] || '',
          email: order.user.email
        },
        products: order.items.map(item => ({
          _id: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          subtotal: item.subtotal
        })),
        totalAmount: order.totalAmount,
        status: order.status as any,
        statusHistory: order.statusHistory,
        statusInfo: order.statusInfo,
        paymentMethod: order.paymentMethod,
        transactionId: order.transactionId,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }));
      
      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = 
      order.customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
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
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute allowedRoles={['vendor']} redirectPath="/">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Orders Containing My Products</h1>
              
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search orders..."
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={fetchOrders}
                      className="flex-1 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Refresh
                    </button>
                    <button className="flex-1 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-green-600 text-white rounded-md hover:bg-green-700">
                      Export
                    </button>
                  </div>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-48 sm:h-64">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Products
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Updated
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-right text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                            #{order._id.substring(0, 8)}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="text-xs sm:text-sm font-medium text-gray-900">
                              {order.customer.firstName} {order.customer.lastName}
                            </div>
                            <div className="text-[10px] sm:text-xs text-gray-500">
                              {order.customer.email}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <div className="text-xs sm:text-sm text-gray-900 max-w-[120px] sm:max-w-none truncate">
                              {order.products.map(p => p.name).join(', ')}
                            </div>
                            <div className="text-[10px] sm:text-xs text-gray-500">
                              {order.products.length} item(s)
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                            ${order.totalAmount.toFixed(2)}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-1">
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                disabled={updatingOrderId === order._id}
                                className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs rounded-full capitalize ${getStatusColor(order.status)}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                              {order.statusInfo?.isRecent && (
                                <span className="text-[9px] sm:text-xs text-green-600">Updated</span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-1">
                              <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs rounded-full capitalize ${
                                order.paymentMethod === 'stripe' ? 'bg-blue-100 text-blue-800' :
                                order.paymentMethod === 'braintree' ? 'bg-purple-100 text-purple-800' :
                                order.paymentMethod === 'paypal' ? 'bg-indigo-100 text-indigo-800' :
                                order.paymentMethod === 'cash-on-delivery' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
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
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-[10px] sm:text-xs text-gray-500">
                            {new Date(order.updatedAt).toLocaleDateString()}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-2 sm:mr-3">View</button>
                            <button className="text-gray-600 hover:text-gray-900">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredOrders.length === 0 && !loading && (
                    <div className="text-center py-8 sm:py-12">
                      <p className="text-gray-500 text-base sm:text-lg">No orders found</p>
                      <p className="text-gray-400 text-sm sm:text-base px-4">No customers have purchased your products yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}