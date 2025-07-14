'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag, Clock } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { formatPrice } from '@/lib/utils';
import { FullScreenLoader } from '@/components/ui/loader';

function SuccessContent() {
  // const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [orderDetails, setOrderDetails] = useState<any>(null);

  // Get order number from URL
  const orderNumber = searchParams.get('order');

  // Fetch order details if available
  useEffect(() => {
    // Try to parse order details from localStorage
    const storedOrder = localStorage.getItem('lastOrder');
    if (storedOrder) {
      try {
        const parsedOrder = JSON.parse(storedOrder);
        setOrderDetails(parsedOrder);
      } catch (error) {
        console.error('Error parsing stored order:', error);
      }
    }
  }, []);

  // Redirect to home after 20 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      // Use direct navigation for more reliability
      window.location.href = '/';
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Thank you for your order!
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Your order has been successfully placed. We will contact you shortly to confirm the delivery details.
          </p>

          {orderNumber && (
            <p className="mt-2 text-base font-medium text-gray-700">
              Order Number: <span className="font-bold">{orderNumber}</span>
            </p>
          )}

          {session?.user ? (
            <p className="mt-2 text-sm text-green-600">
              This order has been saved to your account history.
            </p>
          ) : (
            <p className="mt-2 text-sm text-amber-600">
              <Link href="/auth/signin" className="underline">Sign in</Link> or <Link href="/auth/signup" className="underline">create an account</Link> to track your orders.
            </p>
          )}

          <p className="mt-4 text-base text-gray-500 flex items-center justify-center">
            <Clock className="h-4 w-4 mr-1" />
            You will be redirected to the homepage in a few seconds.
          </p>
        </div>

        {orderDetails && (
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-medium text-gray-900">Order Summary</h2>
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flow-root">
                <ul className="-my-4 divide-y divide-gray-200">
                  {orderDetails.order?.items?.map((item: any, index: number) => (
                    <li key={index} className="flex items-center space-x-4 py-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="flex-shrink-0 text-sm font-medium text-gray-900">
                        {formatPrice(parseFloat(item.price) * item.quantity)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>{orderDetails.order?.subtotal ? formatPrice(orderDetails.order.subtotal) : 'N/A'}</p>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-900 mt-2">
                  <p>Delivery</p>
                  <p>{orderDetails.order?.deliveryFee ? formatPrice(orderDetails.order.deliveryFee) : '8.00 TND'}</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900 mt-4">
                  <p>Total</p>
                  <p>{orderDetails.order?.totalPrice ? formatPrice(orderDetails.order.totalPrice) : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
            <Link href="/collections">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>

          {session?.user && (
            <Button asChild className="ml-4 bg-gray-100 text-gray-800 hover:bg-gray-200">
              <Link href="/profile">
                View Your Orders
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  return <FullScreenLoader />;
}

// Main component with Suspense boundary
export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  );
}
