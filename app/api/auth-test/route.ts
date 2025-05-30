import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test if NextAuth is properly configured
    const authConfig = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'MISSING',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING',
      NODE_ENV: process.env.NODE_ENV,
      
      // Test auth endpoints
      AUTH_ENDPOINTS: {
        signin: '/api/auth/signin',
        callback: '/api/auth/callback/google',
        session: '/api/auth/session',
      },
      
      // Configuration status
      STATUS: (
        process.env.NEXTAUTH_URL && 
        process.env.NEXTAUTH_SECRET && 
        process.env.GOOGLE_CLIENT_ID && 
        process.env.GOOGLE_CLIENT_SECRET
      ) ? '✅ AUTH READY' : '❌ MISSING CONFIG',
      
      MESSAGE: 'Ultra-simple Google OAuth only configuration active'
    }

    return NextResponse.json(authConfig)
  } catch (error) {
    return NextResponse.json({ 
      error: 'Auth test failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
