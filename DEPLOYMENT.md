# Deployment Guide

## Vercel Deployment

This project is optimized for deployment on Vercel. Follow these steps:

### 1. Environment Variables

Set up the following environment variables in your Vercel dashboard:

#### Required for Shopify Integration:
```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token
SHOPIFY_ADMIN_DOMAIN=your-store.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_token
SHOPIFY_ADMIN_API_VERSION=2024-07
```

#### Required for Authentication:
```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret
DATABASE_URL=your_database_connection_string
```

#### Optional (for Google OAuth):
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 2. Build Configuration

The project includes a `vercel.json` file that:
- Uses Bun as the package manager
- Sets `SKIP_ENV_VALIDATION=1` during build
- Uses the build-safe auth configuration

### 3. Database Setup

For production, you'll need a PostgreSQL database. Recommended providers:
- **Neon** (recommended for Vercel)
- **Supabase**
- **PlanetScale**
- **Railway**

### 4. Build Process

The build process automatically:
- Skips database connections during build time
- Uses build-safe NextAuth configuration
- Optimizes console logging for production
- Generates static pages where possible

### 5. Deployment Steps

1. Connect your GitHub repository to Vercel
2. Set the environment variables in Vercel dashboard
3. Deploy - Vercel will automatically use the optimized build configuration

### Troubleshooting

If you encounter build errors:

1. **Database Connection Issues**: Ensure `DATABASE_URL` is set in production environment
2. **Auth Issues**: Verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are correctly set
3. **Shopify API Issues**: Check that all Shopify environment variables are correct

### Local Development vs Production

- **Local**: Uses full database connection and all auth providers
- **Build Time**: Uses build-safe configuration without database dependency
- **Production**: Full functionality with all environment variables available
