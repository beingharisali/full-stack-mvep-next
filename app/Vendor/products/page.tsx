'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Sidebar from '@/app/components/Sidebar';
import ProtectedRoute from '../../../shared/ProtectedRoute';
import { useAuth } from '../../../context/AuthContext';
import http from '../../../services/http';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  images?: string[];
  description?: string;
  category?: string;
  brand?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export default function VendorProductManagementPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minStock, setMinStock] = useState('');
  const [maxStock, setMaxStock] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); 
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, categoryFilter, brandFilter, minPrice, maxPrice, minStock, maxStock, statusFilter, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };
      
      if (searchTerm) params.name = searchTerm;
      if (categoryFilter) params.category = categoryFilter;
      if (brandFilter) params.brand = brandFilter;
      
      if (minPrice) {
        const priceValue = parseFloat(minPrice);
        if (!isNaN(priceValue) && priceValue >= 0) {
          params.minPrice = priceValue;
        }
      }
      if (maxPrice) {
        const priceValue = parseFloat(maxPrice);
        if (!isNaN(priceValue) && priceValue >= 0) {
          params.maxPrice = priceValue;
        }
      }
      
      if (minStock) {
        const stockValue = parseInt(minStock);
        if (!isNaN(stockValue) && stockValue >= 0) {
          params.minStock = stockValue; 
        }
      }
      if (maxStock) {
        const stockValue = parseInt(maxStock);
        if (!isNaN(stockValue) && stockValue >= 0) {
          params.maxStock = stockValue; 
        }
      }
      
      if (statusFilter === 'active') {
        params.isActive = true;
      } else if (statusFilter === 'inactive') {
        params.isActive = false;
      }
      
      if (sortBy) {
        params.sort = sortOrder === 'asc' ? sortBy : `-${sortBy}`;
      } else {
        params.sort = '-createdAt';
      }
      
      console.log('API Parameters:', params);
      
      const response = await http.get('/products/vendor', { params });
      
      console.log('API Response:', response.data); 
      
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setTotalProducts(response.data.totalProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await http.delete(`/products/${productId}`);
        toast.success('Product deleted successfully!');
        if (products.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        } else {
          fetchProducts();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleAddProduct = () => {
    setCurrentProduct({
      name: '',
      price: 0,
      stock: 0,
      images: [''],
      description: '',
      category: '',
      brand: '',
      isActive: true
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveProduct = async () => {
    if (!currentProduct) return;

    if (!currentProduct.name?.trim()) {
      toast.error('Product name is required');
      return;
    }
    
    if (currentProduct.price === undefined || currentProduct.price === null || currentProduct.price < 0) {
      toast.error('Valid price is required');
      return;
    }
    
    if (currentProduct.stock === undefined || currentProduct.stock === null || currentProduct.stock < 0) {
      toast.error('Valid stock is required');
      return;
    }
    
    const productData = { ...currentProduct };
    if (productData.images && (!productData.images[0] || productData.images[0].trim() === '')) {
      delete productData.images;
    }
    
    try {
      if (isEditing && currentProduct._id) {
        await http.patch(`/products/${currentProduct._id}`, productData as any);
        toast.success('Product updated successfully!');
      } else {
        await http.post('/products', productData as any);
        toast.success('Product created successfully!');
      }
      
      setShowModal(false);
      setCurrentProduct(null);
      fetchProducts();
    } catch (error: any) {
      console.error('Error saving product:', error);
      const errorMessage = error.response?.data?.msg || error.message || 'Failed to save product';
      toast.error(errorMessage);
    }
  };

  const handleToggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      await http.patch(`/products/${productId}`, { isActive: !currentStatus });
      toast.success(`Product ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      fetchProducts(); 
    } catch (error: any) {
      console.error('Error toggling product status:', error);
      const errorMessage = error.response?.data?.msg || error.message || 'Failed to update product status';
      toast.error(errorMessage);
    }
  };

  const displayedProducts = products;

  return (
    <ProtectedRoute allowedRoles={['vendor']} redirectPath="/">
      <div className="min-h-screen bg-[#050a14]">
        <Navbar onMenuToggle={toggleSidebar} sidebarOpen={sidebarOpen} />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <main className={`flex-1 p-4 lg:p-6 transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`}>
            <div className="max-w-7xl mx-auto">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold neon-text mb-4 sm:mb-6">My Products</h1>
              
              <div className="glass-card p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Search
                    </label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); 
                      }}
                      placeholder="Search by name..."
                      className="w-full px-3 py-2 gaming-input rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
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
                      className="w-full px-3 py-2 gaming-input rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={brandFilter}
                      onChange={(e) => {
                        setBrandFilter(e.target.value);
                        setCurrentPage(1); 
                      }}
                      placeholder="Filter by brand..."
                      className="w-full px-3 py-2 gaming-input rounded-md"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <button 
                      onClick={handleAddProduct}
                      className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Add New Product
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Min Price
                      </label>
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || (parseFloat(value) >= 0)) {
                            setMinPrice(value);
                            setCurrentPage(1);
                          }
                        }}
                        min="0"
                        placeholder="Min"
                        className="w-full px-3 py-2 gaming-input rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Max Price
                      </label>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || (parseFloat(value) >= 0)) {
                            setMaxPrice(value);
                            setCurrentPage(1);
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
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Min Stock
                      </label>
                      <input
                        type="number"
                        value={minStock}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || (parseInt(value) >= 0)) {
                            setMinStock(value);
                            setCurrentPage(1);
                          }
                        }}
                        min="0"
                        placeholder="Min"
                        className="w-full px-3 py-2 gaming-input rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Max Stock
                      </label>
                      <input
                        type="number"
                        value={maxStock}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || (parseInt(value) >= 0)) {
                            setMaxStock(value);
                            setCurrentPage(1);
                          }
                        }}
                        min="0"
                        placeholder="Max"
                        className="w-full px-3 py-2 gaming-input rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1); 
                      }}
                      className="w-full px-3 py-2 gaming-input rounded-md"
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setCategoryFilter('');
                        setBrandFilter('');
                        setMinPrice('');
                        setMaxPrice('');
                        setMinStock('');
                        setMaxStock('');
                        setStatusFilter('all');
                        setSortBy('');
                        setSortOrder('desc');
                        setCurrentPage(1);
                      }}
                      className="w-full px-4 py-2 bg-indigo-900/30 text-indigo-400 rounded-md border border-indigo-500/30 hover:bg-indigo-800/50 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 gaming-input rounded-md"
                    >
                      <option value="">Default</option>
                      <option value="name">Name</option>
                      <option value="price">Price</option>
                      <option value="stock">Stock</option>
                      <option value="category">Category</option>
                      <option value="createdAt">Date Added</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Order
                    </label>
                    <select
                      value={sortOrder}
                      onChange={(e) => {
                        setSortOrder(e.target.value as 'asc' | 'desc');
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 gaming-input rounded-md"
                    >
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <div className="text-sm text-gray-400">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
                    </div>
                  </div>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-48 sm:h-64">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <div className="glass-card rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-indigo-500/30">
                      <thead className="bg-[#1a1f2e]">
                        <tr>
                          <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Product
                          </th>
                          <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                            Category
                          </th>
                          <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Price
                          </th>
                          <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Stock
                          </th>
                          <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">
                            Status
                          </th>
                          <th scope="col" className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-[#0f1420] divide-y divide-indigo-500/30">
                        {displayedProducts.map((product) => (
                          <tr key={product._id} className="hover:bg-[#1a1f2e] transition-colors">
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  {product.images && product.images.length > 0 ? (
                                    <img 
                                      src={product.images[0]} 
                                      alt={product.name} 
                                      className="h-10 w-10 object-cover rounded-md border border-indigo-500/30"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/placeholder-image.jpg';
                                      }}
                                    />
                                  ) : (
                                    <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-md w-10 h-10" />
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-white">
                                    {product.name}
                                  </div>
                                  <div className="text-xs text-gray-400 truncate max-w-[120px] md:max-w-xs">
                                    {product.description || 'No description'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden sm:table-cell">
                              {product.category || 'N/A'}
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-indigo-400">
                              ${product.price.toFixed(2)}
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                              {product.stock}
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                                product.isActive 
                                  ? 'bg-green-900/50 text-green-400 border-green-500/50' 
                                  : 'bg-red-900/50 text-red-400 border-red-500/50'
                              }`}>
                                {product.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button 
                                  onClick={() => handleEditProduct(product)}
                                  className="text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(product._id)}
                                  className="text-red-400 hover:text-red-300 border border-red-500/30 px-2 py-1 rounded"
                                >
                                  Delete
                                </button>
                                <button 
                                  onClick={() => handleToggleProductStatus(product._id, product.isActive)}
                                  className={`px-2 py-1 rounded text-xs border ${
                                    product.isActive 
                                      ? 'bg-red-900/50 text-red-400 border-red-500/30 hover:bg-red-800/50' 
                                      : 'bg-green-900/50 text-green-400 border-green-500/30 hover:bg-green-800/50'
                                  }`}
                                >
                                  {product.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {displayedProducts.length === 0 && !loading && (
                    <div className="text-center py-8 sm:py-12">
                      <p className="text-gray-400 text-base sm:text-lg">
                        {minStock || maxStock || minPrice || maxPrice || statusFilter !== 'all' || categoryFilter || brandFilter || searchTerm
                          ? 'No products found matching your criteria'
                          : 'No products found'}
                      </p>
                      {(minStock || maxStock || minPrice || maxPrice || statusFilter !== 'all' || categoryFilter || brandFilter || searchTerm) && (
                        <p className="text-gray-500 text-sm sm:text-base px-4">
                          Try adjusting your filters
                        </p>
                      )}
                    </div>
                  )}
                  
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 sm:px-4 md:px-6 py-3 border-t border-indigo-500/30 bg-[#1a1f2e]">
                      <div className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-0">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`px-2 py-1 rounded-md text-xs sm:text-sm border ${
                            currentPage === 1 
                              ? 'bg-[#0f1420] text-gray-600 border-gray-700 cursor-not-allowed' 
                              : 'bg-[#0f1420] text-indigo-400 border-indigo-500/30 hover:bg-indigo-900/30'
                          }`}
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
                              className={`px-2 py-1 rounded-md text-xs sm:text-sm border ${
                                currentPage === pageNum 
                                  ? 'bg-indigo-600 text-white border-indigo-600' 
                                  : 'bg-[#0f1420] text-indigo-400 border-indigo-500/30 hover:bg-indigo-900/30'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className={`px-2 py-1 rounded-md text-xs sm:text-sm border ${
                            currentPage === totalPages 
                              ? 'bg-[#0f1420] text-gray-600 border-gray-700 cursor-not-allowed' 
                              : 'bg-[#0f1420] text-indigo-400 border-indigo-500/30 hover:bg-indigo-900/30'
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
        
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
            <div className="glass-card rounded-lg p-3 sm:p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-indigo-500/30">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={currentProduct?.name || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct!, name: e.target.value})}
                    className="w-full px-3 py-2 gaming-input rounded-md"
                    placeholder="Product name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                  <textarea
                    value={currentProduct?.description || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct!, description: e.target.value})}
                    className="w-full px-3 py-2 gaming-input rounded-md"
                    placeholder="Product description"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Price</label>
                    <input
                      type="number"
                      value={currentProduct?.price || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || parseFloat(value) >= 0) {
                          setCurrentProduct({...currentProduct!, price: parseFloat(value) || 0});
                        }
                      }}
                      min="0"
                      className="w-full px-3 py-2 gaming-input rounded-md"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Stock</label>
                    <input
                      type="number"
                      value={currentProduct?.stock || ''}
                      onChange={(e) => setCurrentProduct({...currentProduct!, stock: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 gaming-input rounded-md"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                    <input
                      type="text"
                      value={currentProduct?.category || ''}
                      onChange={(e) => setCurrentProduct({...currentProduct!, category: e.target.value})}
                      className="w-full px-3 py-2 gaming-input rounded-md"
                      placeholder="Category"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Brand</label>
                    <input
                      type="text"
                      value={currentProduct?.brand || ''}
                      onChange={(e) => setCurrentProduct({...currentProduct!, brand: e.target.value})}
                      className="w-full px-3 py-2 gaming-input rounded-md"
                      placeholder="Brand"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Image URL (Optional)</label>
                  <input
                    type="text"
                    value={currentProduct?.images?.[0] || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct!, images: [e.target.value]})}
                    className="w-full px-3 py-2 gaming-input rounded-md"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter any valid image URL (optional)</p>
                </div>
                
                <div className="flex items-center bg-indigo-900/30 p-3 rounded-lg border border-indigo-500/30">
                  <input
                    type="checkbox"
                    checked={currentProduct?.isActive ?? true}
                    onChange={(e) => setCurrentProduct({...currentProduct!, isActive: e.target.checked})}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
                  />
                  <label className="ml-2 block text-sm text-gray-300">Active</label>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-6 flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors w-full sm:w-auto border border-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProduct}
                  disabled={!currentProduct?.name?.trim() || currentProduct.price === undefined || currentProduct.price < 0 || currentProduct.stock === undefined || currentProduct.stock < 0}
                  className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  {isEditing ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}