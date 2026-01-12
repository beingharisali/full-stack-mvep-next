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
  productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt' | 'isActive'>
): Promise<SingleProductResponse> {
  const response = await http.post("/products", productData);
  return response.data;
}

export async function updateProduct(
  id: string,
  productData: Partial<Omit<Product, '_id' | 'createdAt' | 'updatedAt' | 'isActive'>>
): Promise<SingleProductResponse> {
  const response = await http.patch(`/products/${id}`, productData);
  return response.data;
}

export async function deleteProduct(id: string): Promise<{ msg: string }> {
  const response = await http.delete(`/products/${id}`);
  return response.data;
}