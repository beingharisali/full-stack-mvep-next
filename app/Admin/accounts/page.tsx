"use client"; // <<< Add this line at the very top

import { useEffect, useState } from "react";
import { getVendors, getCustomers, deleteUserByAdmin, User } from "@/services/adminAccounts.service";

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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Accounts Management</h1>

      {/* Vendors */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Vendor Accounts</h2>

        {vendors.map(v => (
          <div
            key={v.id}
            className="flex justify-between items-center bg-white p-3 rounded shadow mb-2"
          >
            <div>
              <p className="font-medium">{v.firstName}</p>
              <p className="text-sm text-gray-600">{v.email}</p>
            </div>
            <button
              onClick={() => handleDelete(v.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </section>

      {/* Customers */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Customer Accounts</h2>

        {customers.map(c => (
          <div
            key={c.id}
            className="flex justify-between items-center bg-white p-3 rounded shadow mb-2"
          >
            <div>
              <p className="font-medium">{c.firstName}</p>
              <p className="text-sm text-gray-600">{c.email}</p>
            </div>
            <button
              onClick={() => handleDelete(c.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
