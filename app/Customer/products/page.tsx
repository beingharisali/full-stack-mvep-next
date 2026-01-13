'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ProtectedRoute from '../../../shared/ProtectedRoute';
import ProductCard from '../../components/ProductCard';
import { Product, getProducts, ProductListResponse } from '../../../services/product.api';

const CustomerProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('-createdAt');
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const router = useRouter();

  const itemsPerPage = 12; 

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchFilteredProducts();
  }, [searchTerm, categoryFilter, priceRange, sortBy, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response: ProductListResponse = await getProducts({ 
        limit: itemsPerPage,
        page: currentPage
      });
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
      if (priceRange.min) params.minPrice = parseFloat(priceRange.min);
      if (priceRange.max) params.maxPrice = parseFloat(priceRange.max);

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
    alert(`${product.name} added to cart!`);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setPriceRange({ min: '', max: '' });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['customer']} redirectPath="/">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Shop Products</h1>
              
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                        onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                        placeholder="Min"
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
                        onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                        placeholder="Max"
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
                      <option value="name">Name A-Z</option>
                      <option value="-name">Name Z-A</option>
                      <option value="price">Price Low-High</option>
                      <option value="-price">Price High-Low</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Clear Filters
                  </button>
                  <div className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
                  </div>
                </div>
              </div>
              
              {loading && (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
              
              {!loading && (
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
                  
                  {products.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">No products found</p>
                      <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                    </div>
                  )}
                  
                  {totalPages > 1 && (
                    <div className="mt-10 flex justify-center">
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
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CustomerProductsPage;