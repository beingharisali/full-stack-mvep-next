'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ProtectedRoute from '../../../shared/ProtectedRoute';
import ProductCard from '../../components/ProductCard';
import { Product, getProducts } from '../../../services/product.api';

const CustomerProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('-createdAt');
  const [categories, setCategories] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchFilteredProducts();
  }, [searchTerm, categoryFilter, priceRange, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts({ limit: 20 });
      setProducts(response.products);
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
        sort: sortBy,
      };

      if (searchTerm) params.name = searchTerm;
      if (categoryFilter) params.category = categoryFilter;
      if (priceRange.min) params.minPrice = parseFloat(priceRange.min);
      if (priceRange.max) params.maxPrice = parseFloat(priceRange.max);

      const response = await getProducts(params);
      setProducts(response.products);
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
                      onChange={(e) => setSearchTerm(e.target.value)}
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
                      onChange={(e) => setCategoryFilter(e.target.value)}
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
                      onChange={(e) => setSortBy(e.target.value)}
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
                
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Clear Filters
                  </button>
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