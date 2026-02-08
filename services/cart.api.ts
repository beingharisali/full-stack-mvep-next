import http from "./http";

export interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
    stock: number;
  };
  quantity: number;
  name: string;
  price: number;
  images?: string[];
  stock: number;
}

export interface Cart {
  _id?: string;
  user: string;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CartResponse {
  items: CartItem[];
}

export async function getCart(): Promise<Cart> {
  try {
    const res = await http.get("/cart/get");
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      return { items: [], user: "" };
    }
    throw error;
  }
}

export async function addToCart(productId: string, quantity: number): Promise<Cart> {
  const res = await http.post("/cart/add", { productId, quantity });
  return res.data;
}

export async function removeFromCart(productId: string): Promise<Cart> {
  const res = await http.delete(`/cart/remove/${productId}`);
  return res.data;
}

export async function updateCartItem(productId: string, quantity: number): Promise<Cart> {
  const res = await http.put("/cart/update", { productId, quantity });
  return res.data;
}

export async function clearCart(): Promise<Cart> {
  const res = await http.delete("/cart/delete");
  return res.data;
}