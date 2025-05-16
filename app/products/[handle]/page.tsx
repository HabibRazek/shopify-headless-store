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
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
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
    <div className="bg-white">
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

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.title}
            </h1>

            {/* Price */}
            <div className="mt-3">
              <p className="text-3xl font-semibold tracking-tight text-gray-900">
                {formatPrice(price, currency)}
              </p>
            </div>

            {/* Description */}
            <div className="mt-6">
              <div
                className="prose prose-sm text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </div>

            {/* Variants */}
            {variants.length > 1 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-900">Options</h3>
                <div className="mt-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {variants.map((variant) => (
                      <button
                        key={variant.node.id}
                        type="button"
                        className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                          selectedVariant === variant.node.id
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedVariant(variant.node.id)}
                      >
                        {variant.node.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quantity selector */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
              <div className="mt-2 flex items-center">
                <button
                  type="button"
                  className="rounded-l-md border border-gray-300 p-3 text-gray-900 hover:bg-gray-50"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <span className="sr-only">Decrease quantity</span>
                  <span className="h-5 w-5 flex items-center justify-center">−</span>
                </button>
                <div className="w-16 border-t border-b border-gray-300 px-3 py-2 text-center text-base">
                  {quantity}
                </div>
                <button
                  type="button"
                  className="rounded-r-md border border-gray-300 p-3 text-gray-900 hover:bg-gray-50"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <span className="sr-only">Increase quantity</span>
                  <span className="h-5 w-5 flex items-center justify-center">+</span>
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                className="flex-1 flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={handleAddToCart}
              >
                <HiOutlineShoppingBag className="mr-2 h-5 w-5" />
                Add to Cart
              </button>
              <button
                type="button"
                className="flex-1 rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
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

            {/* Shipping information */}
            <div className="mt-10 border-t border-gray-200 pt-10">
              <h3 className="text-sm font-medium text-gray-900">Shipping & Returns</h3>
              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">
                  Free shipping on all orders over $50. Standard shipping takes 3-5 business days.
                  Returns accepted within 30 days of delivery.
                </p>
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
