'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPrice, getProductImage } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import ImageGallery from '@/components/ImageGallery';
import { ShopifyProduct } from '@/types/shopify';
import { toast } from 'sonner';
import { Check } from 'lucide-react';
import CheckoutDialog from '@/components/CheckoutDialog';
import { FullScreenLoader } from '@/components/ui/loader';

export default function ProductPage() {
  // State for product data and UI
  const [handle, setHandle] = useState<string>('');
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);

  // Get cart functions from context
  const { addToCart } = useCart();

  // Extract handle from URL
  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const handleFromUrl = pathParts[pathParts.length - 1];
    const cleanedHandle = handleFromUrl.replace('™', '');
    setHandle(cleanedHandle);
  }, []);

  // Fetch product data
  useEffect(() => {
    async function fetchProduct() {
      if (!handle) return;

      try {
        const encodedHandle = encodeURIComponent(handle);
        const response = await fetch(`/api/products/${encodedHandle}`);
        const data = await response.json();

        if (data.product) {
          setProduct(data.product);
          setIsError(false);
        } else {
          setIsError(true);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [handle]);

  // Set first variant as default
  useEffect(() => {
    if (product && !selectedVariant) {
      const variants = product.variants?.edges || [];
      const firstVariant = variants[0]?.node;
      if (firstVariant) {
        setSelectedVariant(firstVariant.id);
      }
    }
  }, [product, selectedVariant]);

  // Loading state
  if (isLoading) {
    return <FullScreenLoader />;
  }

  // Error state
  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">We could not find the product you&apos;re looking for.</p>
        <Link
          href="/"
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  // Extract product data
  const variants = product.variants?.edges || [];
  const firstVariant = variants[0]?.node;
  const images = product.images?.edges || [];

  // Get current variant
  const currentVariant = variants.find(
    (v) => v.node.id === selectedVariant
  )?.node || firstVariant;

  // Get price and currency
  const price = currentVariant?.price?.amount || product.priceRange.minVariantPrice.amount;
  const currency = currentVariant?.price?.currencyCode || product.priceRange.minVariantPrice.currencyCode;

  // Add to cart function
  const handleAddToCart = () => {
    if (!currentVariant) return;

    try {
      // Format the item for CartContext
      addToCart({
        id: currentVariant.id,
        title: `${product.title} - ${currentVariant.title}`,
        price: currentVariant.price.amount,
        currency: currency,
        imageUrl: getProductImage(product),
        handle: handle,
      }, quantity); // Pass the selected quantity

      // Show toast notification
      toast.success('Added to cart', {
        description: `${quantity} x ${product.title} - ${currentVariant.title} has been added to your cart.`,
        icon: <Check className="h-4 w-4 text-green-500" />,
        position: 'top-right',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast.error('Error', {
        description: 'There was an error adding the product to your cart. Please try again.',
        position: 'top-right',
        duration: 5000,
      });
    }
  };

  // Buy now function
  const handleBuyNow = () => {
    if (!currentVariant) return;

    try {
      // Add to cart first
      addToCart({
        id: currentVariant.id,
        title: `${product.title} - ${currentVariant.title}`,
        price: currentVariant.price.amount,
        currency: currency,
        imageUrl: getProductImage(product),
        handle: handle,
      }, quantity); // Pass the selected quantity

      // Show checkout form
      setShowCheckout(true);
    } catch (error) {
      console.error('Error processing buy now:', error);
      toast.error('Error', {
        description: 'There was an error processing your request. Please try again.',
        position: 'top-right',
        duration: 5000,
      });
    }
  };

  return (
    <div className="bg-white mt-36">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:max-w-7xl lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-gray-900">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12">
          {/* Image gallery */}
          <ImageGallery images={images} productTitle={product.title} />

          {/* Enhanced Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            {/* Enhanced Product Title */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-700">PRODUIT PREMIUM</span>
              </div>

              <h1 className="text-3xl sm:text-3xl lg:text-4xl font-black tracking-tight text-gray-900 leading-tight mb-4">
                {product.title}
              </h1>

              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-700 rounded-full"></div>
            </div>

            {/* Enhanced Price Display */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl sm:text-4xl font-bold text-green-700 mb-2">
                      {formatPrice(price, currency)}
                    </p>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                      </svg>
                      <span className="text-sm font-semibold text-green-600">Prix TTC </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Description */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Description du Produit
              </h3>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed
                    [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-gray-900 [&>h1]:mb-4
                    [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:text-gray-800 [&>h2]:mb-3 [&>h2]:mt-6
                    [&>h3]:text-lg [&>h3]:font-medium [&>h3]:text-gray-800 [&>h3]:mb-2 [&>h3]:mt-4
                    [&>p]:text-base [&>p]:mb-4 [&>p]:leading-relaxed
                    [&>ul]:space-y-2 [&>ul]:mb-4
                    [&>li]:flex [&>li]:items-start [&>li]:gap-3
                    [&>li]:before:content-['•'] [&>li]:before:text-green-500 [&>li]:before:font-bold [&>li]:before:text-lg [&>li]:before:flex-shrink-0
                    [&>strong]:font-semibold [&>strong]:text-gray-900 [&>strong]:bg-yellow-100 [&>strong]:px-1 [&>strong]:rounded"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              </div>
            </div>

            {/* Enhanced Variants */}
            {variants.length > 1 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  Options Disponibles
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {variants.map((variant) => (
                    <button
                      key={variant.node.id}
                      type="button"
                      className={`relative inline-flex items-center justify-center rounded-xl px-6 py-4 text-sm font-semibold transition-all duration-300 ${
                        selectedVariant === variant.node.id
                          ? 'bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] text-white shadow-lg transform scale-105'
                          : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 shadow-sm hover:shadow-md'
                      }`}
                      onClick={() => setSelectedVariant(variant.node.id)}
                    >
                      {selectedVariant === variant.node.id && (
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {variant.node.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Quantity selector */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                  </svg>
                </div>
                Quantité
              </h3>

              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-center max-w-xs mx-auto">
                  <button
                    type="button"
                    className="w-12 h-12 rounded-l-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 flex items-center justify-center"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <span className="sr-only">Diminuer la quantité</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                    </svg>
                  </button>

                  <div className="w-20 h-12 border-t-2 border-b-2 border-green-300 bg-green-50 flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-800">{quantity}</span>
                  </div>

                  <button
                    type="button"
                    className="w-12 h-12 rounded-r-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 flex items-center justify-center"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <span className="sr-only">Augmenter la quantité</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-green-700">Stock disponible</span> • Commande minimum: 1 unité
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Action buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                className="flex-1 flex items-center justify-center rounded-xl bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] hover:from-green-800 hover:via-green-600 hover:to-[#77db19] text-white font-bold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-green-300"
                onClick={handleAddToCart}
              >
                {/* Enhanced background shine */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />

                <HiOutlineShoppingBag className="mr-3 h-6 w-6 relative z-10" />
                <span className="relative z-10">Ajouter au Panier</span>
              </button>

              <button
                type="button"
                className="flex-1 flex items-center justify-center rounded-xl border-2 border-green-500 bg-white hover:bg-green-50 px-8 py-4 text-lg font-bold text-green-700 hover:text-green-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-green-300 relative overflow-hidden group"
                onClick={handleBuyNow}
              >
                {/* Subtle background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-green-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <svg className="mr-3 h-6 w-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="relative z-10">Acheter Maintenant</span>
              </button>
            </div>

            {/* Enhanced Product Features */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100 shadow-sm">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                <span className="text-sm font-semibold text-green-800">En Stock</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100 shadow-sm">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm font-semibold text-green-800">Livraison 24-48h</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100 shadow-sm">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
                <span className="text-sm font-semibold text-green-800">Qualité Garantie</span>
              </div>
            </div>



            {/* Product details */}
            <div className="mt-10 border-t border-gray-200 pt-10">
              <h3 className="text-sm font-medium text-gray-900">Details</h3>
              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Enhanced Shipping information */}
            <div className="mt-10 border-t border-gray-200 pt-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                Livraison
              </h3>

              {/* Shipping Info */}
              <div className="bg-green-50 p-8 rounded-2xl border border-green-100 max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-green-800">Informations de Livraison</h4>
                </div>
                <ul className="space-y-4 text-base text-green-700">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Livraison gratuite</strong> pour toute commande supérieure à 100.00 TND</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Livraison standard :</strong> 24-48 heures ouvrables</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Livraison express :</strong> Même jour (Tunis et environs)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Frais de livraison :</strong> 8.00 TND (gratuit dès 100.00 TND)</span>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="mt-6 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-gray-800">Besoin d'aide ?</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Notre équipe est disponible pour répondre à toutes vos questions concernant la livraison et les retours.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-2 text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <strong>Tél :</strong> 29 362 224
                  </span>
                  <span className="flex items-center gap-2 text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <strong>Email :</strong> packedin.tn@gmail.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Dialog */}
      <CheckoutDialog
        open={showCheckout}
        onOpenChange={setShowCheckout}
      />
    </div>
  );
}
