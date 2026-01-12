"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Sidebar from '@/app/components/Sidebar';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { Product, getProductById } from '@/services/product.api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProductById(id as string);
      setProduct(response.product);
      setSelectedImageIndex(0); 
    } catch (error) {
      console.error('Error fetching product:', error);
      router.push('/products'); 
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    alert(`Added ${quantity} of "${product?.name}" to cart`);
  };

  const handleBuyNow = () => {
    alert(`Proceeding to checkout with "${product?.name}"`);
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['customer', 'vendor', 'admin']} redirectPath="/">
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!product) {
    return (
      <ProtectedRoute allowedRoles={['customer', 'vendor', 'admin']} redirectPath="/">
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto text-center py-12">
                <h1 className="text-2xl font-bold text-gray-800">Product Not Found</h1>
                <p className="text-gray-600 mt-2">The product you're looking for doesn't exist.</p>
                <button 
                  onClick={() => router.push('/products')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Back to Products
                </button>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['customer', 'vendor', 'admin']} redirectPath="/">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <button 
                onClick={() => router.back()}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Products
              </button>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                  <div>
                    <div className="bg-gray-100 rounded-lg p-4 mb-4 flex items-center justify-center h-96">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[selectedImageIndex]} 
                          alt={product.name} 
                          className="max-h-80 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-image.jpg'; 
                          }}
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
                          No Image Available
                        </div>
                      )}
                    </div>
                    
                    {product.images && product.images.length > 1 && (
                      <div className="flex space-x-2 overflow-x-auto pb-2">
                        {product.images.map((image, index) => (
                          <div 
                            key={index}
                            className={`cursor-pointer border-2 rounded-md p-1 ${
                              selectedImageIndex === index ? 'border-blue-500' : 'border-transparent'
                            }`}
                            onClick={() => setSelectedImageIndex(index)}
                          >
                            <img 
                              src={image} 
                              alt={`${product.name} thumbnail ${index + 1}`}
                              className="w-16 h-16 object-cover rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-image.jpg'; 
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                    
                    <div className="mt-2 flex items-center">
                      <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                      <span className={`ml-4 px-2 py-1 rounded-full text-sm ${
                        product.stock > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-900">Description</h3>
                      <p className="mt-2 text-gray-600">
                        {product.description || 'No description available for this product.'}
                      </p>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Category</h3>
                        <p className="mt-1 text-gray-600">{product.category || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Brand</h3>
                        <p className="mt-1 text-gray-600">{product.brand || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Availability</h3>
                        <p className="mt-1 text-gray-600">
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Added On</h3>
                        <p className="mt-1 text-gray-600">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 mr-4">Quantity:</span>
                        <div className="flex items-center border rounded-md">
                          <button 
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                            disabled={quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-4 py-1">{quantity}</span>
                          <button 
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                            onClick={() => quantity < product.stock && setQuantity(quantity + 1)}
                            disabled={quantity >= product.stock}
                          >
                            +
                          </button>
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          {product.stock} available
                        </span>
                      </div>
                      
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={handleAddToCart}
                          disabled={!product.isActive || product.stock <= 0}
                          className={`px-6 py-3 rounded-md text-white font-medium ${
                            !product.isActive || product.stock <= 0
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          Add to Cart
                        </button>
                        
                        <button
                          onClick={handleBuyNow}
                          disabled={!product.isActive || product.stock <= 0}
                          className={`px-6 py-3 rounded-md text-white font-medium ${
                            !product.isActive || product.stock <= 0
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}