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
