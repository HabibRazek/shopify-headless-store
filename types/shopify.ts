export interface ShopifyImage {
  node: {
    url: string;
    altText: string | null;
    width?: number;
    height?: number;
  };
}

export interface ShopifyVariant {
  node: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    availableForSale: boolean;
    selectedOptions?: Array<{
      name: string;
      value: string;
    }>;
  };
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: ShopifyImage[];
  };
  variants: {
    edges: ShopifyVariant[];
  };
}

export interface ShopifyCollection {
  node: {
    id: string;
    title: string;
    handle: string;
    description: string | null;
    image: {
      url: string;
      altText: string | null;
    } | null;
    products?: {
      edges: ShopifyProduct[];
    };
  };
}
