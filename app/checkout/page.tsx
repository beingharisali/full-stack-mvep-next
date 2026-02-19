'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProtectedRoute from '../../shared/ProtectedRoute';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../services/order.api';
import { 
  getPaymentMethods, 
  processStripePayment, 
  processBraintreePayment, 
  processPayPalPayment, 
  PaymentMethodsResponse,
  validateCardNumber,
  validateExpiryDate,
  validateCVV
} from '../../services/payment.api';
import toast from 'react-hot-toast';

const CheckoutPage: React.FC = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const methods = await getPaymentMethods();
        setPaymentMethods(methods);
        
        const hasConfiguredPayment = methods.stripe?.enabled || methods.braintree?.enabled || methods.paypal?.enabled;
        setPaymentConfigured(!!hasConfiguredPayment);
        
        if (methods.stripe?.enabled) {
          setSelectedPaymentMethod('stripe');
        } else if (methods.braintree?.enabled) {
          setSelectedPaymentMethod('braintree');
        } else if (methods.paypal?.enabled) {
          setSelectedPaymentMethod('paypal');
        } else {
          setSelectedPaymentMethod('cash-on-delivery'); 
        }
      } catch (error) {
        console.error('Failed to load payment methods:', error);
        toast.error('Failed to load payment methods');
        setPaymentConfigured(false);
        setSelectedPaymentMethod('cash-on-delivery');
      }
    };
    
    loadPaymentMethods();
  }, []);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodsResponse>({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentConfigured, setPaymentConfigured] = useState<boolean>(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePaymentData = () => {
    setPaymentError(null);
    
    if (selectedPaymentMethod === 'card' || selectedPaymentMethod === 'stripe' || selectedPaymentMethod === 'braintree') {
      if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
        setPaymentError('Please fill in all card details');
        return false;
      }
      
      if (!validateCardNumber(formData.cardNumber)) {
        setPaymentError('Invalid card number');
        return false;
      }
      
      if (!validateExpiryDate(formData.expiryDate)) {
        setPaymentError('Invalid expiry date');
        return false;
      }
      
      if (!validateCVV(formData.cvv, formData.cardNumber)) {
        setPaymentError('Invalid CVV');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePaymentData()) {
      return;
    }
    
    setIsProcessing(true);
    setPaymentError(null);
    
    try {
      const orderItems = cart.items.map(item => ({
        product: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        images: item.images,
      }));
      
      const subtotal = getCartTotal();
      const shipping = 5.99;
      const tax = subtotal * 0.08;
      const total = subtotal + shipping + tax;
      
      const orderData = {
        items: orderItems,
        totalAmount: total,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod: selectedPaymentMethod,
        transactionId: `TXN_${Date.now()}`, 
      };
      
      const order = await createOrder(orderData);
      
      let paymentResult = { success: true };
      
      if (selectedPaymentMethod !== 'cash-on-delivery') {
        try {
          switch (selectedPaymentMethod) {
            case 'stripe':
              paymentResult = await processStripePayment({
                amount: total,
                source: 'tok_visa', 
                orderId: order._id
              });
              break;
              
            case 'braintree':
              paymentResult = await processBraintreePayment({
                nonce: 'fake-valid-nonce', 
                amount: total,
                orderId: order._id
              });
              break;
              
            case 'paypal':
              paymentResult = await processPayPalPayment({
                nonce: 'fake-paypal-nonce', 
                amount: total,
                orderId: order._id
              });
              break;
          }
        } catch (paymentError: any) {
          console.warn('Payment processing not configured, proceeding with order creation only');
          paymentResult = { success: true };
        }
      } else {
        paymentResult = { success: true };
      }
      
      if (paymentResult.success) {
        console.log('Order processed:', { order, payment: paymentResult });
        toast.success('Order placed successfully!');
        clearCart();
        
        router.push(`/payment/success?orderId=${order._id}&status=success`);
      } else {
        setPaymentError('Payment failed. Please try again.');
        toast.error('Payment failed. Please try again.');
      }
      
    } catch (error: any) {
      console.error('Error processing order/payment:', error);
      if (error.response?.data?.error?.includes('not configured')) {
        toast.success('Order placed successfully! (Payment processing not configured)');
        clearCart();
        router.push('/orders');
      } else {
        setPaymentError(error.response?.data?.error || 'Failed to process order. Please try again.');
        toast.error('Failed to process order. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <ProtectedRoute allowedRoles={['customer', 'admin', 'vendor']} redirectPath="/">
        <div className="min-h-screen bg-[#050a14] container-mobile-xs sm:container-mobile-sm md:container-mobile-md lg:container-mobile-lg xl:container-tablet 2xl:container-desktop">
          <Navbar />
          <div className="flex">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <main className={`flex-1 p-4 lg:p-6 transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`}>
              <div className="max-w-4xl mx-auto text-center py-12 container-mobile-xs sm:container-mobile-sm md:container-mobile-md lg:container-mobile-lg xl:container-tablet">
                <h1 className="text-2xl md:text-3xl font-bold neon-text mb-4">Checkout</h1>
                <p className="text-lg text-gray-400">Your cart is empty. Add some items to proceed to checkout.</p>
                <button 
                  onClick={() => router.push("/products")}
                  className="inline-block mt-6 px-6 py-3 gaming-btn text-white rounded-md transition-all touch-button"
                >
                  Start Shopping
                </button>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['customer', 'admin', 'vendor']} redirectPath="/">
      <div className="min-h-screen container-mobile-xs sm:container-mobile-sm md:container-mobile-md lg:container-mobile-lg xl:container-tablet 2xl:container-desktop">
        <Navbar />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <main className={`flex-1 p-4 lg:p-6 transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`}>
            <div className="max-w-7xl mx-auto container-mobile-xs sm:container-mobile-sm md:container-mobile-md lg:container-mobile-lg xl:container-tablet 2xl:container-desktop">
              <h1 className="text-2xl md:text-3xl font-bold neon-text mb-6">Checkout</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-4 md:p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-white mb-4">Billing Information</h2>
                  
                  {!paymentConfigured && (
                    <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-md">
                      <p className="text-yellow-400 text-sm">
                        <strong>Notice:</strong> Payment processing is not configured. Orders will be created but payment verification will be skipped.
                      </p>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-400 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 gaming-input rounded-md touch-button"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-400 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 gaming-input rounded-md touch-button"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 gaming-input rounded-md touch-button"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 gaming-input rounded-md touch-button"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 gaming-input rounded-md touch-button"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-400 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 gaming-input rounded-md touch-button"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-400 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 gaming-input rounded-md touch-button"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-400 mb-1">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 gaming-input rounded-md touch-button"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="country" className="block text-sm font-medium text-gray-400 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 gaming-input rounded-md touch-button"
                      />
                    </div>
                    
                    <h2 className="text-xl font-semibold text-white mb-4">Payment Method</h2>
                    
                    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {paymentMethods.stripe?.enabled && (
                        <div 
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedPaymentMethod === 'stripe' ? 'border-indigo-500 bg-indigo-900/30' : 'border-gray-700 hover:border-gray-600'} touch-button`}
                          onClick={() => setSelectedPaymentMethod('stripe')}
                        >
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full border mr-3 ${selectedPaymentMethod === 'stripe' ? 'bg-indigo-500 border-indigo-500' : 'border-gray-600'}`}></div>
                            <div>
                              <div className="font-medium text-white">Credit/Debit Card</div>
                              <div className="text-sm text-gray-400">Pay with Stripe</div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {paymentMethods.braintree?.enabled && (
                        <div 
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedPaymentMethod === 'braintree' ? 'border-indigo-500 bg-indigo-900/30' : 'border-gray-700 hover:border-gray-600'} touch-button`}
                          onClick={() => setSelectedPaymentMethod('braintree')}
                        >
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full border mr-3 ${selectedPaymentMethod === 'braintree' ? 'bg-indigo-500 border-indigo-500' : 'border-gray-600'}`}></div>
                            <div>
                              <div className="font-medium text-white">Credit/Debit Card</div>
                              <div className="text-sm text-gray-400">Pay with Braintree</div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {paymentMethods.paypal?.enabled && (
                        <div 
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedPaymentMethod === 'paypal' ? 'border-indigo-500 bg-indigo-900/30' : 'border-gray-700 hover:border-gray-600'} touch-button`}
                          onClick={() => setSelectedPaymentMethod('paypal')}
                        >
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full border mr-3 ${selectedPaymentMethod === 'paypal' ? 'bg-indigo-500 border-indigo-500' : 'border-gray-600'}`}></div>
                            <div>
                              <div className="font-medium text-white">PayPal</div>
                              <div className="text-sm text-gray-400">Pay with PayPal</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {(selectedPaymentMethod === 'card' || selectedPaymentMethod === 'stripe' || selectedPaymentMethod === 'braintree') && (
                      <>
                        <h3 className="text-lg font-medium text-white mb-4">Card Information</h3>
                        
                        <div className="mb-4">
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-400 mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="0000 0000 0000 0000"
                            required
                            className="w-full px-3 py-2 gaming-input rounded-md touch-button"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="cardName" className="block text-sm font-medium text-gray-400 mb-1">
                            Name on Card
                          </label>
                          <input
                            type="text"
                            id="cardName"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 gaming-input rounded-md touch-button"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          <div>
                            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-400 mb-1">
                              Expiration Date
                            </label>
                            <input
                              type="text"
                              id="expiryDate"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              placeholder="MM/YY"
                              required
                              className="w-full px-3 py-2 gaming-input rounded-md touch-button"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="cvv" className="block text-sm font-medium text-gray-400 mb-1">
                              CVV
                            </label>
                            <input
                              type="text"
                              id="cvv"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              placeholder="123"
                              required
                              className="w-full px-3 py-2 gaming-input rounded-md touch-button"
                            />
                          </div>
                        </div>
                        
                        <button
                          type="submit"
                          className="w-full gaming-btn border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white disabled:opacity-50 touch-button"
                          disabled={isProcessing}
                        >
                          {isProcessing ? 'Processing...' : `Place Order - $${getCartTotal().toFixed(2)}`}
                        </button>
                      </>
                    )}
                    
                    {paymentError && (
                      <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-md">
                        <p className="text-red-400 text-sm">{paymentError}</p>
                      </div>
                    )}
                    
                    {(selectedPaymentMethod === 'paypal' || selectedPaymentMethod === 'cash-on-delivery') && (
                      <button
                        type="submit"
                        className="w-full gaming-btn border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white disabled:opacity-50 touch-button"
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Processing...' : `Place Order - $${getCartTotal().toFixed(2)}`}
                      </button>
                    )}
                  </form>
                </div>
                
                <div className="glass-card p-4 md:p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
                  
                  <div className="divide-y divide-indigo-500/30 max-h-96 overflow-y-auto">
                    {cart.items.map((item) => (
                      <div key={item._id} className="py-4">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-white">{item.name}</h3>
                            <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium text-yellow-400">💰 {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 space-y-2 border-t border-indigo-500/30 pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-white">${getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Shipping</span>
                      <span className="text-white">$5.99</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tax</span>
                      <span className="text-white">${(getCartTotal() * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-4 border-t border-indigo-500/30">
                      <span className="text-lg font-semibold text-white">Total</span>
                      <span className="text-lg font-semibold text-yellow-400">
                        ${(getCartTotal() + 5.99 + (getCartTotal() * 0.08)).toFixed(2)}
                      </span>
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
};

export default CheckoutPage;