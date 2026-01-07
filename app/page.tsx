"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import http from "@/services/http"; 

type LoginForm = {
  email: string;
  password: string;
  role: "admin" | "vendor" | "customer";
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
    role: "customer",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await http.post("/api/v1/auth/login", form);

      if (res.data.success && res.data.user && res.data.token) {
        localStorage.setItem("token", res.data.token);

        const role = res.data.user.role;

        router.push(
          role === "admin"
            ? "/admin-dashboard"
            : role === "vendor"
            ? "/vendor-dashboard"
            : "/customer-dashboard"
        );
      } else {
        alert(res.data.message || "Login failed");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-600 to-purple-600 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Login</h1>
          <p className="text-gray-500 mt-2">Welcome back! Please login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 outline-none"
            >
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-indigo-600 font-medium cursor-pointer hover:underline"
          >
            Signup
          </span>
        </p>
      </div>
    </section>
  );
}
