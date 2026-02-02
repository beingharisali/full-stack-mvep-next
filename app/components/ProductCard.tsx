'use client';

import { Product } from '../../services/product.api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
  onAddToCartClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  showAddToCart = true,
  onAddToCartClick 
}) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  
  const canAddToCart = user?.role === 'customer' && showAddToCart;

  const handleViewDetails = () => {
    router.push(`/products/${product._id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    
    try {
      await addToCart(product._id, quantity);
      if (onAddToCartClick) {
        onAddToCartClick(product);
      } else {
        toast.success(`${quantity} ${product.name}(s) added to cart!`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col"
      onClick={handleViewDetails}
    >
      <div className="h-40 sm:h-48 bg-gray-200 flex items-center justify-center">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.jpg';
            }}
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
            No Image
          </div>
        )}
      </div>
      
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-base sm:text-lg truncate">{product.name}</h3>
        <p className="text-gray-600 text-xs sm:text-sm truncate mt-1 flex-1">{product.description || 'No description'}</p>
        
        <div className="mt-3 flex justify-between items-center">
          <span className="text-base sm:text-lg font-bold text-blue-600">${Math.max(0, product.price).toFixed(2)}</span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            product.stock > 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
        
        {product.category && (
          <div className="mt-2">
            <span className="text-xs text-gray-500">Category: {product.category}</span>
          </div>
        )}
        
        {canAddToCart && product.isActive && product.stock > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex items-center border rounded-md">
              <button 
                className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  if (quantity > 1) setQuantity(quantity - 1);
                }}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-2 py-1 text-sm min-w-[40px] text-center">{quantity}</span>
              <button 
                className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  if (quantity < product.stock) setQuantity(quantity + 1);
                }}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`flex-1 px-3 py-2 rounded-md text-white text-sm font-medium ${
                isAdding 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        )}
        
        {!canAddToCart && product.isActive && product.stock > 0 && (
          <div className="mt-4 p-2 bg-gray-100 rounded text-center text-sm text-gray-600">
            Only customers can purchase products
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;