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
      toast.success(`✨ ${quantity}x ${product.name} added to Cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('❌ Failed to add item. Try again!');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div 
      className="glass-card rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer h-full flex flex-col border border-indigo-500/30 hover:border-indigo-500"
      onClick={handleViewDetails}
    >
      <div className="h-40 sm:h-48 bg-[#1a1f2e] flex items-center justify-center relative overflow-hidden">
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
          <div className="h-full w-full bg-gradient-to-br from-indigo-900/30 to-purple-900/30 flex items-center justify-center">
            <span className="text-4xl">🎮</span>
          </div>
        )}
        {!product.isActive && (
          <div className="absolute top-2 right-2 bg-red-900/90 text-red-400 text-xs px-2 py-1 rounded-full border border-red-500/50">
            💤 Inactive
          </div>
        )}
      </div>
      
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-base sm:text-lg text-white truncate">{product.name}</h3>
        <p className="text-gray-400 text-xs sm:text-sm truncate mt-1 flex-1">{product.description || 'No description'}</p>
        
        <div className="mt-3 flex justify-between items-center">
          <span className="text-base sm:text-lg font-bold text-yellow-400"> {Math.max(0, product.price).toFixed(2)} $</span>
          <span className={`px-2 py-1 rounded-full text-xs border ${
            product.stock > 0 
              ? 'bg-green-900/50 text-green-400 border-green-500/50' 
              : 'bg-red-900/50 text-red-400 border-red-500/50'
          }`}>
            {product.stock > 0 ? `📦 ${product.stock} in stock` : '❌ Out of stock'}
          </span>
        </div>
        
        {product.category && (
          <div className="mt-2">
            <span className="text-xs text-gray-500">📚 Category: {product.category}</span>
          </div>
        )}
        
        {canAddToCart && product.isActive && product.stock > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex items-center border border-indigo-500/30 rounded-md bg-[#1a1f2e]">
              <button 
                className="px-2 py-1 text-gray-400 hover:text-white hover:bg-indigo-500/20 disabled:opacity-50 text-sm rounded-l"
                onClick={(e) => {
                  e.stopPropagation();
                  if (quantity > 1) setQuantity(quantity - 1);
                }}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-2 py-1 text-sm min-w-[40px] text-center text-white">{quantity}</span>
              <button 
                className="px-2 py-1 text-gray-400 hover:text-white hover:bg-indigo-500/20 disabled:opacity-50 text-sm rounded-r"
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
              className={`flex-1 px-3 py-2 rounded-md text-white text-sm font-medium transition-all ${
                isAdding 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'gaming-btn'
              }`}
            >
              {isAdding ? '⚡ Adding...' : '🛒 Add to Cart'}
            </button>
          </div>
        )}
        
        {!canAddToCart && product.isActive && product.stock > 0 && (
          <div className="mt-4 p-2 bg-indigo-900/30 rounded text-center text-sm text-indigo-400 border border-indigo-500/30">
            🎮 Only customers can purchase products
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;