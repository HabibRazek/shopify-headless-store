'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserIcon, PackageIcon, AlertCircle } from 'lucide-react';
import { ProfileEditor } from '@/components/profile/ProfileEditor';
import { OrdersHistory } from '@/components/profile/OrdersHistory';

function ProfileContent() {
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
    // Handle unauthenticated state
    if (status === 'unauthenticated' && !redirecting) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br pt-12">
      {/* Professional Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mon Espace Client</h1>
                <p className="text-gray-600">Gérez votre profil et suivez vos commandes</p>
              </div>
            </div>
            <div className="hidden md:flex flex-col items-end space-y-1">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Connecté en tant que</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                  <UserIcon className="h-4 w-4 text-white" />
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{session?.user?.name || 'Utilisateur'}</p>
                  <p className="text-sm text-gray-700">{session?.user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="profile" className="w-full">
            {/* Enhanced Tab Navigation */}
            <div className="mb-8">
              <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2 bg-white border border-gray-200 shadow-sm rounded-xl p-1">
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md px-6 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  <UserIcon className="h-4 w-4 mr-2" />
                  Mon Profil
                </TabsTrigger>
                <TabsTrigger
                  value="orders"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md px-6 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  <PackageIcon className="h-4 w-4 mr-2" />
                  Mes Commandes
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="profile" className="space-y-6">
              <ProfileEditor />
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <OrdersHistory />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading profile...</p>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
