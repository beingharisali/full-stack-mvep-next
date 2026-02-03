import http from "./http";
import { User } from "../types/user";

export interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  images?: string[];
  description?: string;
  category?: string;
  brand?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  products: Product[];
  nbHits: number;
  totalProducts: number;
  totalPages: number;
  currentPage: number;
}

export interface SingleProductResponse {
  product: Product;
}

export async function getProducts(
  params?: {
    name?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    fields?: string;
    numericFilters?: string;
    page?: number;
    limit?: number;
    isActive?: boolean; 
  }
): Promise<ProductListResponse> {
  const response = await http.get("/products", { params });
  return response.data;
}

export async function getProductById(id: string): Promise<SingleProductResponse> {
  const response = await http.get(`/products/${id}`);
  return response.data;
}

export async function createProduct(
  productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt' | 'isActive'>,
  isAdmin = false
): Promise<SingleProductResponse> {
  const url = isAdmin ? "/admin/products" : "/products";
  const response = await http.post(url, productData);
  return response.data;
}

export async function updateProduct(
  id: string,
  productData: Partial<Omit<Product, '_id' | 'createdAt' | 'updatedAt' | 'isActive'>>,
  isAdmin = false
): Promise<SingleProductResponse> {
  const url = isAdmin ? `/admin/products/${id}` : `/products/${id}`;
  const response = await http.patch(url, productData);
  return response.data;
}

export async function deleteProduct(id: string, isAdmin = false): Promise<{ msg: string }> {
  const url = isAdmin ? `/admin/products/${id}` : `/products/${id}`;
  const response = await http.delete(url);
  return response.data;
}