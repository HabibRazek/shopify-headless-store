# Production Authentication Fix

## Problem
Authentication works in development but fails in production with "server configuration" error.

## Root Causes
1. Missing or incorrect environment variables in Vercel
2. Database connection issues in production
3. Incorrect OAuth redirect URIs

## Complete Solution

### 1. Vercel Environment Variables
In your Vercel dashboard, ensure ALL these variables are set:

**Authentication:**
- `NEXTAUTH_URL` = `https://shopify-headless-store-sigma.vercel.app`
- `NEXTAUTH_SECRET` = (copy from your .env file)
- `GOOGLE_CLIENT_ID` = (copy from your .env file)
- `GOOGLE_CLIENT_SECRET` = (copy from your .env file)

**Database:**
- `DATABASE_URL` = (copy from your .env file)

**Shopify:**
- `SHOPIFY_API_KEY` = (copy from your .env file)
- `SHOPIFY_API_SECRET` = (copy from your .env file)
- `SHOPIFY_APP_URL` = `https://shopify-headless-store-sigma.vercel.app`
- `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` = (copy from your .env file)
- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` = (copy from your .env file)
- `SHOPIFY_ADMIN_ACCESS_TOKEN` = (copy from your .env file)
- `SHOPIFY_ADMIN_DOMAIN` = (copy from your .env file)
- `SHOPIFY_ADMIN_API_VERSION` = (copy from your .env file)

### 2. Google OAuth Settings
In Google Cloud Console:
1. Go to APIs & Services > Credentials
2. Edit your OAuth 2.0 Client ID
3. Set correct redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://shopify-headless-store-sigma.vercel.app/api/auth/callback/google`

### 3. Database Connection
Ensure your Neon database allows connections from Vercel.

### 4. Redeploy
After updating ALL environment variables, redeploy your application.

## Code Improvements
- Added better error handling and logging
- Improved database connection testing
- Enhanced callback error handling
- Added debug mode for development

## Testing Steps
1. Check Vercel logs for any missing environment variables
2. Test email login on production
3. Test Google OAuth on production
4. Verify database connectivity

## Debugging
If issues persist, check Vercel function logs for specific error messages.
