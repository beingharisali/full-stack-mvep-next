import http from "./http";

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

export interface Order {
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
  order: Order;
}

export async function createOrder(orderData: CreateOrderRequest): Promise<Order> {
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
  const res = await http.get("/order/get");
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