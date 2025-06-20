'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircleIcon, HomeIcon, RefreshCwIcon } from 'lucide-react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get('error');

    if (errorParam) {
      switch (errorParam) {
        case 'Configuration':
          setError('There is a problem with the server configuration.');
          break;
        case 'AccessDenied':
          setError('You do not have access to this resource.');
          break;
        case 'Verification':
          setError('The verification link may have been used or is invalid.');
          break;
        case 'OAuthSignin':
          setError('Erreur de connexion Google. Vérifiez la configuration OAuth.');
          break;
        case 'OAuthCallback':
          setError('Erreur de callback Google. URL de redirection incorrecte.');
          break;
        case 'OAuthCreateAccount':
          setError('Impossible de créer le compte avec Google.');
          break;
        case 'EmailCreateAccount':
          setError('Impossible de créer le compte avec cet email.');
          break;
        case 'Callback':
          setError('Erreur de callback d\'authentification.');
          break;
        case 'OAuthAccountNotLinked':
          setError('Ce compte Google n\'est pas lié à votre compte.');
          break;
        case 'EmailSignin':
          setError('The email could not be sent or the link has expired.');
          break;
        case 'CredentialsSignin':
          setError('The email or password you entered is incorrect.');
          break;
        case 'SessionRequired':
          setError('You must be signed in to access this page.');
          break;
        default:
          setError('An unknown error occurred.');
          break;
      }
    } else {
      setError('An unknown error occurred.');
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1 pb-6 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-full bg-red-50">
              <AlertCircleIcon className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Authentication Error</CardTitle>
          <CardDescription className="text-base text-red-600 font-medium mt-2">
            {error}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4 pb-6">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <p className="text-sm text-amber-800">
              Please try again or contact support if the problem persists. If you're trying to sign in with a social account, make sure you're using the same email address.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4 border-t pt-6">
          <Button variant="outline" asChild className="min-w-[120px] border border-gray-300">
            <Link href="/" className="flex items-center">
              <HomeIcon className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button asChild className="min-w-[120px] bg-green-600 hover:bg-green-700">
            <Link href="/auth/signin" className="flex items-center">
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Try Again
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg border-0 p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </Card>
    </div>
  );
}

// Main component with Suspense boundary
export default function AuthError() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ErrorContent />
    </Suspense>
  );
}
