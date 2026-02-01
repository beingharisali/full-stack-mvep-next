"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

type LoginForm = {
  email: string;
  password: string;
  role: "admin" | "vendor" | "customer";
};

export default function LoginPage() {
  const router = useRouter();
  const { login, loading: loginLoading, isAuthenticated, user, loading: authLoading } = useAuth();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
    role: "customer",
  });

  useEffect(() => {
    if (isAuthenticated() && user) {
      router.push(
        user.role === "admin"
          ? "/Admin/dashboard"
          : user.role === "vendor"
          ? "/Vendor/dashboard"
          : "/Customer/dashboard"
      );
    }
  }, [isAuthenticated, user, router]);

  if (authLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 px-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </section>
    );
  }

  if (isAuthenticated() && user) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 px-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </section>
    );
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await login(form.email, form.password, form.role);
      
      toast.success("Login successful");

      router.push(
        form.role === "admin"
          ? "/Admin/dashboard"
          : form.role === "vendor"
          ? "/Vendor/dashboard"
          : "/Customer/dashboard"
      );
    } catch (err: any) {
      toast.error(err || "Something went wrong!");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Login</h1>
          <p className="text-gray-500 mt-2">Welcome back! Please login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 md:py-3 rounded-lg bg-gray-100 border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="w-full mt-1 px-4 py-2 md:py-3 rounded-lg bg-gray-100 border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 md:py-3 rounded-lg bg-gray-100 border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full bg-indigo-600 text-white py-2 md:py-3 rounded-lg font-semibold disabled:opacity-50 hover:bg-indigo-700 transition-colors"
          >
            {loginLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <span
            onClick={() => router.push("/Signup")}
            className="text-indigo-600 font-medium cursor-pointer hover:underline"
          >
            Signup
          </span>
        </p>
      </div>
    </section>
  );
}