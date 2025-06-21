import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔍 Testing Google OAuth configuration...');
    
    // Test environment variables
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    const nextAuthSecret = process.env.NEXTAUTH_SECRET;
    
    console.log('Environment variables:', {
      hasGoogleClientId: !!googleClientId,
      hasGoogleClientSecret: !!googleClientSecret,
      hasNextAuthUrl: !!nextAuthUrl,
      hasNextAuthSecret: !!nextAuthSecret,
      googleClientIdLength: googleClientId?.length || 0,
      nextAuthUrl: nextAuthUrl
    });
    
    // Test auth configuration import
    let authConfigStatus = 'unknown';
    let authError = '';
    
    try {
      const { auth } = await import('@/auth');
      authConfigStatus = 'loaded';
      console.log('✅ Auth configuration loaded successfully');
    } catch (error) {
      authConfigStatus = 'error';
      authError = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Auth configuration error:', error);
    }
    
    // Test Google OAuth URL generation
    let googleOAuthUrl = '';
    let googleOAuthError = '';
    
    try {
      // Simulate Google OAuth URL generation
      if (googleClientId && nextAuthUrl) {
        const baseUrl = nextAuthUrl;
        const redirectUri = `${baseUrl}/api/auth/callback/google`;
        googleOAuthUrl = `https://accounts.google.com/oauth/authorize?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile`;
        console.log('✅ Google OAuth URL generated successfully');
      } else {
        googleOAuthError = 'Missing Google Client ID or NextAuth URL';
      }
    } catch (error) {
      googleOAuthError = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Google OAuth URL generation error:', error);
    }
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasGoogleClientId: !!googleClientId,
        hasGoogleClientSecret: !!googleClientSecret,
        hasNextAuthUrl: !!nextAuthUrl,
        hasNextAuthSecret: !!nextAuthSecret,
        googleClientIdPartial: googleClientId ? googleClientId.substring(0, 20) + '...' : 'Not set',
        nextAuthUrl: nextAuthUrl
      },
      auth: {
        configStatus: authConfigStatus,
        configError: authError || undefined
      },
      googleOAuth: {
        urlGenerated: !!googleOAuthUrl,
        error: googleOAuthError || undefined,
        testUrl: googleOAuthUrl ? googleOAuthUrl.substring(0, 100) + '...' : undefined
      },
      recommendations: [
        'Check that all environment variables are set in Vercel',
        'Verify Google Cloud Console redirect URIs match exactly',
        'Test Google OAuth flow in incognito browser',
        'Check Vercel function logs for detailed errors'
      ]
    });
    
  } catch (error) {
    console.error('❌ Test endpoint error:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
