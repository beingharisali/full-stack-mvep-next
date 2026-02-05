import http from "./http"; // tumhara axios instance

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "vendor" | "customer";
}

// GET Vendors
export async function getVendors(): Promise<User[]> {
  const res = await http.get("/admin/users?role=vendor");
  return res.data;
}

// GET Customers
export async function getCustomers(): Promise<User[]> {
  const res = await http.get("/admin/users?role=customer");
  return res.data;
}

// DELETE user by admin
export async function deleteUserByAdmin(id: string): Promise<{ msg: string }> {
  const res = await http.delete(`/admin/users/${id}`);
  return res.data;
}
