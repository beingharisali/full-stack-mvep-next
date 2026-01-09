"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/services/auth.api";

interface RegisterResponse {
  // success: boolean;
  message?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "admin" | "vendor" | "customer";
  };
  token?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "customer",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res: RegisterResponse = await register(
        form.firstName,
        form.lastName,
        form.email,
        form.password,
        form.role
      );

      if (res.user && res.token) {
        localStorage.setItem("token", res.token);

        const role = res.user.role;
alert(res.message ?? "Signup successful!");
        router.push(
          role === "admin"
            ? "/Admin-dashboard"
            : role === "vendor"
            ? "/Vendor/dashboard"
            : "/Customer-dashboard"
        );
      } else {
        alert(res.message ?? "Signup failed!");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-700 via-purple-600 to-pink-600 px-4">
      <div className="relative bg-white/90 backdrop-blur-xl w-full max-w-lg rounded-3xl p-8 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.35)] border border-white/30">
        <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-xl -z-10" />

        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Create Account
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-sm text-gray-700 font-medium">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={form.firstName}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 rounded-xl bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:bg-white outline-none transition"
              />
            </div>

            <div className="w-1/2">
              <label className="text-sm text-gray-700 font-medium">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={form.lastName}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 rounded-xl bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:bg-white outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 rounded-xl bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:bg-white outline-none transition"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium">Password</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 rounded-xl bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:bg-white outline-none transition"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 rounded-xl bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none transition"
            >
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-indigo-500/50 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/")}
            className="text-indigo-600 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </section>
  );
}
