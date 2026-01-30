export interface OrderItem {
  product: string; 
  quantity: number;
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

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  _id?: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderEnhanced {
  _id: string;
  user: UserOrder | UserOrderFull;
  items: OrderItemEnhanced[];
  totalAmount: number;
  status: OrderStatus;
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