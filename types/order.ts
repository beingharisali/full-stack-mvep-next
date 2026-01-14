export interface OrderItem {
  product: string; 
  quantity: number;
}

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered";

export interface Order {
  _id?: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
}

