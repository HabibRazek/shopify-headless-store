import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Hook to fetch all products
export function useProducts() {
  const { data, error, isLoading } = useSWR('/api/products', fetcher);

  console.log('useProducts hook data:', data);

  // The API returns data directly, not nested under a data property
  const products = data?.products?.edges || [];
  console.log('Extracted products:', products);

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
export function useCollections() {
  const { data, error, isLoading } = useSWR('/api/collections', fetcher);

  return {
    collections: data?.collections?.edges || [],
    isLoading,
    isError: error,
  };
}

// Hook to fetch a single collection by handle
export function useCollection(handle: string) {
  const { data, error, isLoading } = useSWR(
    handle ? `/api/collections/${handle}` : null,
    fetcher
  );

  return {
    collection: data?.collection || null,
    isLoading,
    isError: error,
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
