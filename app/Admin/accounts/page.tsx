"use client";

import { useEffect, useState } from "react";
import { getVendors, getCustomers, deleteUserByAdmin, createUser, updateUser, getUserById, User, CreateUserRequest, UpdateUserRequest } from "@/services/adminAccounts.service";
import { FaUserTie, FaUser, FaTrash, FaSearch, FaEye, FaPlus, FaEdit, FaSave, FaTimes } from "react-icons/fa";

export default function AdminAccountsPage() {
  const [vendors, setVendors] = useState<User[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  // Debug effect to log state changes
  useEffect(() => {
    console.log("showCreateForm state changed to:", showCreateForm);
  }, [showCreateForm]);
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
    role: "vendor"
  });
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [loadingForm, setLoadingForm] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      try {
        console.log("Fetching vendor data...");
        const vendorData = await getVendors();
        console.log("Vendor data received:", vendorData);
        console.log("Raw vendor data length:", vendorData.length);
        console.log("Vendor data sample:", vendorData.slice(0, 2));
        setVendors(vendorData);

        console.log("Fetching customer data...");
        const customerData = await getCustomers();
        console.log("Customer data received:", customerData);
        console.log("Raw customer data length:", customerData.length);
        console.log("Customer data sample:", customerData.slice(0, 2));
        setCustomers(customerData);
        
        if (vendorData.length === 0 && customerData.length === 0) {
          console.log("No users found in database");
        }
      } catch (err) {
        console.error("Error loading data:", err);
        if (err instanceof Error) {
          console.error("Error message:", err.message);
          if ('response' in err) {
            console.error("Response status:", (err as any).response?.status);
            console.error("Response data:", (err as any).response?.data);
          }
        }
      }
    }

    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this account? This action cannot be undone.")) {
      return;
    }
    
    if (!id || typeof id !== 'string' || id.trim() === '') {
      alert("Invalid user ID. Cannot delete user.");
      console.error("Invalid ID passed to handleDelete:", { id, type: typeof id });
      return;
    }
    
    setDeletingUserId(id); 
    
    try {
      await deleteUserByAdmin(id);
      
      const [updatedVendors, updatedCustomers] = await Promise.all([
        getVendors(),
        getCustomers()
      ]);
      
      setVendors(updatedVendors);
      setCustomers(updatedCustomers);
      
      alert("Account deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting account:", err);
      let errorMessage = "Failed to delete account. Please try again.";
      
      if (err.response) {
        const status = err.response.status;
        const statusText = err.response.statusText;
        const data = err.response.data;
        
        console.error(`Server responded with status ${status}:`, data);
        
        if (status === 401) {
          errorMessage = "Unauthorized. Please log in as an admin to delete accounts.";
        } else if (status === 403) {
          errorMessage = "Forbidden. You don't have permission to delete this account.";
        } else if (status === 404) {
          errorMessage = "Account not found. It may have already been deleted.";
        } else if (data && data.msg) {
          errorMessage = `Failed to delete account: ${data.msg}`;
        } else {
          errorMessage = `Failed to delete account (${status}): ${statusText}`;
        }
      } else if (err.request) {
        console.error("No response received:", err.request);
        errorMessage = "No response from server. Please check your connection.";
      } else {
        console.error("Error setting up request:", err.message);
        errorMessage = `Failed to set up delete request: ${err.message}`;
      }
      
      alert(errorMessage);
      
      try {
        const [refreshedVendors, refreshedCustomers] = await Promise.all([
          getVendors(),
          getCustomers()
        ]);
        setVendors(refreshedVendors);
        setCustomers(refreshedCustomers);
      } catch (refreshErr) {
        console.error("Error refreshing data after failed deletion:", refreshErr);
      }
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
        role: formData.role
      };
      
      await createUser(userData);
      
      const [updatedVendors, updatedCustomers] = await Promise.all([
        getVendors(),
        getCustomers()
      ]);
      
      setVendors(updatedVendors);
      setCustomers(updatedCustomers);
      
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "vendor"
      });
      setShowCreateForm(false);
      
      alert("Account created successfully!");
    } catch (err: any) {
      console.error("Error creating user:", err);
      let errorMessage = "Failed to create account. Please try again.";
      
      if (err.response?.data?.msg) {
        errorMessage = err.response.data.msg;
      }
      
      alert(errorMessage);
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
        role: formData.role as "vendor" | "customer"
      };
      
      await updateUser(editingUser.id, userData);
      
      const [updatedVendors, updatedCustomers] = await Promise.all([
        getVendors(),
        getCustomers()
      ]);
      
      setVendors(updatedVendors);
      setCustomers(updatedCustomers);
      
      setEditingUser(null);
      setFormMode('create');
      
      alert("Account updated successfully!");
    } catch (err: any) {
      console.error("Error updating user:", err);
      let errorMessage = "Failed to update account. Please try again.";
      
      if (err.response?.data?.msg) {
        errorMessage = err.response.data.msg;
      }
      
      alert(errorMessage);
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
        role: user.role as "vendor" | "customer"
      });
      setFormMode('edit');
    } catch (err) {
      console.error("Error fetching user for editing:", err);
      alert("Failed to fetch user data for editing.");
    }
  };

  const cancelEditing = () => {
    setEditingUser(null);
    setFormMode('create');
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "vendor"
    });
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "vendor"
    });
    setShowCreateForm(false);
    setEditingUser(null);
    setFormMode('create');
  };

  const totalVendors = vendors.length;
  const totalCustomers = customers.length;

  const renderVendorActions = (vendor: User) => {
    const hasValidId = vendor && vendor.id && typeof vendor.id === 'string' && vendor.id.trim() !== '' && vendor.id !== 'undefined' && vendor.id !== 'null';
    
    return (
      <div className="flex gap-2">
        {hasValidId && (
          <>
            <button
              onClick={() => startEditingUser(vendor.id)}
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors duration-200"
              title="Edit vendor"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDelete(vendor.id)}
              disabled={deletingUserId === vendor.id}
              className={`p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200 ${deletingUserId === vendor.id ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Delete vendor"
            >
              <FaTrash />
            </button>
          </>
        )}
        {/* {!hasValidId && (
          <span className="text-red-500 text-sm italic" title="Invalid ID - cannot edit/delete">No ID</span>
        )} */}
      </div>
    );
  };

  const renderCustomerActions = (customer: User) => {
    const hasValidId = customer && customer.id && typeof customer.id === 'string' && customer.id.trim() !== '' && customer.id !== 'undefined' && customer.id !== 'null';
    
    return (
      <div className="flex gap-2">
        {hasValidId && (
          <>
            <button
              onClick={() => startEditingUser(customer.id)}
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors duration-200"
              title="Edit customer"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDelete(customer.id)}
              disabled={deletingUserId === customer.id}
              className={`p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200 ${deletingUserId === customer.id ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Delete customer"
            >
              <FaTrash />
            </button>
          </>
        )}
        {/* {!hasValidId && (
          <span className="text-red-500 text-sm italic" title="Invalid ID - cannot edit/delete">No ID</span>
        )} */}
      </div>
    );
  };

  const showEmptyWarning = totalVendors === 0 && totalCustomers === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FaUserTie className="text-blue-600" />
                Accounts Management
              </h1>
              <p className="text-gray-600 mt-2">Manage vendor and customer accounts</p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="bg-blue-100 rounded-lg px-4 py-3 border-l-4 border-blue-500">
                <p className="text-sm text-gray-700 font-medium">Vendors</p>
                <p className="text-2xl font-bold text-blue-800">{totalVendors}</p>
              </div>
              <div className="bg-green-100 rounded-lg px-4 py-3 border-l-4 border-green-500">
                <p className="text-sm text-gray-700 font-medium">Customers</p>
                <p className="text-2xl font-bold text-green-800">{totalCustomers}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <button
              onClick={() => {
                console.log("Create button clicked");
                setShowCreateForm(true);
                setFormMode('create');
                // Reset form data but don't close the form
                setFormData({
                  firstName: "",
                  lastName: "",
                  email: "",
                  password: "",
                  role: "vendor"
                });
                console.log("Form should be open now");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <FaPlus />
              Create New Account
            </button>
          </div>

          {showEmptyWarning && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-center">
                <strong>No vendor or customer accounts found.</strong> Create new accounts using the button above.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <FaUser className="text-xl" />
                  <h2 className="text-xl font-bold">Vendor Accounts</h2>
                </div>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm text-gray-800">
                  {vendors.length} vendors
                </span>
              </div>
            </div>
            
            <div className="p-5">
              {vendors.length === 0 ? (
                <div className="text-center py-10">
                  <FaUser className="mx-auto text-gray-300 text-4xl mb-3" />
                  <p className="text-gray-500">No vendor accounts found</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {vendors.map((v, index) => {
                    const hasValidId = v && v.id && typeof v.id === 'string' && v.id.trim() !== '' && v.id !== 'undefined' && v.id !== 'null';
                    const key = v?.id || `vendor-${index}`;
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-700 font-bold">
                              {v.firstName?.charAt(0).toUpperCase()}{v.lastName?.charAt(0).toUpperCase() || ''}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{v.firstName} {v.lastName}</h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <span>{v.email}</span>
                            </p>
                            <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              Vendor
                            </span>
                          </div>
                        </div>
                        {renderVendorActions(v)}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-5">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <FaUser className="text-xl" />
                  <h2 className="text-xl font-bold">Customer Accounts</h2>
                </div>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm text-gray-800">
                  {customers.length} customers
                </span>
              </div>
            </div>
            
            <div className="p-5">
              {customers.length === 0 ? (
                <div className="text-center py-10">
                  <FaUser className="mx-auto text-gray-300 text-4xl mb-3" />
                  <p className="text-gray-500">No customer accounts found</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {customers.map((c, index) => {
                    const hasValidId = c && c.id && typeof c.id === 'string' && c.id.trim() !== '' && c.id !== 'undefined' && c.id !== 'null';
                    const key = c?.id || `customer-${index}`;
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-700 font-bold">
                              {c.firstName?.charAt(0).toUpperCase()}{c.lastName?.charAt(0).toUpperCase() || ''}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{c.firstName} {c.lastName}</h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <span>{c.email}</span>
                            </p>
                            <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Customer
                            </span>
                          </div>
                        </div>
                        {renderCustomerActions(c)}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {(showCreateForm || editingUser) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {formMode === 'create' ? 'Create New Account' : 'Edit Account'}</h2>
                  <button
                    onClick={editingUser ? cancelEditing : resetForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>

                <form onSubmit={formMode === 'create' ? handleCreateUser : handleUpdateUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {formMode === 'create' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        minLength={6}
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value as "vendor" | "customer"})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="vendor">Vendor</option>
                      <option value="customer">Customer</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={editingUser ? cancelEditing : resetForm}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      disabled={loadingForm}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      disabled={loadingForm}
                    >
                      {loadingForm ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          {formMode === 'create' ? 'Creating...' : 'Updating...'}
                        </>
                      ) : (
                        <>
                          <FaSave />
                          {formMode === 'create' ? 'Create Account' : 'Update Account'}
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
    </div>
  );
}