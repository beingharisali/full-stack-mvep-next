"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import ProtectedRoute from "../../shared/ProtectedRoute";
import { Product, getProducts } from "../../services/product.api";
import ProductCard from "../components/ProductCard";


export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("-createdAt");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const itemsPerPage = 8;

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
    fetchProducts();
  }, [currentPage, searchTerm, categoryFilter, priceRange, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
        isActive: true, 
      };

      if (searchTerm) params.name = searchTerm;
      if (categoryFilter) params.category = categoryFilter;
      if (priceRange.min) params.minPrice = priceRange.min;
      if (priceRange.max) params.maxPrice = priceRange.max;
      
      if (sortBy) {
        params.sort = sortBy.startsWith('-') ? sortBy : `-${sortBy}`; 
      } else {
        params.sort = '-createdAt';
      }

      const res = await getProducts(params);
      setProducts(res.products);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["customer", "vendor", "admin"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          
          <main className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-0' : ''
          } ${window.innerWidth < 1024 ? 'ml-0' : ''}`}>
            <div className="max-w-7xl mx-auto p-4 lg:p-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-6">Products</h1>

              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Search
                    </label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search products..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={categoryFilter}
                      onChange={(e) => {
                        setCategoryFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Filter by category..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Min Price
                      </label>
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => {
                          setPriceRange({...priceRange, min: e.target.value});
                          setCurrentPage(1);
                        }}
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Price
                      </label>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => {
                          setPriceRange({...priceRange, max: e.target.value});
                          setCurrentPage(1);
                        }}
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setCategoryFilter("");
                        setPriceRange({min: "", max: ""});
                        setSortBy("-createdAt");
                        setCurrentPage(1);
                      }}
                      className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="-createdAt">Newest First</option>
                      <option value="createdAt">Oldest First</option>
                      <option value="name">Name A-Z</option>
                      <option value="-name">Name Z-A</option>
                      <option value="price">Price Low-High</option>
                      <option value="-price">Price High-Low</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSortBy("-createdAt");
                        setCurrentPage(1);
                      }}
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Reset Sorting
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {products.map((p) => (
                      <ProductCard key={p._id} product={p} />
                    ))}
                  </div>

                  {products.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">No products found</p>
                      <p className="text-gray-400">Try adjusting your search criteria</p>
                    </div>
                  )}

                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-2 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-2 rounded-md ${
                                currentPage === pageNum 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}