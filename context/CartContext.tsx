'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

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
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: CartItem } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: { items: CartItem[] } };

interface CartContextType {
  cart: CartState;
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const initialState: CartState = {
  items: [],
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item._id === action.payload.product._id);
      
      if (existingItem) {
        return {
          items: state.items.map(item =>
            item._id === action.payload.product._id
              ? { ...item, quantity: item.quantity + action.payload.product.quantity }
              : item
          ),
        };
      } else {
        return {
          items: [...state.items, action.payload.product],
        };
      }
      
    case 'REMOVE_ITEM':
      return {
        items: state.items.filter(item => item._id !== action.payload.productId),
      };
      
    case 'UPDATE_QUANTITY':
      return {
        items: state.items.map(item =>
          item._id === action.payload.productId
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        ),
      };
      
    case 'CLEAR_CART':
      return {
        items: [],
      };
      
    case 'SET_CART':
      return {
        items: action.payload.items,
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

  const addToCart = (product: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: { product } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
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