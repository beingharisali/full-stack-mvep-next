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
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'featured'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('-createdAt'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const router = useRouter();

  const itemsPerPage = 8; 

  useEffect(() => {
    fetchCategories();
    if (activeTab === 'all') {
      fetchProducts();
    } else {
      fetchFeaturedProducts();
    }
  }, [activeTab, currentPage, searchTerm, categoryFilter, priceRange]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const params: any = {
        limit: itemsPerPage,
        page: currentPage,
        sort: sortBy, 
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

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts({ limit: 4, sort: '-createdAt' });
      setFeaturedProducts(response.products);
    } catch (error) {
      console.error('Error fetching featured products:', error);
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
              <p className="text-gray-600 mb-8">Discover our latest products and deals</p>
              
              <div className="mb-8">
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
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white w-100">
                  <h2 className="text-xl font-semibold mb-2">My Orders</h2>
                  <p className="text-blue-100">Track your recent orders</p>
                  <button 
                    onClick={() => router.push('/Customer/orders')}
                    className="mt-4 px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    View Orders
                  </button>
                </div>
                
                {/* <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
                  <h2 className="text-xl font-semibold mb-2">My Profile</h2>
                  <p className="text-green-100">Manage your account details</p>
                  <button 
                    className="mt-4 px-4 py-2 bg-white text-green-600 rounded-md hover:bg-green-50 transition-colors"
                    onClick={() => toast.info('Profile page coming soon!')
                  >
                    Edit Profile
                  </button>
                </div> */}
                
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white w-100">
                  <h2 className="text-xl font-semibold mb-2">Shopping Cart</h2>
                  <p className="text-purple-100">Review items in your cart</p>
                  <button 
                    onClick={() => router.push('/cart')}
                    className="mt-4 px-4 py-2 bg-white text-purple-600 rounded-md hover:bg-purple-50 transition-colors"
                  >
                    View Cart
                  </button>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Discover Products</h2>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setActiveTab('all');
                        setCurrentPage(1); 
                      }}
                      className={`px-4 py-2 rounded-md ${
                        activeTab === 'all' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      All Products
                    </button>
                    <button 
                      onClick={() => {
                        setActiveTab('featured');
                        setCurrentPage(1); 
                      }}
                      className={`px-4 py-2 rounded-md ${
                        activeTab === 'featured' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Featured
                    </button>
                    <button 
                      onClick={() => router.push('/Customer/products')}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      Browse All
                    </button>
                  </div>
                </div>
                
                {activeTab === 'all' && (
                  <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          id="category"
                          value={categoryFilter}
                          onChange={(e) => {
                            setCategoryFilter(e.target.value);
                            setCurrentPage(1); 
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">All Categories</option>
                          {categories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                          Sort By
                        </label>
                        <select
                          id="sort"
                          value={sortBy}
                          onChange={(e) => {
                            setSortBy(e.target.value);
                            setCurrentPage(1); 
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'featured' && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-700 mb-4">Recently Added</h3>
                      {loading ? (
                        <div className="flex justify-center items-center h-64">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          {featuredProducts.map((product) => (
                            <ProductCard 
                              key={product._id} 
                              product={product}
                              onAddToCartClick={handleAddToCart}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {activeTab === 'all' && (
                  <div>
                    {loading ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
                                className={`px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                                  currentPage === 1 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
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
                                  else if (i === 1) return <span key="ellipsis1" className="px-4 py-2 border-t border-b border-gray-300 text-sm font-medium bg-white text-gray-700">...</span>;
                                  else if (i === 2) pageNum = currentPage;
                                  else if (i === 3) return <span key="ellipsis2" className="px-4 py-2 border-t border-b border-gray-300 text-sm font-medium bg-white text-gray-700">...</span>;
                                  else pageNum = totalPages;
                                }
                                
                                if (!pageNum || isNaN(pageNum)) return null;
                                
                                return (
                                  <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`px-4 py-2 border-t border-b border-gray-300 text-sm font-medium ${
                                      currentPage === pageNum
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                  >
                                    {pageNum}
                                  </button>
                                );
                              })}
                              
                              <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                                  currentPage === totalPages 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
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
                    <p className="text-gray-500 text-lg">No products available</p>
                    <p className="text-gray-400">Check back later for new products</p>
                  </div>
                )}
                
                {!loading && activeTab === 'featured' && featuredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No featured products available</p>
                    <p className="text-gray-400">Check back later for new products</p>
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