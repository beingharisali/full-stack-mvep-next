import http from "./http";

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
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
  const res = await http.get("/cart");
  return res.data;
}

export async function addToCart(productId: string, quantity: number): Promise<Cart> {
  const res = await http.post("/cart", { productId, quantity });
  return res.data;
}

export async function removeFromCart(productId: string): Promise<Cart> {
  const res = await http.delete(`/cart/${productId}`);
  return res.data;
}

export async function updateCartItem(productId: string, quantity: number): Promise<Cart> {
  const res = await http.patch(`/cart/${productId}`, { productId, quantity });
  return res.data;
}

export async function clearCart(): Promise<Cart> {
  const res = await http.delete("/cart");
  return res.data;
}