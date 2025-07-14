'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { FullScreenLoader } from '@/components/ui/loader';
import { SignInForm } from '@/components/auth/signin-form';
import { ArrowLeft } from 'lucide-react';

function SignInContent() {
  return (
    <div className="min-h-screen b flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl">
        {/* Back to Home Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors group mb-8"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>

        {/* Main Auth Container */}
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
          <div className="grid lg:grid-cols-2 min-h-[600px]">
            {/* Left Side - Form */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              {/* Form Content */}
              <div className="max-w-sm mx-auto lg:mx-0 w-full">
                <SignInForm />
              </div>

              {/* Security Badge */}
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-3 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span>Secured by Google</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span>256-bit SSL encryption</span>
              </div>
            </div>

            {/* Right Side - Image & Branding */}
            <div className="hidden lg:flex bg-gradient-to-br from-green-600 to-emerald-700 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 right-10 w-32 h-32 border border-white/20 rounded-full"></div>
                <div className="absolute top-32 right-32 w-16 h-16 border border-white/20 rounded-full"></div>
                <div className="absolute bottom-20 right-20 w-24 h-24 border border-white/20 rounded-full"></div>
                <div className="absolute bottom-40 right-40 w-8 h-8 border border-white/20 rounded-full"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 p-12 flex flex-col justify-center text-white">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                  <p className="text-green-100 text-lg leading-relaxed">
                    Access your ZIPBAGS® account to manage orders, track shipments, and discover our latest eco-friendly packaging solutions.
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm">📦</span>
                    </div>
                    <span className="text-green-100">Track your orders in real-time</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm">🌱</span>
                    </div>
                    <span className="text-green-100">Eco-friendly packaging solutions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm">⚡</span>
                    </div>
                    <span className="text-green-100">Fast & secure checkout</span>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-12 pt-8 border-t border-white/20">
                  <p className="text-green-200 text-sm mb-4">Trusted by 10,000+ businesses worldwide</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-green-200 text-sm">
                      <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                        <span className="text-xs text-green-800">✓</span>
                      </div>
                      <span>SSL Secured</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-200 text-sm">
                      <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                        <span className="text-xs text-green-800">✓</span>
                      </div>
                      <span>GDPR Compliant</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  return <FullScreenLoader />;
}

// Main component with Suspense boundary
export default function SignIn() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SignInContent />
    </Suspense>
  );
}
