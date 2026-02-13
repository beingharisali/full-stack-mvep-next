"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import ProtectedRoute from "../../../shared/ProtectedRoute";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({
    siteName: "MVEP",
    siteDescription: "A legendary marketplace for customers and vendors",
    contactEmail: "admin@example.com",
    contactPhone: "+1 (555) 123-4567",
    currency: "Gold (G)",
    timezone: "UTC",
    enableRegistration: true,
    requireEmailVerification: true,
    enableNotifications: true,
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "your-email@gmail.com",
    smtpPassword: "",
    maxusersPerOrder: 10,
    minimumGoldForTrade: 100,
    enablePVP: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving ettings:", formData);
    toast.success("settings saved successfully!");
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]} redirectPath="/">
      <div className="min-h-screen bg-[#050a14]">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold neon-text mb-6">Settings</h1>

              <div className="glass-card rounded-lg overflow-hidden">
                <div className="border-b border-gray-700">
                  <nav className="flex -mb-px">
                    {["general", "email", "security", "rules"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-all ${
                          activeTab === tab
                            ? "border-indigo-500 text-indigo-400"
                            : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                        }`}
                      >
                        {tab === "general" && "🏰 General"}
                        {tab === "email" && "📧 Mail System"}
                        {tab === "security" && "🛡️ Security"}
                        {tab === "rules" && "⚔️ rules"}
                      </button>
                    ))}
                  </nav>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                  {activeTab === "general" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg font-medium text-white">
                          General Settings
                        </h2>
                        <p className="mt-1 text-sm text-gray-400">
                          Configure the basic settings
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="siteName"
                            className="block text-sm font-medium text-gray-400 mb-1"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            id="siteName"
                            name="siteName"
                            value={formData.siteName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 gaming-input rounded-md"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="currency"
                            className="block text-sm font-medium text-gray-400 mb-1"
                          >
                            Currency
                          </label>
                          <select
                            id="currency"
                            name="currency"
                            value={formData.currency}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 gaming-input rounded-md"
                          >
                            <option value="Gold (G)">$</option>
                            <option value="Silver (S)">euro</option>
                            <option value="Copper (C)">PK rupees</option>
                            <option value="Gems">IN rupees</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label
                            htmlFor="siteDescription"
                            className="block text-sm font-medium text-gray-400 mb-1"
                          >
                            Description
                          </label>
                          <textarea
                            id="siteDescription"
                            name="siteDescription"
                            value={formData.siteDescription}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 gaming-input rounded-md"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="enableRegistration"
                              checked={formData.enableRegistration}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-indigo-600 border-gray-600 rounded focus:ring-indigo-500 bg-gray-700"
                            />
                            <span className="ml-2 text-sm text-gray-300">
                              Allow new users to join
                            </span>
                          </label>
                        </div>

                        <div className="md:col-span-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="requireEmailVerification"
                              checked={formData.requireEmailVerification}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-indigo-600 border-gray-600 rounded focus:ring-indigo-500 bg-gray-700"
                            />
                            <span className="ml-2 text-sm text-gray-300">
                              Verify useremails
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "email" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg font-medium text-white">
                          Mail System Settings
                        </h2>
                        <p className="mt-1 text-sm text-gray-400">
                          Configure mail system and notifications
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="contactEmail"
                            className="block text-sm font-medium text-gray-400 mb-1"
                          >
                            Contact Email
                          </label>
                          <input
                            type="email"
                            id="contactEmail"
                            name="contactEmail"
                            value={formData.contactEmail}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 gaming-input rounded-md"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="contactPhone"
                            className="block text-sm font-medium text-gray-400 mb-1"
                          >
                            Contact Number
                          </label>
                          <input
                            type="tel"
                            id="contactPhone"
                            name="contactPhone"
                            value={formData.contactPhone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 gaming-input rounded-md"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <h3 className="text-md font-medium text-white mb-3">
                            Mail Server Settings
                          </h3>
                        </div>

                        <div>
                          <label
                            htmlFor="smtpHost"
                            className="block text-sm font-medium text-gray-400 mb-1"
                          >
                            SMTP Host
                          </label>
                          <input
                            type="text"
                            id="smtpHost"
                            name="smtpHost"
                            value={formData.smtpHost}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 gaming-input rounded-md"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="smtpPort"
                            className="block text-sm font-medium text-gray-400 mb-1"
                          >
                            SMTP Port
                          </label>
                          <input
                            type="text"
                            id="smtpPort"
                            name="smtpPort"
                            value={formData.smtpPort}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 gaming-input rounded-md"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="smtpUser"
                            className="block text-sm font-medium text-gray-400 mb-1"
                          >
                            SMTP Username
                          </label>
                          <input
                            type="text"
                            id="smtpUser"
                            name="smtpUser"
                            value={formData.smtpUser}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 gaming-input rounded-md"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="smtpPassword"
                            className="block text-sm font-medium text-gray-400 mb-1"
                          >
                            SMTP Password
                          </label>
                          <input
                            type="password"
                            id="smtpPassword"
                            name="smtpPassword"
                            value={formData.smtpPassword}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 gaming-input rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "security" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg font-medium text-white">
                          Security Settings
                        </h2>
                        <p className="mt-1 text-sm text-gray-400">
                          Configure security settings
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="timezone"
                            className="block text-sm font-medium text-gray-400 mb-1"
                          >
                            Timezone
                          </label>
                          <select
                            id="timezone"
                            name="timezone"
                            value={formData.timezone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 gaming-input rounded-md"
                          >
                            <option value="UTC">UTC</option>
                            <option value="EST">
                              Eastern Standard Time (EST)
                            </option>
                            <option value="PST">
                              Pacific Standard Time (PST)
                            </option>
                            <option value="GMT">
                              Greenwich Mean Time (GMT)
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            Security Options
                          </label>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                name="enableNotifications"
                                checked={formData.enableNotifications}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-indigo-600 border-gray-600 rounded focus:ring-indigo-500 bg-gray-700"
                              />
                              <span className="ml-2 text-sm text-gray-300">
                                Enable security notifications
                              </span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 border-gray-600 rounded focus:ring-indigo-500 bg-gray-700"
                              />
                              <span className="ml-2 text-sm text-gray-300">
                                Require 2FA for customer
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <div className="bg-yellow-900/30 border-l-4 border-yellow-500 p-4">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <span className="text-yellow-500">⚠️</span>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm text-yellow-400">
                                  <strong>Warning:</strong> Changes to security
                                  settings may affect useraccess. Review
                                  carefully.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "rules" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg font-medium text-white">
                          rules
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="maxusersPerOrder"
                            className="block text-sm font-medium text-gray-400 mb-1"
                          >
                            Max customers per order
                          </label>
                          <input
                            type="number"
                            id="maxusersPerOrder"
                            name="maxusersPerOrder"
                            value={formData.maxusersPerOrder}
                            onChange={handleInputChange}
                            min="1"
                            max="50"
                            className="w-full px-3 py-2 gaming-input rounded-md"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="minimumGoldForTrade"
                            className="block text-sm font-medium text-gray-400 mb-1"
                          >
                            Minimum amount for purchase
                          </label>
                          <input
                            type="number"
                            id="minimumGoldForTrade"
                            name="minimumGoldForTrade"
                            value={formData.minimumGoldForTrade}
                            onChange={handleInputChange}
                            min="0"
                            className="w-full px-3 py-2 gaming-input rounded-md"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="enablePVP"
                              checked={formData.enablePVP}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-indigo-600 border-gray-600 rounded focus:ring-indigo-500 bg-gray-700"
                            />
                            <span className="ml-2 text-sm text-gray-300">
                              Enable PvP (uservs user) Trading
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2 gaming-btn text-white rounded-md transition-all"
                    >
                      💾 Save Settings
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
