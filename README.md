# Headless Shopify Store with Next.js, TypeScript, and Tailwind CSS

This project is a headless e-commerce store built with Next.js, TypeScript, and Tailwind CSS, using Shopify as the backend. It uses Bun as the JavaScript runtime.

## Features

- 🛍️ Headless Shopify storefront
- 🔄 Real-time inventory and product updates
- 🛒 Shopping cart functionality
- 📱 Responsive design with Tailwind CSS
- 🔍 Product search and filtering
- 🖼️ Image optimization with Next.js Image component
- 🔒 Secure checkout through Shopify

## Prerequisites

- [Bun](https://bun.sh/) installed on your machine
- A Shopify store with Storefront API access
- Storefront API access token

## Getting Started

1. Clone this repository:

```bash
git clone <repository-url>
cd shopify-headless-store
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
```

You can get these credentials from your Shopify admin dashboard:
- Go to Apps > Develop apps
- Create a new app or use an existing one
- Configure the app to use the Storefront API
- Generate a Storefront API access token

4. Run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Next.js app router pages
- `/components` - Reusable React components
- `/context` - React context for state management
- `/lib` - Utility functions, hooks, and API clients
- `/public` - Static assets

## Customization

### Styling

This project uses Tailwind CSS for styling. You can customize the design by modifying the `tailwind.config.ts` file.

### Shopify Integration

The Shopify integration is handled through the Storefront API. You can modify the GraphQL queries in `lib/queries.ts` to fetch additional data or customize the existing queries.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shopify Storefront API Documentation](https://shopify.dev/docs/api/storefront)
- [Bun Documentation](https://bun.sh/docs)

## License

This project is licensed under the MIT License.
# Test commit
