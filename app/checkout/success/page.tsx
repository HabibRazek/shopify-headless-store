'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const router = useRouter();

  // Redirect to home after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      // Use direct navigation for more reliability
      window.location.href = '/';
    }, 10000);

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
          <p className="mt-2 text-base text-gray-500">
            You will be redirected to the homepage in a few seconds.
          </p>
        </div>

        <div className="mt-12 text-center">
          <Button asChild className="bg-black hover:bg-gray-800 text-white">
            <Link href="/collections">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
