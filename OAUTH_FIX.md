# OAuth Redirect Fix

## Problem
Production site redirects to localhost during authentication.

## Solution

### 1. Update Vercel Environment Variables
In your Vercel dashboard, set:
- `NEXTAUTH_URL` = `https://your-domain.vercel.app`

### 2. Update Google OAuth Settings
In Google Cloud Console:
1. Go to APIs & Services > Credentials
2. Edit your OAuth 2.0 Client ID
3. Add redirect URI: `https://your-domain.vercel.app/api/auth/callback/google`

### 3. Redeploy
After updating environment variables, redeploy your application.

## Code Changes
- Improved Google OAuth authorization parameters
- Enhanced trustHost configuration for production

## Testing
- Development: `http://localhost:3000/auth/signin`
- Production: `https://your-domain.vercel.app/auth/signin`
