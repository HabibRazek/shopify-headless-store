'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserIcon, PackageIcon } from 'lucide-react';
import { ProfileEditor } from '@/components/profile/ProfileEditor';
import { OrdersHistory } from '@/components/profile/OrdersHistory';

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();



  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
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
