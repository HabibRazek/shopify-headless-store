'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { FcGoogle } from 'react-icons/fc';

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
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
      {/* Google Sign In Only */}
      <div className="text-center space-y-4">
        <p className="text-sm text-gray-600 mb-4">
          Sign in to your account using Google
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full h-12 text-base"
        >
          <FcGoogle className="mr-3 h-5 w-5" />
          {isLoading ? 'Signing in...' : 'Continue with Google'}
        </Button>
        <p className="text-xs text-gray-500 mt-4">
          Secure authentication powered by Google
        </p>
      </div>
    </div>
  );
}
