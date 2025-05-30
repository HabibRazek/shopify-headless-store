import { NextResponse } from 'next/server'

export async function GET() {
  const envVars = {
    // Environment Info
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL ? 'YES' : 'NO',

    // Auth Variables
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'MISSING',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING',

    // Database
    DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'MISSING',

    // Shopify
    SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY ? 'SET' : 'MISSING',
    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ? 'SET' : 'MISSING',

    // Status
    STATUS: 'All variables above should show SET for production to work',
    READY: (
      process.env.NEXTAUTH_URL &&
      process.env.NEXTAUTH_SECRET &&
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET
    ) ? '✅ READY FOR PRODUCTION' : '❌ MISSING VARIABLES'
  }

  return NextResponse.json(envVars, {
    headers: { 'Cache-Control': 'no-cache' }
  })
}
