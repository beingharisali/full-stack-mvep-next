'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ProtectedRoute from '../../../shared/ProtectedRoute';
import ProductCard from '../../components/ProductCard';
import { Product, getProducts } from '../../../services/product.api';

const CustomerDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'featured'>('all');
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch all products
      const allProductsRes = await getProducts({ limit: 8 });
      setProducts(allProductsRes.products);
      
      // Fetch featured products (most recent)
      const featuredRes = await getProducts({ limit: 4, sort: '-createdAt' });
      setFeaturedProducts(featuredRes.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    alert(`${product.name} added to cart!`);
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
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
                  <h2 className="text-xl font-semibold mb-2">My Orders</h2>
                  <p className="text-blue-100">Track your recent orders</p>
                  <button 
                    onClick={() => router.push('/Customer/orders')}
                    className="mt-4 px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    View Orders
                  </button>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
                  <h2 className="text-xl font-semibold mb-2">My Profile</h2>
                  <p className="text-green-100">Manage your account details</p>
                  <button 
                    className="mt-4 px-4 py-2 bg-white text-green-600 rounded-md hover:bg-green-50 transition-colors"
                    onClick={() => alert('Profile page coming soon!')}
                  >
                    Edit Profile
                  </button>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
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
                      onClick={() => setActiveTab('all')}
                      className={`px-4 py-2 rounded-md ${
                        activeTab === 'all' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      All Products
                    </button>
                    <button 
                      onClick={() => setActiveTab('featured')}
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
                
                {/* Featured Products Section */}
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
                
                {/* All Products Section */}
                {activeTab === 'all' && (
                  <div>
                    {loading ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                          <ProductCard 
                            key={product._id} 
                            product={product}
                            onAddToCartClick={handleAddToCart}
                          />
                        ))}
                      </div>
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