'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserIcon, PackageIcon, AlertCircle } from 'lucide-react';
import { ProfileEditor } from '@/components/profile/ProfileEditor';
import { OrdersHistory } from '@/components/profile/OrdersHistory';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authError, setAuthError] = useState<string>('');
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Check for middleware error
    const error = searchParams.get('error');
    if (error === 'middleware_error') {
      setAuthError('Authentication error occurred. Please sign in again.');
    }
  }, [searchParams]);

  useEffect(() => {
    // Debug logging for both environments
    console.log('Profile Page Debug:', {
      status,
      hasSession: !!session,
      userId: session?.user?.id || 'none',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  }, [status, session]);

  useEffect(() => {
    // Handle unauthenticated state
    if (status === 'unauthenticated' && !redirecting) {
      console.log('🔒 User not authenticated, redirecting to sign in...');
      setRedirecting(true);

      // Use router.replace instead of router.push to avoid back button issues
      const callbackUrl = encodeURIComponent('/profile');
      router.replace(`/auth/signin?callbackUrl=${callbackUrl}`);
    }
  }, [status, router, redirecting]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  if (status === 'unauthenticated' || redirecting) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] space-y-4">
        {authError && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span>{authError}</span>
          </div>
        )}
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600">Redirecting to sign in...</p>
      </div>
    );
  }

  // If we have a session, show the profile
  if (status === 'authenticated' && session) {
    console.log('✅ User authenticated, showing profile for:', session.user?.email);
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Mon Compte</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8 bg-white border shadow-sm">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 px-6 py-3"
            >
              <UserIcon className="h-4 w-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 px-6 py-3"
            >
              <PackageIcon className="h-4 w-4 mr-2" />
              Commandes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileEditor />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
