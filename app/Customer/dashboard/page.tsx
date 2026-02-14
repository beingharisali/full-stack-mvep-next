'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ProtectedRoute from '../../../shared/ProtectedRoute';
import ProductCard from '../../components/ProductCard';
import { Product, getProducts, ProductListResponse } from '../../../services/product.api';
import toast from 'react-hot-toast';

const CustomerDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('-createdAt'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  }; 
  const router = useRouter();

  const itemsPerPage = 8; 

  useEffect(() => {
    if (typeof window !== 'undefined') {
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
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [currentPage, searchTerm, categoryFilter, priceRange]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const params: any = {
        limit: itemsPerPage,
        page: currentPage,
      };

      if (searchTerm) params.name = searchTerm;
      if (categoryFilter) params.category = categoryFilter;
      if (priceRange.min) {
        const minPrice = parseFloat(priceRange.min);
        if (!isNaN(minPrice) && minPrice >= 0) {
          params.minPrice = minPrice;
        }
      }
      if (priceRange.max) {
        const maxPrice = parseFloat(priceRange.max);
        if (!isNaN(maxPrice) && maxPrice >= 0) {
          params.maxPrice = maxPrice;
        }
      }
      
      if (sortBy) {
        params.sort = sortBy;
      } else {
        params.sort = '-createdAt';
      }

      const response: ProductListResponse = await getProducts(params);
      setProducts(response.products);
      setTotalPages(response.totalPages);
      setTotalProducts(response.totalProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getProducts({ limit: 100 });
      const uniqueCategories = Array.from(new Set(response.products.map(p => p.category).filter(Boolean))) as string[];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddToCart = (product: Product) => {
    toast.success(`${product.name} added to cart!`);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setPriceRange({ min: '', max: '' });
    setCurrentPage(1); 
  };

  return (
    <ProtectedRoute allowedRoles={['customer']} redirectPath="/">
      <div className="min-h-screen bg-[#050a14]">
        <Navbar onMenuToggle={toggleSidebar}/>
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} onToggle={toggleSidebar} />
          <main className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-0' : ''
          } ${typeof window !== 'undefined' && window.innerWidth < 1024 ? 'ml-0' : ''}`}>
            <div className="max-w-7xl mx-auto p-4 lg:p-6">
              <h1 className="text-2xl sm:text-3xl font-bold neon-text mb-2">Welcome Back!</h1>
              <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">Discover our latest products and deals</p>
              
              <div className="mb-6 sm:mb-8">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      if (e.target.value.trim() !== '') {
                        router.push(`/Customer/products?search=${encodeURIComponent(e.target.value)}`);
                      } else if (activeTab === 'all') {
                        setCurrentPage(1);
                      }
                    }}
                    placeholder="Search products..."
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 pl-10 sm:pl-12 gaming-input rounded-lg text-base sm:text-lg"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
                <div className="glass-card rounded-lg p-4 sm:p-6 hover:scale-105 transition-all duration-300">
                  <h2 className="text-lg sm:text-xl font-semibold text-indigo-400 mb-2">My Orders</h2>
                  <p className="text-gray-400 text-sm sm:text-base">Track your recent orders</p>
                  <button 
                    onClick={() => router.push('/Customer/orders')}
                    className="mt-4 px-3 sm:px-4 py-2 gaming-btn text-white rounded-md text-sm sm:text-base"
                  >
                    View Orders
                  </button>
                </div>
                
                <div className="glass-card rounded-lg p-4 sm:p-6 hover:scale-105 transition-all duration-300">
                  <h2 className="text-lg sm:text-xl font-semibold text-purple-400 mb-2">Shopping Cart</h2>
                  <p className="text-gray-400 text-sm sm:text-base">Review items in your cart</p>
                  <button 
                    onClick={() => router.push('/cart')}
                    className="mt-4 px-3 sm:px-4 py-2 gaming-btn text-white rounded-md text-sm sm:text-base"
                  >
                    View Cart
                  </button>
                </div>
              </div>
              
              <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Discover Products</h2>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => {
                        setActiveTab('all');
                        setCurrentPage(1); 
                      }}
                      className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base transition-all ${
                        activeTab === 'all' 
                          ? 'gaming-btn text-white' 
                          : 'bg-indigo-900/30 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-800/50'
                      }`}
                    >
                      All Products
                    </button>

                    <button 
                      onClick={() => router.push('/Customer/products')}
                      className="px-3 py-2 sm:px-4 sm:py-2 bg-indigo-900/30 text-indigo-400 rounded-md border border-indigo-500/30 hover:bg-indigo-800/50 transition-all"
                    >
                      Browse All
                    </button>
                  </div>
                </div>
                
                {activeTab === 'all' && (
                  <div className="glass-card rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-400 mb-1">
                          Search
                        </label>
                        <input
                          type="text"
                          id="search"
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); 
                          }}
                          placeholder="Search products..."
                          className="w-full px-3 py-2 gaming-input rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-400 mb-1">
                          Category
                        </label>
                        <select
                          id="category"
                          value={categoryFilter}
                          onChange={(e) => {
                            setCategoryFilter(e.target.value);
                            setCurrentPage(1); 
                          }}
                          className="w-full px-3 py-2 gaming-input rounded-md"
                        >
                          <option value="">All Categories</option>
                          {categories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-400 mb-1">
                            Min Price
                          </label>
                          <input
                            type="number"
                            id="minPrice"
                            value={priceRange.min}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || parseFloat(value) >= 0) {
                                setPriceRange({...priceRange, min: value});
                              }
                            }}
                            placeholder="Min"
                            min="0"
                            className="w-full px-3 py-2 gaming-input rounded-md"
                          />
                        </div>
                        <div>
                          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-400 mb-1">
                            Max Price
                          </label>
                          <input
                            type="number"
                            id="maxPrice"
                            value={priceRange.max}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || parseFloat(value) >= 0) {
                                setPriceRange({...priceRange, max: value});
                              }
                            }}
                            placeholder="Max"
                            min="0"
                            className="w-full px-3 py-2 gaming-input rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="sort" className="block text-sm font-medium text-gray-400 mb-1">
                          Sort By
                        </label>
                        <select
                          id="sort"
                          value={sortBy}
                          onChange={(e) => {
                            setSortBy(e.target.value);
                            setCurrentPage(1); 
                          }}
                          className="w-full px-3 py-2 gaming-input rounded-md"
                        >
                          <option value="-createdAt">Newest</option>
                          <option value="createdAt">Oldest</option>
                          <option value="name">Name A-Z</option>
                          <option value="-name">Name Z-A</option>
                          <option value="price">Price Low-High</option>
                          <option value="-price">Price High-Low</option>
                          <option value="stock">Stock Low-High</option>
                          <option value="-stock">Stock High-Low</option>
                        </select>
                      </div>
                      
                      <div className="flex items-end">
                        <button
                          onClick={handleClearFilters}
                          className="w-full px-4 py-2 bg-indigo-900/30 text-indigo-400 rounded-md border border-indigo-500/30 hover:bg-indigo-800/50 transition-all"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {(
                  <div>
                    {loading ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          {products.map((product) => (
                            <ProductCard 
                              key={product._id} 
                              product={product}
                              onAddToCartClick={handleAddToCart}
                            />
                          ))}
                        </div>
                        
                        {totalPages > 1 && (
                          <div className="mt-8 flex justify-center">
                            <nav className="inline-flex rounded-md shadow">
                              <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-l-md border border-indigo-500/30 text-sm font-medium ${
                                  currentPage === 1 
                                    ? 'bg-[#1a1f2e] text-gray-600 cursor-not-allowed' 
                                    : 'bg-[#1a1f2e] text-indigo-400 hover:bg-indigo-900/30'
                                }`}
                              >
                                Previous
                              </button>
                              
                              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                let pageNum: number;
                                if (totalPages <= 5) {
                                  pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                  if (i < 3) pageNum = i + 1;
                                  else if (i === 3) pageNum = totalPages;
                                  else return null; 
                                } else if (currentPage >= totalPages - 2) {
                                  if (i === 0) pageNum = 1;
                                  else pageNum = totalPages - 3 + i;
                                } else {
                                  if (i === 0) pageNum = 1;
                                  else if (i === 1) return <span key="ellipsis1" className="px-4 py-2 border-t border-b border-indigo-500/30 text-sm font-medium bg-[#1a1f2e] text-gray-400">...</span>;
                                  else if (i === 2) pageNum = currentPage;
                                  else if (i === 3) return <span key="ellipsis2" className="px-4 py-2 border-t border-b border-indigo-500/30 text-sm font-medium bg-[#1a1f2e] text-gray-400">...</span>;
                                  else pageNum = totalPages;
                                }
                                
                                if (!pageNum || isNaN(pageNum)) return null;
                                
                                return (
                                  <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`px-4 py-2 border-t border-b border-indigo-500/30 text-sm font-medium ${
                                      currentPage === pageNum
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-[#1a1f2e] text-indigo-400 hover:bg-indigo-900/30'
                                    }`}
                                  >
                                    {pageNum}
                                  </button>
                                );
                              })}
                              
                              <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-r-md border border-indigo-500/30 text-sm font-medium ${
                                  currentPage === totalPages 
                                    ? 'bg-[#1a1f2e] text-gray-600 cursor-not-allowed' 
                                    : 'bg-[#1a1f2e] text-indigo-400 hover:bg-indigo-900/30'
                                }`}
                              >
                                Next
                              </button>
                            </nav>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
                
                {!loading && activeTab === 'all' && products.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">No products available</p>
                    <p className="text-gray-500">Check back later for new products</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CustomerDashboard;