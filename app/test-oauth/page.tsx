'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

export default function TestOAuthPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setLastError(null);
      console.log('🚀 Starting Google OAuth test...');
      
      const result = await signIn('google', { 
        callbackUrl: '/test-oauth',
        redirect: false 
      });
      
      console.log('📥 OAuth result:', result);
      
      if (result?.error) {
        setLastError(result.error);
        console.error('❌ OAuth error:', result.error);
      }
    } catch (error) {
      console.error('❌ OAuth exception:', error);
      setLastError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectSignIn = async () => {
    try {
      setIsLoading(true);
      setLastError(null);
      console.log('🚀 Starting direct Google OAuth...');
      
      await signIn('google', { callbackUrl: '/test-oauth' });
    } catch (error) {
      console.error('❌ Direct OAuth error:', error);
      setLastError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/test-oauth' });
    } catch (error) {
      console.error('❌ Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>🔍 OAuth Debug Tool</CardTitle>
            <CardDescription>Test Google OAuth functionality in production</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div><strong>Status:</strong> {status}</div>
              <div><strong>Environment:</strong> {process.env.NODE_ENV || 'unknown'}</div>
              <div><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.origin : 'SSR'}</div>
            </div>
            
            {lastError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-800 font-semibold">❌ Last Error:</div>
                <div className="text-red-700 text-sm mt-1">{lastError}</div>
              </div>
            )}
            
            {session ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800">✅ Signed In Successfully</h3>
                  <div className="mt-2 text-sm text-green-700 space-y-1">
                    <div><strong>Name:</strong> {session.user?.name || 'N/A'}</div>
                    <div><strong>Email:</strong> {session.user?.email || 'N/A'}</div>
                    <div><strong>Image:</strong> {session.user?.image ? '✅ Yes' : '❌ No'}</div>
                    <div><strong>ID:</strong> {session.user?.id || 'N/A'}</div>
                  </div>
                </div>
                
                <Button onClick={handleSignOut} variant="outline" className="w-full">
                  👋 Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold text-yellow-800">🔐 Not Signed In</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Test Google OAuth with the buttons below
                  </p>
                </div>
                
                <Button 
                  onClick={handleGoogleSignIn} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? '⏳ Testing...' : '🔍 Test OAuth (No Redirect)'}
                </Button>
                
                <Button 
                  onClick={handleDirectSignIn} 
                  disabled={isLoading}
                  variant="outline" 
                  className="w-full"
                >
                  {isLoading ? '⏳ Loading...' : '🚀 Direct Google Sign In'}
                </Button>
              </div>
            )}

            <div className="mt-6 space-y-2">
              <Button 
                onClick={() => window.open('/api/debug-auth', '_blank')} 
                variant="outline" 
                size="sm"
                className="w-full"
              >
                🔍 Check Environment Status
              </Button>
              
              <Button 
                onClick={() => window.open('/api/health', '_blank')} 
                variant="outline" 
                size="sm"
                className="w-full"
              >
                🏥 Check Health Status
              </Button>
            </div>

            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">📋 Debug Instructions:</h4>
              <ol className="text-xs space-y-1 text-gray-700">
                <li>1. Open browser console (F12)</li>
                <li>2. Click "Test OAuth" button</li>
                <li>3. Check console for detailed logs</li>
                <li>4. Check environment status</li>
                <li>5. Report any errors you see</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
