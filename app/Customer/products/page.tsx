'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ProtectedRoute from '../../../shared/ProtectedRoute';
import ProductCard from '../../components/ProductCard';
import { Product, getProducts, ProductListResponse } from '../../../services/product.api';
import toast from 'react-hot-toast';

const CustomerProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [stockRange, setStockRange] = useState({ min: '', max: '' });
  const [statusFilter, setStatusFilter] = useState(''); 
  const [sortBy, setSortBy] = useState('-createdAt');
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const router = useRouter();

  const itemsPerPage = 12; 

  useEffect(() => {
    fetchProducts();
    fetchCategoriesAndBrands();
  }, []);

  useEffect(() => {
    fetchFilteredProducts();
  }, [searchTerm, categoryFilter, brandFilter, priceRange, stockRange, statusFilter, sortBy, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response: ProductListResponse = await getProducts({ 
        limit: itemsPerPage,
        page: currentPage
      });
      console.log('Customer Products API Response:', response);
      setProducts(response.products);
      setTotalPages(response.totalPages);
      setTotalProducts(response.totalProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredProducts = async () => {
    try {
      setLoading(true);
      
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
        sort: sortBy,
      };

      if (searchTerm) params.name = searchTerm;
      if (categoryFilter) params.category = categoryFilter;
      if (brandFilter) params.brand = brandFilter;
      if (priceRange.min) params.minPrice = parseFloat(priceRange.min);
      if (priceRange.max) params.maxPrice = parseFloat(priceRange.max);
      const numericFilters = [];
      if (stockRange.min) numericFilters.push(`stock>=${parseInt(stockRange.min)}`);
      if (stockRange.max) numericFilters.push(`stock<=${parseInt(stockRange.max)}`);
      if (numericFilters.length > 0) {
        params.numericFilters = numericFilters.join(',');
      }
      if (statusFilter) params.isActive = statusFilter === 'active';

      const response: ProductListResponse = await getProducts(params);
      setProducts(response.products);
      setTotalPages(response.totalPages);
      setTotalProducts(response.totalProducts);
    } catch (error) {
      console.error('Error fetching filtered products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesAndBrands = async () => {
    try {
      const response = await getProducts({ limit: 100 });
      const uniqueCategories = Array.from(new Set(response.products.map(p => p.category).filter(Boolean))) as string[];
      const uniqueBrands = Array.from(new Set(response.products.map(p => p.brand).filter(Boolean))) as string[];
      setCategories(uniqueCategories);
      setBrands(uniqueBrands);
    } catch (error) {
      console.error('Error fetching categories and brands:', error);
    }
  };

  const handleAddToCart = (product: Product) => {
    toast.success(`${product.name} added to cart!`);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setBrandFilter('');
    setPriceRange({ min: '', max: '' });
    setStockRange({ min: '', max: '' });
    setStatusFilter('');
    setCurrentPage(1); 
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['customer']} redirectPath="/">
      <div className="min-h-screen">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl sm:text-3xl font-bold neon-text mb-4 sm:mb-6">Shop Products</h1>
              
              <div className="mb-4 sm:mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); 
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
              
              <div className="glass-card p-4 sm:p-6 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4">
                  <div>
                    <label htmlFor="search" className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
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
                      className="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-sm sm:text-base gaming-input rounded-md"
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
                  
                  <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-400 mb-1">
                      Brand
                    </label>
                    <select
                      id="brand"
                      value={brandFilter}
                      onChange={(e) => {
                        setBrandFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 gaming-input rounded-md"
                    >
                      <option value="">All Brands</option>
                      {brands.map((brand, index) => (
                        <option key={index} value={brand}>{brand}</option>
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
                          if (value === '' || (parseFloat(value) >= 0)) {
                            setPriceRange({...priceRange, min: value});
                          }
                        }}
                        min="0"
                        placeholder="Min"
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
                          if (value === '' || (parseFloat(value) >= 0)) {
                            setPriceRange({...priceRange, max: value});
                          }
                        }}
                        min="0"
                        placeholder="Max"
                        className="w-full px-3 py-2 gaming-input rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="minStock" className="block text-sm font-medium text-gray-400 mb-1">
                        Min Stock
                      </label>
                      <input
                        type="number"
                        id="minStock"
                        value={stockRange.min}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || (parseInt(value) >= 0)) {
                            setStockRange({...stockRange, min: value});
                          }
                        }}
                        min="0"
                        placeholder="Min"
                        className="w-full px-3 py-2 gaming-input rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="maxStock" className="block text-sm font-medium text-gray-400 mb-1">
                        Max Stock
                      </label>
                      <input
                        type="number"
                        id="maxStock"
                        value={stockRange.max}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || (parseInt(value) >= 0)) {
                            setStockRange({...stockRange, max: value});
                          }
                        }}
                        min="0"
                        placeholder="Max"
                        className="w-full px-3 py-2 gaming-input rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-400 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1); 
                      }}
                      className="w-full px-3 py-2 gaming-input rounded-md"
                    >
                      <option value="">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
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
                </div>
                
                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-between gap-2">
                  <button
                    onClick={handleClearFilters}
                    className="px-3 py-2 sm:px-4 sm:py-2 text-sm bg-indigo-900/30 text-indigo-400 rounded-md border border-indigo-500/30 hover:bg-indigo-800/50 transition-all"
                  >
                    Clear Filters
                  </button>
                  <div className="text-xs sm:text-sm text-gray-400">
                    Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
                  </div>
                </div>
              </div>
              
              {loading && (
                <div className="flex justify-center items-center h-48 sm:h-64">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              )}
              
              {!loading && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {products.map((product) => (
                      <ProductCard 
                        key={product._id} 
                        product={product}
                        onAddToCartClick={handleAddToCart}
                      />
                    ))}
                  </div>
                  
                  {products.length === 0 && (
                    <div className="text-center py-8 sm:py-12">
                      <p className="text-gray-400 text-base sm:text-lg">No products found</p>
                      <p className="text-gray-500 text-sm sm:text-base px-4">Try adjusting your search or filter criteria</p>
                    </div>
                  )}
                  
                  {totalPages > 1 && (
                    <div className="mt-8 sm:mt-10 flex justify-center">
                      <nav className="inline-flex rounded-md shadow">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-2 sm:px-4 sm:py-2 rounded-l-md border border-indigo-500/30 text-xs sm:text-sm font-medium ${
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
                            else if (i === 1) return <span key="ellipsis1" className="px-3 py-2 sm:px-4 sm:py-2 border-t border-b border-indigo-500/30 text-xs sm:text-sm font-medium bg-[#1a1f2e] text-gray-500">...</span>;
                            else if (i === 2) pageNum = currentPage;
                            else if (i === 3) return <span key="ellipsis2" className="px-3 py-2 sm:px-4 sm:py-2 border-t border-b border-indigo-500/30 text-xs sm:text-sm font-medium bg-[#1a1f2e] text-gray-500">...</span>;
                            else pageNum = totalPages;
                          }
                          
                          if (!pageNum || isNaN(pageNum)) return null;
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-3 py-2 sm:px-4 sm:py-2 border-t border-b border-indigo-500/30 text-xs sm:text-sm font-medium ${
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
                          className={`px-3 py-2 sm:px-4 sm:py-2 rounded-r-md border border-indigo-500/30 text-xs sm:text-sm font-medium ${
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
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CustomerProductsPage;