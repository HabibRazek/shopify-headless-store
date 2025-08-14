'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { Check, Upload, X, FileImage } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

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
};

type FormErrors = {
  [key in keyof FormData]?: string;
};

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CheckoutDialog({ open, onOpenChange }: CheckoutDialogProps) {
  const { cartItems, clearCart, cartTotal } = useCart();

  // Debug cart state
  useEffect(() => {
    if (open) {
      console.log('CheckoutDialog: Cart state:', cartItems);
    }
  }, [open, cartItems]);

  // Prevent opening the checkout dialog if cart is empty
  useEffect(() => {
    if (open) {
      // Check if cart exists and has items
      const hasItems = Array.isArray(cartItems) && cartItems.length > 0;

      if (!hasItems) {
        console.log('CheckoutDialog: Cart is empty or invalid:', cartItems);
        toast.error('Empty Cart', {
          description: 'Your cart is empty. Please add items to your cart before checking out.',
          duration: 5000,
        });
        onOpenChange(false);
      } else {
        console.log('CheckoutDialog: Cart has items:', cartItems.length);
      }
    }
  }, [open, cartItems, onOpenChange]);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'TN', // Default to Tunisia
    paymentMethod: 'cashOnDelivery',
    notes: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [shopifyOrderCreated, setShopifyOrderCreated] = useState(false);
  const [bankReceipt, setBankReceipt] = useState<File | null>(null);
  const [bankReceiptPreview, setBankReceiptPreview] = useState<string | null>(null);

  // Delivery fee in TND
  const deliveryFee = 8;

  // Calculate subtotal (items only) - cartTotal is already provided by useCart()
  const subtotal = cartTotal;

  // Calculate total with delivery fee
  const totalWithDelivery = subtotal + deliveryFee;

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Format non supporté', {
          description: 'Veuillez sélectionner une image (JPG, PNG, WEBP)',
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Fichier trop volumineux', {
          description: 'La taille maximale autorisée est de 5MB',
        });
        return;
      }

      setBankReceipt(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setBankReceiptPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      toast.success('Reçu ajouté', {
        description: 'Votre justificatif de virement a été ajouté avec succès',
      });
    }
  };

  const removeBankReceipt = () => {
    setBankReceipt(null);
    setBankReceiptPreview(null);
    // Reset file input
    const fileInput = document.getElementById('bankReceiptDialog') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
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
      // Log cart data for debugging
      console.log('Submitting order with cart:', cartItems);

      // Make sure cart is an array and has items
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        throw new Error('Your cart is empty. Please add items to your cart before checking out.');
      }

      // Convert CartContext items to the format expected by the API
      const validatedCart = cartItems.map(item => {
        console.log('Processing cart item:', item);

        if (!item.id || !item.title || !item.price || !item.quantity) {
          console.error('Invalid cart item:', item);
          throw new Error('One or more items in your cart are invalid. Please try refreshing the page.');
        }

        // Convert CartContext item to the format expected by the API
        return {
          variantId: item.id, // Use id as variantId
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.imageUrl || ''
        };
      });

      console.log('Validated cart:', validatedCart);

      // Prepare order data
      const orderData = {
        customerInfo: formData,
        cart: validatedCart
      };

      let response;

      // If bank transfer with file, use FormData
      if (formData.paymentMethod === 'bankTransfer' && bankReceipt) {
        const formDataToSend = new FormData();
        formDataToSend.append('orderData', JSON.stringify(orderData));
        formDataToSend.append('bankReceipt', bankReceipt);

        response = await fetch('/api/order', {
          method: 'POST',
          body: formDataToSend,
        });
      } else {
        // Regular JSON request
        response = await fetch('/api/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });
      }

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

      // Show success toast
      toast.success('Order placed successfully', {
        description: `Your order #${data.order?.orderNumber || 'N/A'} has been placed.`,
        icon: <Check className="h-4 w-4 text-green-500" />,
        duration: 5000,
      });

      console.log('Order created successfully:', data);

    } catch (error) {
      console.error('Error submitting order:', error);

      // Get the error message
      const errorMessage = error instanceof Error
        ? error.message
        : 'There was an error processing your order. Please try again.';

      toast.error('Error', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Only reset if not in the middle of submitting
      if (!isSubmitting) {
        setIsSuccess(false);
        setErrors({});
      }
    }
    onOpenChange(open);
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Thank you for your order!</DialogTitle>
            <DialogDescription className="text-center">
              Your order number is: <span className="font-semibold">{orderNumber}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {shopifyOrderCreated ? (
              <div className="bg-green-50 p-4 rounded-lg mb-6 text-left border border-green-200">
                <div className="flex items-center mb-2">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="text-md font-medium text-green-800">Order Created in Shopify</h3>
                </div>
                <p className="text-sm text-green-700">
                  Your order has been successfully created in our Shopify store and is being processed.
                </p>
              </div>
            ) : (
              <div className="bg-green-50 p-4 rounded-lg mb-6 text-left border border-green-200">
                <div className="flex items-center mb-2">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
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
            <p className="text-gray-600 mb-8 text-center">We'll contact you soon to confirm your order and delivery details.</p>
          </div>

          <DialogFooter>
            <Button
              onClick={() => handleOpenChange(false)}
              className="w-full"
            >
              Continue Shopping
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            Complete your order by filling out the information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Order summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
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
              <p className="text-base font-medium text-gray-900">{formatPrice(String(totalWithDelivery), 'TND')}</p>
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
                  className={`mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm ${
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
                  className={`mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm ${
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
                  className={`mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm ${
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
                  className={`mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm ${
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
                  className={`mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm ${
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
                  className={`mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm ${
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
                  className={`mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm ${
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
                  className={`mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm ${
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
                  className={`mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm ${
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
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm"
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
                  <div className="flex items-center gap-3 mb-4">
                    <Image
                      src="/amen_bank.jpg"
                      alt="AMEN Bank"
                      width={60}
                      height={40}
                      className="object-contain"
                    />
                    <h4 className="font-medium text-green-800">Informations bancaires</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">Banque:</p>
                      <p className="text-gray-600">AMEN BANK</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Agence:</p>
                      <p className="text-gray-600">AGENCE NABEUL 47 Av. Habib Thameur, Nabeul</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Titulaire du compte:</p>
                      <p className="text-gray-600">Ste KWD 'Kings Worldwide Distribution'</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">RIB:</p>
                      <p className="text-gray-600 font-mono bg-white px-2 py-1 rounded border select-all">07 300 0006 101 120 410 71</p>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-xs text-yellow-800">
                      <strong>Important:</strong> Veuillez mentionner votre nom et numéro de commande dans le motif du virement.
                      Votre commande sera traitée après réception du paiement.
                    </p>
                  </div>

                  {/* File Upload Section */}
                  <div className="mt-4 space-y-3">
                    <h5 className="font-medium text-green-800 text-sm">Justificatif de virement</h5>

                    {!bankReceiptPreview ? (
                      <div className="border-2 border-dashed border-green-300 rounded-lg p-3 text-center">
                        <input
                          type="file"
                          id="bankReceiptDialog"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="bankReceiptDialog"
                          className="cursor-pointer flex flex-col items-center gap-2"
                        >
                          <Upload className="h-6 w-6 text-green-600" />
                          <div className="text-xs">
                            <p className="font-medium text-green-800">Cliquez pour ajouter</p>
                            <p className="text-green-600">JPG, PNG, WEBP (max 5MB)</p>
                          </div>
                        </label>
                      </div>
                    ) : (
                      <div className="relative border border-green-200 rounded-lg p-2 bg-white">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={bankReceiptPreview}
                              alt="Justificatif de virement"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs text-green-800">
                              {bankReceipt?.name}
                            </p>
                            <p className="text-xs text-green-600">
                              {bankReceipt && (bankReceipt.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={removeBankReceipt}
                            className="p-1 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-green-700">
                      <FileImage className="h-3 w-3 inline mr-1" />
                      Ajoutez une photo de votre reçu de virement (optionnel)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
