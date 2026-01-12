'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/app/components/Navbar';
import Sidebar from '@/app/components/Sidebar';
import ProtectedRoute from '../../../shared/ProtectedRoute';
import { useAuth } from '../../../context/AuthContext';
import http from '../../../services/http';

interface Order {
  _id: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export default function OrdersManagementPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
     
      const mockOrders: Order[] = [
        {
          _id: '1',
          customer: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
          products: [
            { name: 'Laptop', quantity: 1, price: 999.99 },
            { name: 'Mouse', quantity: 2, price: 29.99 }
          ],
          totalAmount: 1059.97,
          status: 'delivered',
          createdAt: '2023-05-15T10:30:00Z'
        },
        {
          _id: '2',
          customer: { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
          products: [
            { name: 'Smartphone', quantity: 1, price: 699.99 }
          ],
          totalAmount: 699.99,
          status: 'processing',
          createdAt: '2023-05-16T14:22:00Z'
        },
        {
          _id: '3',
          customer: { firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com' },
          products: [
            { name: 'Headphones', quantity: 1, price: 199.99 },
            { name: 'Charger', quantity: 1, price: 29.99 }
          ],
          totalAmount: 229.98,
          status: 'pending',
          createdAt: '2023-05-17T09:15:00Z'
        },
        {
          _id: '4',
          customer: { firstName: 'Alice', lastName: 'Williams', email: 'alice@example.com' },
          products: [
            { name: 'Tablet', quantity: 1, price: 399.99 }
          ],
          totalAmount: 399.99,
          status: 'shipped',
          createdAt: '2023-05-18T16:45:00Z'
        },
        {
          _id: '5',
          customer: { firstName: 'Charlie', lastName: 'Brown', email: 'charlie@example.com' },
          products: [
            { name: 'Keyboard', quantity: 1, price: 89.99 },
            { name: 'Monitor', quantity: 1, price: 299.99 }
          ],
          totalAmount: 389.98,
          status: 'cancelled',
          createdAt: '2023-05-19T11:30:00Z'
        }
      ];
      
      setOrders(mockOrders);
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

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
     
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']} redirectPath="/">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Orders Management</h1>
              
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search orders by customer or ID..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Export
                    </button>
                    <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                      New Order
                    </button>
                  </div>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
                          Customer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Products
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order._id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {order.customer.firstName} {order.customer.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.customer.email}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {order.products.map(p => p.name).join(', ')}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.products.length} item(s)
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${order.totalAmount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order._id, e.target.value as Order['status'])}
                              className={`px-2 py-1 text-xs rounded-full capitalize ${
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                            <button className="text-gray-600 hover:text-gray-900">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredOrders.length === 0 && !loading && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">No orders found</p>
                      <p className="text-gray-400">Try adjusting your search or filter criteria</p>
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