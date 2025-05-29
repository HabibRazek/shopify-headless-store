import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Hook to fetch all products
export function useProducts() {
  const { data, error, isLoading } = useSWR('/api/products', fetcher);

  // The API returns data directly, not nested under a data property
  const products = data?.products?.edges || [];

  return {
    products,
    isLoading,
    isError: error,
  };
}

// Hook to fetch a single product by handle
export function useProduct(handle: string) {
  const { data, error, isLoading } = useSWR(
    handle ? `/api/products/${handle}` : null,
    fetcher
  );

  return {
    product: data?.product || null,
    isLoading,
    isError: error,
  };
}

// Hook to fetch all collections
export function useCollections(includeProducts = false, limit = 20, productsLimit = 50) {
  const params = new URLSearchParams({
    includeProducts: includeProducts.toString(),
    limit: limit.toString(),
    productsLimit: productsLimit.toString(),
  });

  const { data, error, isLoading, mutate } = useSWR(
    `/api/collections?${params.toString()}`,
    fetcher
  );

  return {
    collections: data?.data?.collections || [],
    total: data?.data?.total || 0,
    pagination: data?.data?.pagination || {},
    filters: data?.data?.filters || {},
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

// Hook to fetch a single collection by handle
export function useCollection(handle: string, productsLimit = 50, sortBy?: string, search?: string) {
  const params = new URLSearchParams({
    productsLimit: productsLimit.toString(),
    ...(sortBy && { sortBy }),
    ...(search && { search }),
  });

  const { data, error, isLoading, mutate } = useSWR(
    handle ? `/api/collections/${handle}?${params.toString()}` : null,
    fetcher
  );

  return {
    collection: data?.data || null,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

// Function to create a checkout
export async function createCheckout(items: any[]) {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items }),
  });

  return response.json();
}

// Function to add items to an existing checkout
export async function addToCheckout(checkoutId: string, items: any[]) {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ checkoutId, items }),
  });

  return response.json();
}
