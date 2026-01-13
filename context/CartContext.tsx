'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { 
  getCart as getCartAPI, 
  addToCart as addToCartAPI, 
  removeFromCart as removeFromCartAPI, 
  updateCartItem as updateCartItemAPI, 
  clearCart as clearCartAPI 
} from '../services/cart.api';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  images?: string[];
  stock: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

type CartAction =
  | { type: 'SET_CART'; payload: { items: CartItem[] } }
  | { type: 'ADD_ITEM'; payload: { product: CartItem } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: { loading: boolean } }
  | { type: 'SET_ERROR'; payload: { error: string | null } };

interface CartContextType {
  cart: CartState;
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  loadCart: () => void;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items,
      };
      
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item._id === action.payload.product._id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item._id === action.payload.product._id
              ? { ...item, quantity: item.quantity + action.payload.product.quantity }
              : item
          ),
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload.product],
        };
      }
      
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload.productId),
      };
      
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.productId
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        ),
      };
      
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
      
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload.loading,
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload.error,
      };
      
    default:
      return state;
  }
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { loading: true } });
      const cartData = await getCartAPI();
      dispatch({ type: 'SET_CART', payload: { items: cartData.items || [] } });
      dispatch({ type: 'SET_LOADING', payload: { loading: false } });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { error: error instanceof Error ? error.message : 'Failed to load cart' } 
      });
      dispatch({ type: 'SET_LOADING', payload: { loading: false } });
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const addToCart = async (productId: string, quantity: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { loading: true } });
      const result = await addToCartAPI(productId, quantity);
      dispatch({ type: 'SET_CART', payload: { items: result.items } });
      dispatch({ type: 'SET_LOADING', payload: { loading: false } });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { error: error instanceof Error ? error.message : 'Failed to add item to cart' } 
      });
      dispatch({ type: 'SET_LOADING', payload: { loading: false } });
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { loading: true } });
      const result = await removeFromCartAPI(productId);
      dispatch({ type: 'SET_CART', payload: { items: result.items } });
      dispatch({ type: 'SET_LOADING', payload: { loading: false } });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { error: error instanceof Error ? error.message : 'Failed to remove item from cart' } 
      });
      dispatch({ type: 'SET_LOADING', payload: { loading: false } });
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { loading: true } });
      const result = await updateCartItemAPI(productId, quantity);
      dispatch({ type: 'SET_CART', payload: { items: result.items } });
      dispatch({ type: 'SET_LOADING', payload: { loading: false } });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { error: error instanceof Error ? error.message : 'Failed to update item quantity' } 
      });
      dispatch({ type: 'SET_LOADING', payload: { loading: false } });
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { loading: true } });
      const result = await clearCartAPI();
      dispatch({ type: 'SET_CART', payload: { items: result.items } });
      dispatch({ type: 'SET_LOADING', payload: { loading: false } });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { error: error instanceof Error ? error.message : 'Failed to clear cart' } 
      });
      dispatch({ type: 'SET_LOADING', payload: { loading: false } });
    }
  };

  const getCartTotal = () => {
    return cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};