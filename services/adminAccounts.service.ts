import http from "./http"; 

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "vendor" | "customer";
}

export async function getVendors(): Promise<User[]> {
  const res = await http.get("/admin/users?role=vendor");
  return res.data;
}

export async function getCustomers(): Promise<User[]> {
  const res = await http.get("/admin/users?role=customer");
  return res.data;
}

export async function deleteUserByAdmin(id: string): Promise<{ msg: string }> {
  const res = await http.delete(`/admin/users/${id}`);
  return res.data;
}

export async function getUserById(id: string): Promise<User> {
  const res = await http.get(`/admin/users/${id}`);
  return res.data;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "vendor" | "customer";
}

export interface CreateUserResponse {
  msg: string;
  user: User & { createdAt: string };
}

export async function createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
  const res = await http.post(`/admin/users`, userData);
  return res.data;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: "vendor" | "customer";
}

export interface UpdateUserResponse {
  msg: string;
  user: User;
}

export async function updateUser(id: string, userData: UpdateUserRequest): Promise<UpdateUserResponse> {
  const res = await http.put(`/admin/users/${id}`, userData);
  return res.data;
}
