import { createStorefrontApiClient } from '@shopify/storefront-api-client';

// Initialize Shopify Storefront API client
export const storefrontClient = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '',
  apiVersion: '2024-07', // Use the latest API version
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
});

// Helper function to execute GraphQL queries
export async function shopifyFetch<T>({
  query,
  variables
}: {
  query: string;
  variables?: Record<string, any>;
}): Promise<{ status: number; body: T }> {
  try {
    const { data, errors } = await storefrontClient.request(query, {
      variables
    });

    if (errors) {
      return {
        status: 500,
        body: { error: 'Error fetching data from Shopify' } as unknown as T,
      };
    }

    return {
      status: 200,
      body: data as T,
    };
  } catch (error) {
    return {
      status: 500,
      body: { error: 'Error fetching data from Shopify' } as unknown as T,
    };
  }
}
