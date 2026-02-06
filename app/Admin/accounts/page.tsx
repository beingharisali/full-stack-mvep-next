"use client"; 

import { useEffect, useState } from "react";
import { getVendors, getCustomers, deleteUserByAdmin, User } from "@/services/adminAccounts.service";
import { FaUserTie, FaUser, FaTrash, FaSearch, FaEye } from "react-icons/fa";

export default function AdminAccountsPage() {
  const [vendors, setVendors] = useState<User[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const vendorData = await getVendors();
        setVendors(vendorData);

        const customerData = await getCustomers();
        setCustomers(customerData);
      } catch (err) {
        console.error(err);
      }
    }

    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteUserByAdmin(id);
      setVendors(vendors.filter(v => v.id !== id));
      setCustomers(customers.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };


  if (vendors.length === 0 && customers.length === 0) return <p className="p-6">No accounts to display.</p>;

  const totalVendors = vendors.length;
  const totalCustomers = customers.length;

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
              <div className="bg-blue-50 rounded-lg px-4 py-3 border-l-4 border-blue-500">
                <p className="text-sm text-gray-600">Vendors</p>
                <p className="text-2xl font-bold text-blue-700">{totalVendors}</p>
              </div>
              <div className="bg-green-50 rounded-lg px-4 py-3 border-l-4 border-green-500">
                <p className="text-sm text-gray-600">Customers</p>
                <p className="text-2xl font-bold text-green-700">{totalCustomers}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <FaUser className="text-xl" />
                  <h2 className="text-xl font-bold">Vendor Accounts</h2>
                </div>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
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
                  {vendors.map(v => (
                    <div
                      key={v.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-700 font-bold">
                            {v.firstName.charAt(0).toUpperCase()}{v.lastName?.charAt(0).toUpperCase() || ''}
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
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                        title="Delete vendor"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
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
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
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
                  {customers.map(c => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-700 font-bold">
                            {c.firstName.charAt(0).toUpperCase()}{c.lastName?.charAt(0).toUpperCase() || ''}
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
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                        title="Delete customer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
