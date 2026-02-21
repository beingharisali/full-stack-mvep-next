"use client";

import { useEffect, useState } from "react";
import {
  getVendors,
  getCustomers,
  deleteUserByAdmin,
  createUser,
  updateUser,
  getUserById,
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/services/adminAccounts.service";
import {
  FaUserTie,
  FaUser,
  FaTrash,
  FaPlus,
  FaEdit,
  FaSave,
} from "react-icons/fa";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import ProtectedRoute from "../../../shared/ProtectedRoute";
import { useAuth } from "../../../context/AuthContext";

export default function AdminAccountsPage() {
  const { user } = useAuth();
  const [vendors, setVendors] = useState<User[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "vendor" | "customer";
  }>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "vendor",
  });
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [loadingForm, setLoadingForm] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        console.log("Fetching User data...");
        const vendorData = await getVendors();
        const customerData = await getCustomers();
        setVendors(vendorData);
        setCustomers(customerData);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    }

    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "⚔️ Are you sure you want to delete this User? This action cannot be undone!",
      )
    ) {
      return;
    }

    setDeletingUserId(id);

    try {
      await deleteUserByAdmin(id);

      const [updatedVendors, updatedCustomers] = await Promise.all([
        getVendors(),
        getCustomers(),
      ]);

      setVendors(updatedVendors);
      setCustomers(updatedCustomers);

      alert("✅ User deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting account:", err);
      alert("❌ Failed to delete User. Please try again.");
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingForm(true);

    try {
      const userData: CreateUserRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      await createUser(userData);

      const [updatedVendors, updatedCustomers] = await Promise.all([
        getVendors(),
        getCustomers(),
      ]);

      setVendors(updatedVendors);
      setCustomers(updatedCustomers);

      resetForm();
      alert("🎉 New User created");
    } catch (err: any) {
      console.error("Error creating user:", err);
      alert("❌ Failed to create User. Please try again.");
    } finally {
      setLoadingForm(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setLoadingForm(true);

    try {
      const userData: UpdateUserRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role as "vendor" | "customer",
      };

      await updateUser(editingUser.id, userData);

      const [updatedVendors, updatedCustomers] = await Promise.all([
        getVendors(),
        getCustomers(),
      ]);

      setVendors(updatedVendors);
      setCustomers(updatedCustomers);

      setEditingUser(null);
      setFormMode("create");

      alert("✨ userstats updated!");
    } catch (err: any) {
      console.error("Error updating user:", err);
      alert("❌ Failed to update user. Please try again.");
    } finally {
      setLoadingForm(false);
    }
  };

  const startEditingUser = async (userId: string) => {
    try {
      const user = await getUserById(userId);
      setEditingUser(user);
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: "",
        role: user.role as "vendor" | "customer",
      });
      setFormMode("edit");
    } catch (err) {
      console.error("Error fetching user for editing:", err);
      alert("❌ Failed to fetch userdata.");
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "vendor",
    });
    setShowCreateForm(false);
    setEditingUser(null);
    setFormMode("create");
  };

  const totalVendors = vendors.length;
  const totalCustomers = customers.length;

  const renderVendorActions = (vendor: User) => {
    const hasValidId =
      vendor &&
      vendor.id &&
      typeof vendor.id === "string" &&
      vendor.id.trim() !== "";

    return (
      <div className="flex gap-2">
        {hasValidId && (
          <>
            <button
              onClick={() => startEditingUser(vendor.id)}
              className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-full transition-colors duration-200 border border-blue-500/30 hover:border-blue-500 touch-button"
              title="Edit merchant"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDelete(vendor.id)}
              disabled={deletingUserId === vendor.id}
              className={`p-2 text-red-400 hover:bg-red-500/20 rounded-full transition-colors duration-200 border border-red-500/30 hover:border-red-500 touch-button ${deletingUserId === vendor.id ? "opacity-50 cursor-not-allowed" : ""}`}
              title="Delete vendor"
            >
              <FaTrash />
            </button>
          </>
        )}
      </div>
    );
  };

  const renderCustomerActions = (customer: User) => {
    const hasValidId =
      customer &&
      customer.id &&
      typeof customer.id === "string" &&
      customer.id.trim() !== "";

    return (
      <div className="flex gap-2">
        {hasValidId && (
          <>
            <button
              onClick={() => startEditingUser(customer.id)}
              className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-full transition-colors duration-200 border border-blue-500/30 hover:border-blue-500 touch-button"
              title="Edit user"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDelete(customer.id)}
              disabled={deletingUserId === customer.id}
              className={`p-2 text-red-400 hover:bg-red-500/20 rounded-full transition-colors duration-200 border border-red-500/30 hover:border-red-500 touch-button ${deletingUserId === customer.id ? "opacity-50 cursor-not-allowed" : ""}`}
              title="Delete user"
            >
              <FaTrash />
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]} redirectPath="/">
      <div className="min-h-screen">
        <Navbar onMenuToggle={toggleSidebar} sidebarOpen={sidebarOpen} />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          
          <main className="flex-1 transition-all duration-300">
            
            <div className="w-full p-4 md:p-8">
              <div className="glass-card rounded-2xl p-6 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold neon-text flex items-center gap-3">
                      <FaUserTie className="text-indigo-400" />
                      User Management
                    </h1>
                    <p className="text-gray-400 mt-2">
                      Manage vendors and customers accounts
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
                    <div className="bg-indigo-900/30 rounded-lg px-4 py-3 border-l-4 border-indigo-500 flex-1 min-w-[150px]">
                      <p className="text-sm text-gray-400 font-medium">Vendors</p>
                      <p className="text-2xl font-bold text-indigo-400">
                        {totalVendors}
                      </p>
                    </div>
                    <div className="bg-green-900/30 rounded-lg px-4 py-3 border-l-4 border-green-500 flex-1 min-w-[150px]">
                      <p className="text-sm text-gray-400 font-medium">Customers</p>
                      <p className="text-2xl font-bold text-green-400">
                        {totalCustomers}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => {
                      setShowCreateForm(true);
                      setFormMode("create");
                      setFormData({
                        firstName: "",
                        lastName: "",
                        email: "",
                        password: "",
                        role: "vendor",
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 gaming-btn text-white rounded-lg transition-all touch-button"
                  >
                    <FaPlus />
                    👋 Invite New user
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-5 border-b border-indigo-500/30">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <FaUser className="text-xl text-indigo-400" />
                        <h2 className="text-xl font-bold">Vendors</h2>
                      </div>
                      <span className="bg-indigo-500/20 px-3 py-1 rounded-full text-sm text-indigo-400 border border-indigo-500/30">
                        {vendors.length} members
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    {vendors.length === 0 ? (
                      <div className="text-center py-10">
                        <FaUser className="mx-auto text-gray-600 text-4xl mb-3" />
                        <p className="text-gray-400">No vendors found</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {vendors.map((v, index) => (
                          <div
                            key={v?.id || `vendor-${index}`}
                            className="flex items-center justify-between p-4 bg-[#1a1f2e] rounded-lg hover:bg-indigo-900/20 transition-colors duration-200 border border-gray-700 hover:border-indigo-500/50"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-indigo-900/50 rounded-full flex items-center justify-center border border-indigo-500/50">
                                <span className="text-indigo-400 font-bold">
                                  {v.firstName?.charAt(0).toUpperCase()}
                                  {v.lastName?.charAt(0).toUpperCase() || ""}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-white">
                                  {v.firstName} {v.lastName}
                                </h3>
                                <p className="text-sm text-gray-400 flex items-center gap-1">
                                  <span>{v.email}</span>
                                </p>
                                <span className="inline-block mt-1 px-2 py-1 bg-indigo-900/50 text-indigo-400 text-xs rounded-full border border-indigo-500/30">
                                  🛡️ Vendor
                                </span>
                              </div>
                            </div>
                            {renderVendorActions(v)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 p-5 border-b border-green-500/30">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <FaUser className="text-xl text-green-400" />
                        <h2 className="text-xl font-bold">Customers</h2>
                      </div>
                      <span className="bg-green-500/20 px-3 py-1 rounded-full text-sm text-green-400 border border-green-500/30">
                        {customers.length} members
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    {customers.length === 0 ? (
                      <div className="text-center py-10">
                        <FaUser className="mx-auto text-gray-600 text-4xl mb-3" />
                        <p className="text-gray-400">No customers found</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {customers.map((c, index) => (
                          <div
                            key={c?.id || `customer-${index}`}
                            className="flex items-center justify-between p-4 bg-[#1a1f2e] rounded-lg hover:bg-green-900/20 transition-colors duration-200 border border-gray-700 hover:border-green-500/50"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center border border-green-500/50">
                                <span className="text-green-400 font-bold">
                                  {c.firstName?.charAt(0).toUpperCase()}
                                  {c.lastName?.charAt(0).toUpperCase() || ""}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-white">
                                  {c.firstName} {c.lastName}
                                </h3>
                                <p className="text-sm text-gray-400 flex items-center gap-1">
                                  <span>{c.email}</span>
                                </p>
                                <span className="inline-block mt-1 px-2 py-1 bg-green-900/50 text-green-400 text-xs rounded-full border border-green-500/30">
                                  ⚔️ Customer
                                </span>
                              </div>
                            </div>
                            {renderCustomerActions(c)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {(showCreateForm || editingUser) && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                  <div className="glass-card rounded-2xl shadow-xl w-full max-w-[90vw] md:max-w-md max-h-[90vh] overflow-y-auto border border-indigo-500/30">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold neon-text">
                          {formMode === "create"
                            ? "👋 Invite New user"
                            : "✨ Edit userStats"}
                        </h2>
                        <button
                          onClick={resetForm}
                          className="text-gray-400 hover:text-gray-300 transition-colors"
                        >
                          <FaSave size={24} />
                        </button>
                      </div>

                      <form
                        onSubmit={
                          formMode === "create" ? handleCreateUser : handleUpdateUser
                        }
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) =>
                              setFormData({ ...formData, firstName: e.target.value })
                            }
                            className="w-full px-3 py-2 gaming-input rounded-lg"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) =>
                              setFormData({ ...formData, lastName: e.target.value })
                            }
                            className="w-full px-3 py-2 gaming-input rounded-lg"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            className="w-full px-3 py-2 gaming-input rounded-lg"
                            required
                          />
                        </div>

                        {formMode === "create" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              Password
                            </label>
                            <input
                              type="password"
                              value={formData.password}
                              onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                              }
                              className="w-full px-3 py-2 gaming-input rounded-lg"
                              required
                              minLength={6}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Minimum 6 characters
                            </p>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            userClass
                          </label>
                          <select
                            value={formData.role}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                role: e.target.value as "vendor" | "customer",
                              })
                            }
                            className="w-full px-3 py-2 gaming-input rounded-lg"
                          >
                            <option value="vendor">🛡️ Vendor</option>
                            <option value="customer">⚔️ Customer</option>
                          </select>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button
                            type="button"
                            onClick={resetForm}
                            className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                            disabled={loadingForm}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="flex-1 px-4 py-2 gaming-btn text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            disabled={loadingForm}
                          >
                            {loadingForm ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                {formMode === "create"
                                  ? "Inviting..."
                                  : "Updating..."}
                              </>
                            ) : (
                              <>
                                <FaSave />
                                {formMode === "create"
                                  ? "👋 Invite user"
                                  : "✨ Update Stats"}
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}