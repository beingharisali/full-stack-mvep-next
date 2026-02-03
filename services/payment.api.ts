import http from "./http";

export interface PaymentMethod {
  enabled: boolean;
  name: string;
  description: string;
}

export interface PaymentMethodsResponse {
  stripe?: PaymentMethod;
  braintree?: PaymentMethod;
  paypal?: PaymentMethod;
  'cash-on-delivery'?: PaymentMethod;
}

export interface ProcessPaymentRequest {
  amount: number;
  orderId?: string;
  [key: string]: any; 
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  amount: number;
  status: string;
  [key: string]: any;
}

export interface BraintreeTokenResponse {
  clientToken: string;
}

export interface VerifyPaymentRequest {
  transactionId: string;
  paymentMethod: string;
}

export interface PaymentVerificationResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
}

export async function getPaymentMethods(): Promise<PaymentMethodsResponse> {
  const res = await http.get("/payment/methods");
  return res.data;
}

export async function getBraintreeToken(): Promise<BraintreeTokenResponse> {
  const res = await http.get("/payment/braintree/token");
  return res.data;
}

export async function processStripePayment(data: ProcessPaymentRequest): Promise<PaymentResponse> {
  const res = await http.post("/payment/stripe", data);
  return res.data;
}

export async function processBraintreePayment(data: ProcessPaymentRequest): Promise<PaymentResponse> {
  const res = await http.post("/payment/braintree", data);
  return res.data;
}

export async function processPayPalPayment(data: ProcessPaymentRequest): Promise<PaymentResponse> {
  const res = await http.post("/payment/paypal", data);
  return res.data;
}

export async function processCashOnDelivery(orderId: string): Promise<PaymentResponse> {
  const res = await http.post("/payment/cod", { orderId });
  return res.data;
}

export async function verifyPayment(data: VerifyPaymentRequest): Promise<PaymentVerificationResponse> {
  const res = await http.post("/payment/verify", data);
  return res.data;
}

export function formatAmountForPayment(amount: number): number {
  return Math.round(amount * 100) / 100; 
}

export function validateCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s+/g, '');
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i));
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

export function validateExpiryDate(expiry: string): boolean {
  const [month, year] = expiry.split('/').map(part => parseInt(part.trim()));
  
  if (!month || !year || month < 1 || month > 12) {
    return false;
  }
  
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }
  
  return true;
}

export function validateCVV(cvv: string, cardNumber: string): boolean {
  const cleanedCVV = cvv.replace(/\s+/g, '');
  const isAmex = /^3[47]/.test(cardNumber.replace(/\s+/g, ''));
  const expectedLength = isAmex ? 4 : 3;
  
  return cleanedCVV.length === expectedLength && /^\d+$/.test(cleanedCVV);
}