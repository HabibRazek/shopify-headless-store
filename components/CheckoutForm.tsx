'use client';

import { useState } from 'react';
import { useShopContext } from '@/context/ShopContext';
import { formatPrice } from '@/lib/utils';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethod: 'cashOnDelivery' | 'bankTransfer';
  notes: string;
  bankReceipt?: File;
};

type FormErrors = {
  [key in keyof FormData]?: string;
};

export default function CheckoutForm({ onClose }: { onClose: () => void }) {
  const { cart, clearCart } = useShopContext();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    paymentMethod: 'cashOnDelivery',
    notes: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [shopifyOrderCreated, setShopifyOrderCreated] = useState(false);
  const [bankReceipt, setBankReceipt] = useState<File | null>(null);

  // Delivery fee in TND
  const deliveryFee = 8;

  // Calculate subtotal (items only)
  const subtotal = cart.reduce(
    (total, item) => total + parseFloat(item.price) * item.quantity,
    0
  );

  // Calculate cart total (including delivery fee)
  const cartTotal = subtotal + deliveryFee;

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';
    if (!formData.country) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Create FormData for file upload support
      const submitData = new FormData();
      submitData.append('customerInfo', JSON.stringify(formData));
      submitData.append('cart', JSON.stringify(cart));

      // Add bank receipt if provided
      if (bankReceipt) {
        submitData.append('bankReceipt', bankReceipt);
      }

      // Send the order to our API endpoint
      const response = await fetch('/api/order', {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error completing checkout');
      }

      if (!data.success) {
        throw new Error(data.error || 'Order creation failed');
      }

      // Set the order number from the response
      setOrderNumber(data.order?.orderNumber || 'N/A');

      // Check if the order was created in Shopify
      setShopifyOrderCreated(!!data.shopifyOrder);

      // Show success message
      setIsSuccess(true);

      // Clear cart after successful order
      clearCart();

      // Store order in localStorage for reference
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(data.order);
      localStorage.setItem('orders', JSON.stringify(orders));

      console.log('Order created successfully:', data);

    } catch (error) {
      console.error('Error submitting order:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // State for checkout URL
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  // Success screen
  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you for your order!</h2>
        <p className="text-gray-600 mb-6">Your order number is: <span className="font-semibold">{orderNumber}</span></p>

        {shopifyOrderCreated ? (
          <div className="bg-green-50 p-4 rounded-lg mb-6 text-left border border-green-200">
            <div className="flex items-center mb-2">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-md font-medium text-green-800">Order Created in Shopify</h3>
            </div>
            <p className="text-sm text-green-700">
              Your order has been successfully created in our Shopify store and is being processed.
            </p>
          </div>
        ) : (
          <div className="bg-green-50 p-4 rounded-lg mb-6 text-left border border-green-200">
            <div className="flex items-center mb-2">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-md font-medium text-green-800">Order Received</h3>
            </div>
            <p className="text-sm text-green-700">
              Your order has been successfully created in our system and is ready for processing.
              A draft order has been created in our Shopify store with your order details, including the 8 TND delivery fee.
            </p>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
          <h3 className="text-md font-medium text-gray-900 mb-2">Order Details:</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Payment Method:</strong> Cash on Delivery
            </p>
            <p className="text-sm text-gray-600">
              <strong>Delivery Address:</strong> {formData.address}, {formData.city}, {formData.state}, {formData.postalCode}, {formData.country}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Delivery Fee:</strong> {formatPrice("8", "TND")}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Total Amount:</strong> {formatPrice(String(cartTotal), "TND")}
            </p>
          </div>
        </div>
        <p className="text-gray-600 mb-8">We'll contact you soon to confirm your order and delivery details.</p>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
        <div className="space-y-3 mb-4">
          {cart.map((item) => (
            <div key={item.variantId} className="flex justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {formatPrice(String(parseFloat(item.price) * item.quantity), 'TND')}
              </p>
            </div>
          ))}
        </div>
        <div className="pt-4 flex justify-between text-sm">
          <p className="text-gray-600">Subtotal</p>
          <p className="text-gray-900">{formatPrice(String(subtotal), 'TND')}</p>
        </div>
        <div className="pt-2 flex justify-between text-sm">
          <p className="text-gray-600">Delivery Fee</p>
          <p className="text-gray-900">{formatPrice(String(deliveryFee), 'TND')}</p>
        </div>
        <div className="border-t border-gray-200 mt-2 pt-4 flex justify-between">
          <p className="text-base font-medium text-gray-900">Total</p>
          <p className="text-base font-medium text-gray-900">{formatPrice(String(cartTotal), 'TND')}</p>
        </div>
      </div>

      {/* Personal information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.firstName ? 'border-red-300' : ''
              }`}
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.lastName ? 'border-red-300' : ''
              }`}
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.email ? 'border-red-300' : ''
              }`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.phone ? 'border-red-300' : ''
              }`}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* Shipping information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h3>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.address ? 'border-red-300' : ''
              }`}
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.city ? 'border-red-300' : ''
              }`}
            />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State / Province
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.state ? 'border-red-300' : ''
              }`}
            />
            {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
              Postal code
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.postalCode ? 'border-red-300' : ''
              }`}
            />
            {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>}
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.country ? 'border-red-300' : ''
              }`}
            >
              <option value="">Select a country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="TN">Tunisia</option>
              <option value="FR">France</option>
              <option value="DE">Germany</option>
              <option value="UK">United Kingdom</option>
            </select>
            {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Order Notes (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Payment method */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Mode de paiement</h3>
        <div className="mt-4 space-y-4">
          <div className="flex items-center">
            <input
              id="cashOnDelivery"
              name="paymentMethod"
              type="radio"
              checked={formData.paymentMethod === 'cashOnDelivery'}
              onChange={handleChange}
              value="cashOnDelivery"
              className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="cashOnDelivery" className="ml-3 block text-sm font-medium text-gray-700">
              Paiement à la livraison
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="bankTransfer"
              name="paymentMethod"
              type="radio"
              checked={formData.paymentMethod === 'bankTransfer'}
              onChange={handleChange}
              value="bankTransfer"
              className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="bankTransfer" className="ml-3 block text-sm font-medium text-gray-700">
              Virement bancaire
            </label>
          </div>

          {/* Bank Transfer Details */}
          {formData.paymentMethod === 'bankTransfer' && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-3">Informations bancaires</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Banque:</p>
                  <p className="text-gray-600">Banque Internationale Arabe de Tunisie</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Bénéficiaire:</p>
                  <p className="text-gray-600">ZIPBAGS SARL</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">RIB:</p>
                  <p className="text-gray-600 font-mono">08 006 0123456789 12</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Code SWIFT:</p>
                  <p className="text-gray-600 font-mono">BIATTNTT</p>
                </div>
              </div>

              {/* File Upload for Bank Receipt */}
              <div className="mt-4">
                <label htmlFor="bankReceipt" className="block text-sm font-medium text-gray-700 mb-2">
                  Reçu de virement (optionnel)
                </label>
                <div className="border-2 border-dashed border-green-300 rounded-lg p-4 text-center">
                  <input
                    id="bankReceipt"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setBankReceipt(file);
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('bankReceipt')?.click()}
                    className="inline-flex items-center px-4 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Sélectionner un fichier
                  </button>
                  {bankReceipt && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {bankReceipt.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit button */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </form>
  );
}
