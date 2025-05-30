import { NextResponse } from 'next/server'

export async function GET() {
  const authDebug = {
    // Environment
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL ? 'YES' : 'NO',
    
    // NextAuth Configuration
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'MISSING',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET (length: ' + process.env.NEXTAUTH_SECRET.length + ')' : 'MISSING',
    
    // Google OAuth
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING',
    
    // Auth URLs
    EXPECTED_CALLBACK_URL: process.env.NEXTAUTH_URL + '/api/auth/callback/google',
    
    // Production Status
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    CREDENTIALS_ENABLED: process.env.NODE_ENV !== 'production',
    
    // Validation
    ALL_REQUIRED_SET: !!(
      process.env.NEXTAUTH_URL && 
      process.env.NEXTAUTH_SECRET && 
      process.env.GOOGLE_CLIENT_ID && 
      process.env.GOOGLE_CLIENT_SECRET
    ),
    
    // Recommendations
    RECOMMENDATIONS: [
      process.env.NEXTAUTH_URL ? '✅ NEXTAUTH_URL is set' : '❌ Set NEXTAUTH_URL to your production domain',
      process.env.NEXTAUTH_SECRET ? '✅ NEXTAUTH_SECRET is set' : '❌ Set NEXTAUTH_SECRET to a secure random string',
      process.env.GOOGLE_CLIENT_ID ? '✅ GOOGLE_CLIENT_ID is set' : '❌ Set GOOGLE_CLIENT_ID from Google Console',
      process.env.GOOGLE_CLIENT_SECRET ? '✅ GOOGLE_CLIENT_SECRET is set' : '❌ Set GOOGLE_CLIENT_SECRET from Google Console',
    ],
    
    STATUS: (
      process.env.NEXTAUTH_URL && 
      process.env.NEXTAUTH_SECRET && 
      process.env.GOOGLE_CLIENT_ID && 
      process.env.GOOGLE_CLIENT_SECRET
    ) ? '🟢 READY FOR AUTHENTICATION' : '🔴 MISSING REQUIRED VARIABLES'
  }

  return NextResponse.json(authDebug, { 
    headers: { 'Cache-Control': 'no-cache' } 
  })
}
