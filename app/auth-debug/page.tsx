'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface AuthStatus {
  authenticated: boolean;
  session: any;
  debug: any;
  error?: string;
}

export default function AuthDebugPage() {
  const { data: session, status } = useSession();
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/status');
      const data = await response.json();
      setAuthStatus(data);
    } catch (error) {
      console.error('Failed to check auth status:', error);
      setAuthStatus({
        authenticated: false,
        session: null,
        debug: null,
        error: 'Failed to fetch auth status'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    checkAuthStatus();
  }, []);

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Authentication Debug</h1>
      
      <div className="space-y-6">
        {/* Client-side session info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Client-side Session (useSession)</h2>
          <div className="space-y-2">
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Has Session:</strong> {session ? 'Yes' : 'No'}</p>
            {session && (
              <div className="mt-4">
                <p><strong>User ID:</strong> {session.user?.id}</p>
                <p><strong>Email:</strong> {session.user?.email}</p>
                <p><strong>Name:</strong> {session.user?.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Server-side auth status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Server-side Auth Status</h2>
            <Button onClick={checkAuthStatus} disabled={loading}>
              {loading ? 'Checking...' : 'Refresh'}
            </Button>
          </div>
          
          {authStatus && (
            <div className="space-y-4">
              <p><strong>Authenticated:</strong> {authStatus.authenticated ? 'Yes' : 'No'}</p>
              
              {authStatus.session && (
                <div>
                  <h3 className="font-semibold">Session Data:</h3>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                    {JSON.stringify(authStatus.session, null, 2)}
                  </pre>
                </div>
              )}
              
              {authStatus.debug && (
                <div>
                  <h3 className="font-semibold">Debug Info:</h3>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                    {JSON.stringify(authStatus.debug, null, 2)}
                  </pre>
                </div>
              )}
              
              {authStatus.error && (
                <div className="text-red-600">
                  <strong>Error:</strong> {authStatus.error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Environment info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Environment Info</h2>
          <div className="space-y-2">
            <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
            <p><strong>Mounted:</strong> {mounted ? 'Yes' : 'No'}</p>
            <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
