"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import ProtectedRoute from "../../../shared/ProtectedRoute";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  isActive: boolean;
}

export default function CategoriesManagementPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const mockCategories: Category[] = [
        {
          _id: "1",
          name: "⚔️ Weapons",
          description: "Swords, axes, bows and magical weapons",
          createdAt: "2023-01-15T10:30:00Z",
          isActive: true,
        },
        {
          _id: "2",
          name: "🛡️ Armor",
          description: "Protective gear for adventurers",
          createdAt: "2023-02-20T14:22:00Z",
          isActive: true,
        },
        {
          _id: "3",
          name: "🧪 Potions",
          description: "Healing and magical elixirs",
          createdAt: "2023-03-10T09:15:00Z",
          isActive: true,
        },
        {
          _id: "4",
          name: "📜 Scrolls",
          description: "Ancient magical scrolls and spells",
          createdAt: "2023-04-05T16:45:00Z",
          isActive: false,
        },
        {
          _id: "5",
          name: "💎 Artifacts",
          description: "Rare and legendary items",
          createdAt: "2023-05-12T11:30:00Z",
          isActive: true,
        },
      ];

      setCategories(mockCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch item categories");
    } finally {
      setLoading(false);
    }
  };

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

    if (editingCategory) {
      setCategories(
        categories.map((cat) =>
          cat._id === editingCategory._id ? { ...cat, ...formData } : cat,
        ),
      );
      toast.success("✨ Category updated successfully!");
    } else {
      const newCategory: Category = {
        _id: (categories.length + 1).toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      setCategories([...categories, newCategory]);
      toast.success("🎉 New category created!");
    }

    resetForm();
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      isActive: category.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("⚔️ Are you sure you want to delete this category?")) {
      setCategories(categories.filter((cat) => cat._id !== id));
      toast.success("🗑️ Category deleted!");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      isActive: true,
    });
    setEditingCategory(null);
    setShowModal(false);
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]} redirectPath="/">
      <div className="min-h-screen bg-[#050a14]">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold neon-text mb-6">
                📚 Item Categories
              </h1>

              <div className="glass-card rounded-lg p-6 mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">
                  All Categories ({categories.length})
                </h2>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 gaming-btn text-white rounded-md touch-button"
                >
                  ➕ Add New Category
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <div className="glass-card rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-[#1a1f2e]">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                        >
                          Category Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                        >
                          Created
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#0f1420] divide-y divide-gray-700">
                      {categories.map((category) => (
                        <tr
                          key={category._id}
                          className="hover:bg-[#1a1f2e] transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">
                              {category.name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-400 max-w-xs truncate">
                              {category.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${
                                category.isActive
                                  ? "bg-green-900/50 text-green-400 border border-green-500/50"
                                  : "bg-red-900/50 text-red-400 border border-red-500/50"
                              }`}
                            >
                              {category.isActive ? "✨ Active" : "💤 Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {new Date(category.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(category)}
                              className="text-indigo-400 hover:text-indigo-300 mr-3 transition-colors"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDelete(category._id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {categories.length === 0 && !loading && (
                    <div className="text-center py-12">
                      <p className="text-gray-400 text-lg">
                        No categories found
                      </p>
                      <p className="text-gray-500">
                        Create your first item category
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="glass-card rounded-lg shadow-xl w-full max-w-md border border-indigo-500/30">
              <div className="p-6">
                <h3 className="text-lg font-medium text-white mb-4">
                  {editingCategory ? "✏️ Edit Category" : "➕ Add New Category"}
                </h3>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      Category Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 gaming-input rounded-md"
                      placeholder="e.g., Weapons, Armor, Potions"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 gaming-input rounded-md"
                      placeholder="Describe this item category..."
                    />
                  </div>

                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 border-gray-600 rounded focus:ring-indigo-500 bg-gray-700"
                      />
                      <span className="ml-2 text-sm text-gray-300">Active</span>
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors touch-button"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 gaming-btn text-white rounded-md text-sm font-medium touch-button"
                    >
                      {editingCategory ? "✨ Update" : "🎉 Create"} Category
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
