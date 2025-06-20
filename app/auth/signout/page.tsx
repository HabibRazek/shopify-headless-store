'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOutIcon } from 'lucide-react';

export default function SignOut() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: '/' });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1 pb-6 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-full bg-red-50">
              <LogOutIcon className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Sign out</CardTitle>
          <CardDescription>
            Are you sure you want to sign out of your account?
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center space-x-4 pt-2 pb-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="min-w-[100px] border border-gray-300"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSignOut}
            className="min-w-[100px] bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing out...
              </div>
            ) : (
              'Sign out'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
