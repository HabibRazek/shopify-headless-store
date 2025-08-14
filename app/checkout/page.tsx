'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserIcon, Sparkles, Upload, X, FileImage } from 'lucide-react';
import { toast } from 'sonner';
import { InlineLoader } from '@/components/ui/loader';
import CheckoutPopup from '@/components/CheckoutPopup';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { cartItems, clearCart, cartTotal } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cash',
  });
  const [bankReceipt, setBankReceipt] = useState<File | null>(null);
  const [bankReceiptPreview, setBankReceiptPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [showInnovativeCheckout, setShowInnovativeCheckout] = useState(false);

  // Delivery fee in TND
  const deliveryFee = 8;
  const totalWithDelivery = cartTotal + deliveryFee;

  // Fetch user profile data if logged in
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (status === 'authenticated' && session?.user) {
        setIsLoadingUserData(true);
        try {
          const response = await fetch('/api/user/profile');
          if (response.ok) {
            const data = await response.json();
            const user = data.user;

            if (!user) {
              throw new Error('User data not found');
            }

            // Split name into first and last name
            let firstName = '';
            let lastName = '';

            if (user.name) {
              const nameParts = user.name.split(' ');
              firstName = nameParts[0] || '';
              lastName = nameParts.slice(1).join(' ') || '';
            }

            // Update form data with user profile information
            setFormData({
              firstName,
              lastName,
              email: user.email || '',
              phone: user.phone || '',
              address: user.address || '',
              city: user.city || '',
              postalCode: user.postalCode || '',
              paymentMethod: 'cash',
            });

            setUserDataLoaded(true);

            // Show success toast notification with Sonner
            toast.success('Profil chargé', {
              description: 'Vos informations ont été chargées automatiquement',
              duration: 3000,
            });
          } else {
            throw new Error('Failed to load profile data');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          toast.error('Erreur', {
            description: 'Impossible de charger vos informations de profil',
            duration: 5000,
          });
        } finally {
          setIsLoadingUserData(false);
        }
      }
    };

    fetchUserProfile();
  }, [session, status]);

  // Redirect to home if cart is empty or user is not logged in
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/');
    }

    // Redirect to login if user is not authenticated
    if (status === 'unauthenticated') {
      toast.error('Connexion requise', {
        description: 'Vous devez être connecté pour passer une commande',
        duration: 5000,
      });
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent('/checkout')}`);
    }
  }, [cartItems, router, status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    const fileInput = document.getElementById('bankReceiptCheckout') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Le numéro de téléphone est requis';
    if (!formData.address.trim()) newErrors.address = 'L\'adresse est requise';
    if (!formData.city.trim()) newErrors.city = 'La ville est requise';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Prepare customer info for the API
      const customerInfo = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.postalCode ? formData.postalCode.substring(0, 2) : 'NJ', // Use first 2 digits of postal code as state
        postalCode: formData.postalCode,
        country: 'TN', // Default to Tunisia
        paymentMethod: formData.paymentMethod === 'bankTransfer' ? 'Virement bancaire' : 'Paiement à la livraison',
        notes: ''
      };

      // Format cart items for the API
      const cartItemsFormatted = cartItems.map(item => ({
        variantId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.imageUrl
      }));

      // Create order data for the API
      const orderData = {
        customerInfo,
        paymentMethod: formData.paymentMethod,
        cart: cartItemsFormatted,
        userId: session?.user?.id || null
      };

      console.log('Submitting order to API:', orderData);

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

      const result = await response.json();
      console.log('Order API response:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create order');
      }

      if (!result.success) {
        throw new Error(result.error || 'Order creation failed');
      }

      // Store order details in localStorage for the success page
      localStorage.setItem('lastOrder', JSON.stringify(result));

      // Clear cart after successful order
      clearCart();

      // Generate a random order number if not provided
      const orderNumber = result.order?.orderNumber ||
                         Math.floor(100000 + Math.random() * 900000).toString();

      // Redirect to success page with order number
      window.location.href = `/checkout/success?order=${orderNumber}`;
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Erreur', {
        description: 'Une erreur est survenue lors du traitement de votre commande. Veuillez réessayer.',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return <div className="text-center py-10">Chargement...</div>;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/collections" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continuer les achats
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mt-2">Paiement</h1>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Récapitulatif de la commande</h2>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex py-4 items-center">
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {formatPrice(item.price, item.currency)} x {item.quantity}
                      </p>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(parseFloat(item.price) * item.quantity, item.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Sous-total</p>
                  <p className="font-medium text-gray-900">{formatPrice(cartTotal, 'TND')}</p>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <p className="text-gray-600">Frais de livraison</p>
                  <p className="font-medium text-gray-900">{formatPrice(deliveryFee, 'TND')}</p>
                </div>
                <div className="flex justify-between text-base font-medium mt-4">
                  <p className="text-gray-900">Total</p>
                  <p className="text-gray-900">{formatPrice(totalWithDelivery, 'TND')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-3">
            {status === 'authenticated' && userDataLoaded && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="text-sm font-medium text-green-800">Informations de profil chargées</h3>
                </div>
                <p className="mt-1 text-xs text-green-700">
                  Vos informations de profil ont été automatiquement remplies. Vous pouvez les modifier si nécessaire.
                </p>
              </div>
            )}

            {status === 'authenticated' && isLoadingUserData && (
              <div className="mb-6">
                <InlineLoader text="Chargement de vos informations de profil..." />
              </div>
            )}

            {status === 'unauthenticated' && (
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-800">Non connecté</h3>
                </div>
                <p className="mt-1 text-xs text-gray-700">
                  <Link href={`/auth/signin?callbackUrl=${encodeURIComponent('/checkout')}`} className="text-green-600 hover:text-green-500 font-medium">
                    Connectez-vous
                  </Link> pour utiliser vos informations de profil enregistrées.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm ${errors.firstName ? 'border-red-500' : ''}`}
                    />
                    {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm ${errors.lastName ? 'border-red-500' : ''}`}
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm ${errors.phone ? 'border-red-500' : ''}`}
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Adresse
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm ${errors.address ? 'border-red-500' : ''}`}
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                  </div>

                  {/* City */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      Ville
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm ${errors.city ? 'border-red-500' : ''}`}
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                      Code Postal
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    />
                  </div>

                  {/* Payment Method */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Mode de Paiement
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          id="cash"
                          name="paymentMethod"
                          type="radio"
                          checked={formData.paymentMethod === 'cash'}
                          onChange={handleInputChange}
                          value="cash"
                          className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <label htmlFor="cash" className="ml-3 block text-sm font-medium text-gray-700">
                          Paiement à la livraison
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="bankTransfer"
                          name="paymentMethod"
                          type="radio"
                          checked={formData.paymentMethod === 'bankTransfer'}
                          onChange={handleInputChange}
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
                              <div className="border-2 border-dashed border-green-300 rounded-lg p-4 text-center">
                                <input
                                  type="file"
                                  id="bankReceiptCheckout"
                                  accept="image/*"
                                  onChange={handleFileUpload}
                                  className="hidden"
                                />
                                <label
                                  htmlFor="bankReceiptCheckout"
                                  className="cursor-pointer flex flex-col items-center gap-3"
                                >
                                  <Upload className="h-8 w-8 text-green-600" />
                                  <div className="text-sm">
                                    <p className="font-medium text-green-800">Cliquez pour ajouter votre reçu</p>
                                    <p className="text-green-600 mt-1">JPG, PNG, WEBP (max 5MB)</p>
                                  </div>
                                </label>
                              </div>
                            ) : (
                              <div className="relative border border-green-200 rounded-lg p-3 bg-white">
                                <div className="flex items-center gap-4">
                                  <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                    <Image
                                      src={bankReceiptPreview}
                                      alt="Justificatif de virement"
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-green-800">
                                      {bankReceipt?.name}
                                    </p>
                                    <p className="text-sm text-green-600">
                                      {bankReceipt && (bankReceipt.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={removeBankReceipt}
                                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                                  >
                                    <X className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                            )}

                            <p className="text-xs text-green-700 flex items-center gap-1">
                              <FileImage className="h-3 w-3" />
                              Ajoutez une photo de votre reçu de virement (optionnel)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  {/* Innovative Checkout Button */}
                  <Button
                    type="button"
                    onClick={() => setShowInnovativeCheckout(true)}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Essayer le nouveau checkout
                  </Button>

                  {/* Traditional Checkout Button */}
                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Traitement en cours...' : 'Passer la commande (traditionnel)'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Innovative Checkout Popup */}
      <CheckoutPopup
        isOpen={showInnovativeCheckout}
        onClose={() => setShowInnovativeCheckout(false)}
      />
    </div>
  );
}
