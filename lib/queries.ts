// GraphQL queries for Shopify Storefront API

// Get all products with a limit of 50
export const QUERY_ALL_PRODUCTS = `
  query GetAllProducts($first: Int = 50) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

// Get a single product by handle
export const QUERY_PRODUCT_BY_HANDLE = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`;

// Get all collections with enhanced data
export const QUERY_ALL_COLLECTIONS = `
  query GetAllCollections($first: Int = 20) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          image {
            url
            altText
            width
            height
          }
          products(first: 1) {
            edges {
              node {
                id
              }
            }
          }
          updatedAt
        }
      }
    }
  }
`;

// Get all collections with their products
export const QUERY_ALL_COLLECTIONS_WITH_PRODUCTS = `
  query GetAllCollectionsWithProducts($first: Int = 20, $productsFirst: Int = 50) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          image {
            url
            altText
            width
            height
          }
          products(first: $productsFirst) {
            edges {
              node {
                id
                title
                handle
                description
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                  maxVariantPrice {
                    amount
                    currencyCode
                  }
                }
                compareAtPriceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 3) {
                  edges {
                    node {
                      url
                      altText
                      width
                      height
                    }
                  }
                }
                variants(first: 5) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                      availableForSale
                      selectedOptions {
                        name
                        value
                      }
                    }
                  }
                }
                tags
                availableForSale
                totalInventory
                createdAt
                updatedAt
              }
            }
          }
          updatedAt
        }
      }
    }
  }
`;

// Get collection by handle
export const QUERY_COLLECTION_BY_HANDLE = `
  query GetCollectionByHandle($handle: String!, $first: Int = 20) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        altText
      }
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Create checkout
export const CREATE_CHECKOUT = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 20) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

// Add items to checkout
export const ADD_TO_CHECKOUT = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 20) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                }
              }
            }
          }
        }
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

// Update cart attributes (notes, custom attributes)
export const UPDATE_CART_ATTRIBUTES = `
  mutation CartAttributesUpdate($cartId: ID!, $attributes: [AttributeInput!]!) {
    cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

// Update buyer identity (email, phone, etc.)
export const UPDATE_CART_BUYER_IDENTITY = `
  mutation CartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

// Update delivery address
export const UPDATE_CART_DELIVERY_ADDRESS = `
  mutation CartDeliveryAddressUpdate($cartId: ID!, $deliveryAddress: MailingAddressInput!) {
    cartDeliveryAddressUpdate(cartId: $cartId, deliveryAddress: $deliveryAddress) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

// Update delivery method (for cash on delivery)
export const UPDATE_CART_DELIVERY_METHOD = `
  mutation CartDeliveryMethodUpdate($cartId: ID!, $deliveryMethodId: ID!) {
    cartDeliveryMethodUpdate(cartId: $cartId, deliveryMethodId: $deliveryMethodId) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

// Search products by title
export const QUERY_PRODUCTS_BY_TITLE = `
  query GetProductsByTitle($query: String!, $first: Int = 20) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;