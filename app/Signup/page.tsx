"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

interface RegisterResponse {
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
  const { register, user, loading, isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
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
            : "/Customer/dashboard",
      );
    }
  }, [isAuthenticated, user, router]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await register(
        form.firstName,
        form.lastName,
        form.email,
        form.password,
        form.role,
      );

      if (user) {
        toast.success("✨ Character created successfully!");
        router.push(
          user.role === "admin"
            ? "/Admin/dashboard"
            : user.role === "vendor"
              ? "/Vendor/dashboard"
              : "/Customer/dashboard",
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(`❌ ${err.message}`);
      } else {
        toast.error("❌ Failed to create User!");
      }
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-2 sm:px-4 py-6 sm:py-8 relative overflow-hidden container-mobile-xs sm:container-mobile-sm md:container-mobile-md lg:container-mobile-lg xl:container-tablet 2xl:container-desktop">
      <div className="relative glass-card w-full max-w-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.3)] container-mobile-xs sm:container-mobile-sm md:container-mobile-md lg:container-mobile-lg xl:container-tablet">
        <div className="absolute -inset-1 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-20 blur-xl -z-10 animate-pulse" />

        <div className="absolute -top-4 -left-4 w-8 h-8 bg-indigo-500 rounded-full blur-md opacity-50 animate-ping"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-purple-500 rounded-full blur-md opacity-50 animate-ping delay-1000"></div>

        <div className="text-center mb-4 sm:mb-6 md:mb-8 relative">
          <div className="flex justify-center mb-2">
            <span className="text-4xl animate-bounce"></span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold neon-text">
            Create Your Account
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-2">Begin your journey</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-3 sm:space-y-4 md:space-y-5"
        >
          <div className="flex flex-col gap-3 sm:gap-4">
            <div>
              <label className="text-xs sm:text-sm md:text-base text-gray-400 font-medium flex items-center gap-1">
                <span>👤</span> First Name
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={form.firstName}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 text-sm sm:text-base rounded-xl gaming-input transition touch-button"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm md:text-base text-gray-400 font-medium flex items-center gap-1">
                <span>👤</span> Last Name
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={form.lastName}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 text-sm sm:text-base rounded-xl gaming-input transition touch-button"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div>
            <label className="text-xs sm:text-sm md:text-base text-gray-400 font-medium flex items-center gap-1">
              <span>📧</span> Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 text-sm sm:text-base rounded-xl gaming-input transition touch-button"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="text-xs sm:text-sm md:text-base text-gray-400 font-medium flex items-center gap-1">
              <span>🔑</span> Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 text-sm sm:text-base rounded-xl gaming-input transition touch-button"
              placeholder="••••••••"
            />
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Minimum 6 characters (stronger password = better defense!)
            </p>
          </div>

          <div>
            <label className="text-xs sm:text-sm md:text-base text-gray-400 font-medium flex items-center gap-1">
              <span>⚔️</span> UserRole
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 text-sm sm:text-base rounded-xl gaming-input transition touch-button"
            >
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="bg-indigo-900/30 p-3 rounded-lg border border-indigo-500/30 text-xs">
            <p className="text-gray-400 text-sm sm:text-base">
              {form.role === "customer" &&
                "Buy the products you need or you want"}
              {form.role === "vendor" && "Make your own brand and sell"}
              {form.role === "admin" && "Have a control over everything"}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 gaming-btn text-white py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base relative overflow-hidden group touch-button"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating Account...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>⚔️</span>
                Create Account
                <span>✨</span>
              </span>
            )}
          </button>
        </form>

        <p className="text-center text-sm sm:text-base text-gray-400 mt-6">
          Already have a Account?{" "}
          <span
            onClick={() => router.push("/")}
            className="text-indigo-400 font-semibold cursor-pointer hover:text-indigo-300 transition-colors hover:underline touch-button"
          >
            Login Here
          </span>
        </p>
      </div>
    </section>
  );
}
