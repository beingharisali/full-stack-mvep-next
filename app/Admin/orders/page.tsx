'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/app/components/Navbar';
import Sidebar from '@/app/components/Sidebar';
import ProtectedRoute from '../../../shared/ProtectedRoute';
import { useAuth } from '../../../context/AuthContext';
import {
  getAllOrdersEnhanced,
  updateOrderStatusEnhanced,
  OrderSummary
} from '../../../services/order.api';

interface OrderDisplay {
  _id: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  products: {
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  statusHistory: any[];
  statusInfo: any;
  createdAt: string;
  updatedAt: string;
}

export default function OrdersManagementPage() {
  const { user } = useAuth();

  const [orders, setOrders] = useState<OrderDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusSummary, setStatusSummary] =
    useState<OrderSummary['statusSummary'] | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrdersEnhanced();

      const transformedOrders: OrderDisplay[] = response.orders.map(
        (order: any) => ({
          _id: order._id,
          customer: {
            firstName: order.user?.name?.split(' ')[0] || '',
            lastName: order.user?.name?.split(' ')[1] || '',
            email: order.user?.email || '',
            role: order.user?.role || 'customer'
          },
          products: order.items.map((item: any) => ({
            name: item.product?.name || '',
            quantity: item.quantity,
            price: item.product?.price || 0,
            subtotal: item.subtotal
          })),
          totalAmount: order.totalAmount,
          status: order.status,
          statusHistory: order.statusHistory,
          statusInfo: order.statusInfo,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt
        })
      );

      setOrders(transformedOrders);
      setStatusSummary(response.statusSummary);
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      const res = await updateOrderStatusEnhanced(orderId, newStatus);

      setOrders(prev =>
        prev.map(order =>
          order._id === orderId
            ? {
                ...order,
                status: res.order.status,
                statusInfo: {
                  ...order.statusInfo,
                  currentStatus: res.order.status,
                  statusDisplay: res.order.statusDisplay,
                  lastUpdated: res.order.lastUpdated
                }
              }
            : order
        )
      );

      const refreshed = await getAllOrdersEnhanced();
      setStatusSummary(refreshed.statusSummary);
    } catch (err) {
      console.error('Update status error:', err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchStatus =
      statusFilter === 'all' || order.status === statusFilter;

    const search = searchTerm.toLowerCase();
    const matchSearch =
      order._id.toLowerCase().includes(search) ||
      order.customer.firstName.toLowerCase().includes(search) ||
      order.customer.lastName.toLowerCase().includes(search) ||
      order.customer.email.toLowerCase().includes(search);

    return matchStatus && matchSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']} redirectPath="/">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />

          <main className="flex-1 p-6">
            <h1 className="text-3xl font-bold mb-6">Orders Management</h1>

            {/* Filters */}
            <div className="bg-white p-4 rounded shadow mb-6 grid md:grid-cols-3 gap-4">
              <input
                className="border px-3 py-2 rounded"
                placeholder="Search by customer / order id"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />

              <select
                className="border px-3 py-2 rounded"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <button
                onClick={fetchOrders}
                className="bg-blue-600 text-white rounded px-4 py-2"
              >
                Refresh
              </button>
            </div>

            {/* Table */}
            {loading ? (
              <p>Loading orders...</p>
            ) : (
              <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">Order</th>
                      <th className="p-3 text-left">Customer</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order._id} className="border-t">
                        <td className="p-3">#{order._id.slice(0, 8)}</td>
                        <td className="p-3">
                          {order.customer.firstName}{' '}
                          {order.customer.lastName}
                        </td>
                        <td className="p-3">${order.totalAmount}</td>
                        <td className="p-3">
                          <select
                            value={order.status}
                            disabled={updatingOrderId === order._id}
                            onChange={e =>
                              updateOrderStatus(order._id, e.target.value)
                            }
                            className={`px-2 py-1 rounded ${getStatusColor(
                              order.status
                            )}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-3">
                          {new Date(order.updatedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredOrders.length === 0 && (
                  <p className="text-center p-6 text-gray-500">
                    No orders found
                  </p>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
