'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { FcGoogle } from 'react-icons/fc';

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign in with Google',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ULTRA-SIMPLE GOOGLE ONLY */}
      <div className="text-center space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Sign in to your account
        </h3>
        <p className="text-sm text-gray-600">
          Use your Google account to sign in securely
        </p>

        <Button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full h-12 text-base bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <FcGoogle className="mr-3 h-6 w-6" />
          {isLoading ? 'Signing in...' : 'Continue with Google'}
        </Button>

        <p className="text-xs text-gray-500 mt-4">
          Secure authentication powered by Google
        </p>
      </div>
    </div>
  );
}
