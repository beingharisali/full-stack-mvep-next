import http from "./http";
import { Order } from "../types/order";

export interface OrderItem {
  _id?: string;
  product: string;
  name: string;
  price: number;
  quantity: number;
  images?: string[];
}

export interface ShippingAddress {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderResponse {
  _id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  status: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod?: string;
  transactionId?: string;
}

export interface CreateOrderResponse {
  order: OrderResponse;
}

export interface UpdateOrderStatusRequest {
  status: string;
}

export interface OrderItemEnhanced {
  product: {
    id: string;
    name: string;
    price: number;
    description?: string;
  };
  quantity: number;
  subtotal: number;
}

export interface StatusHistory {
  status: string;
  timestamp: string;
  updatedBy: string;
  statusDisplay?: string;
  formattedTimestamp?: string;
}

export interface StatusInfo {
  currentStatus: string;
  statusDisplay: string;
  lastUpdated: string;
  formattedLastUpdated?: string;
  totalStatusChanges: number;
  isRecent: boolean;
  isFirstStatus: boolean;
  canBeCancelled: boolean;
}

export interface UserOrder {
  id: string;
  name: string;
  email: string;
}

export interface UserOrderFull {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface OrderEnhanced {
  _id: string;
  user: UserOrder | UserOrderFull;
  items: OrderItemEnhanced[];
  totalAmount: number;
  status: string;
  statusHistory: StatusHistory[];
  statusInfo: StatusInfo;
  createdAt: string;
  updatedAt: string;
}

export interface OrderSummary {
  orders: OrderEnhanced[];
  totalCount: number;
  statusSummary: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    total: number;
  };
}

export async function createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
  const res = await http.post("/order/create", orderData);
  return res.data;
}

export async function getUserOrders(): Promise<Order[]> {
  const res = await http.get("/order/get");
  return res.data;
}

export async function getOrderById(orderId: string): Promise<Order> {
  const res = await http.get(`/order/single/${orderId}`);
  return res.data;
}

export async function getAllOrders(): Promise<Order[]> {
  const res = await http.get("/order/get-all");
  return res.data;
}

export async function updateOrderStatus(orderId: string, status: string): Promise<Order> {
  const res = await http.put(`/order/update/${orderId}`, { status });
  return res.data;
}

export async function deleteOrder(orderId: string): Promise<Order> {
  const res = await http.delete(`/order/delete/${orderId}`);
  return res.data;
}

export async function getUserOrdersEnhanced(): Promise<OrderEnhanced[]> {
  const res = await http.get("/order/get");
  return res.data;
}

export async function getAllOrdersEnhanced(): Promise<OrderSummary> {
  const res = await http.get("/order/get-all");
  return res.data;
}

export async function getSingleOrderEnhanced(orderId: string): Promise<OrderEnhanced> {
  const res = await http.get(`/order/single/${orderId}`);
  return res.data;
}

export async function updateOrderStatusEnhanced(
  orderId: string, 
  status: string
): Promise<{ msg: string; order: { _id: string; status: string; statusDisplay: string; lastUpdated: string; statusHistory: any[] } }> {
  const res = await http.put(`/order/update-status/${orderId}`, { status });
  return res.data;
}

export async function cancelOrder(orderId: string): Promise<{ msg: string; order: OrderEnhanced }> {
  const res = await http.put(`/order/update-status/${orderId}`, { status: 'cancelled' });
  return res.data;
}