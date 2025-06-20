/**
 * Shopify Admin API utilities
 * Real Shopify Admin API integration for order and customer management
 */

// Real Shopify Admin API fetch
export async function shopifyAdminFetch({
  query,
  variables
}: {
  query: string;
  variables?: Record<string, any>;
}): Promise<{ status: number; body: any }> {
  const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const shopDomain = process.env.SHOPIFY_ADMIN_DOMAIN;
  const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION || '2024-07';

  if (!adminAccessToken || !shopDomain) {
    return {
      status: 500,
      body: { error: 'Missing Shopify Admin API credentials' }
    };
  }

  const url = `https://${shopDomain}/admin/api/${apiVersion}/graphql.json`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminAccessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const body = await response.json();

    if (!response.ok) {
      console.error('Shopify Admin API Error:', {
        status: response.status,
        statusText: response.statusText,
        body
      });
    }

    return {
      status: response.status,
      body
    };
  } catch (error) {
    console.error('Error calling Shopify Admin API:', error);
    return {
      status: 500,
      body: { error: 'Failed to call Shopify Admin API' }
    };
  }
}

// GraphQL mutation for creating draft orders
const CREATE_DRAFT_ORDER_MUTATION = `
  mutation draftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder {
        id
        name
        status
        totalPrice
        subtotalPrice
        totalTax
        currencyCode
        customer {
          id
          email
          firstName
          lastName
        }
        shippingAddress {
          address1
          city
          province
          zip
          country
        }
        lineItems(first: 50) {
          edges {
            node {
              id
              title
              quantity
              originalUnitPrice
              variant {
                id
                title
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Simple and direct Shopify order creation using REST API
export async function createShopifyOrder(orderData: {
  customerInfo: any;
  cart: any[];
  shopifyCustomerId?: string;
}): Promise<{
  success: boolean;
  order?: any;
  errors?: string[];
  simulated?: boolean;
}> {
  const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const shopDomain = process.env.SHOPIFY_ADMIN_DOMAIN;
  const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION || '2024-07';

  if (!adminAccessToken || !shopDomain) {
    console.error('Missing Shopify Admin API credentials');
    return {
      success: false,
      errors: ['Missing Shopify Admin API credentials'],
      simulated: false
    };
  }

  try {
    const { customerInfo, cart } = orderData;

    // First, get the correct variant IDs for all products
    const enrichedCart = await enrichCartWithVariants(cart);

    if (enrichedCart.length === 0) {
      return {
        success: false,
        errors: ['No valid products found in cart'],
        simulated: false
      };
    }

    console.log('Enriched cart with variants:', enrichedCart);

    // Calculate totals
    const subtotal = enrichedCart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    const deliveryFee = 8; // TND

    // Prepare line items for REST API
    const lineItems = enrichedCart.map(item => ({
      variant_id: parseInt(item.variantId.toString()),
      quantity: parseInt(item.quantity.toString()),
      price: parseFloat(item.price).toFixed(2)
    }));

    // Add delivery fee as a custom line item
    lineItems.push({
      variant_id: null as any, // Custom line item doesn't need variant_id
      quantity: 1,
      price: deliveryFee.toFixed(2),
      title: 'Frais de livraison',
      requires_shipping: false,
      taxable: false
    } as any);

    // Prepare draft order payload for REST API
    const draftOrderPayload = {
      draft_order: {
        line_items: lineItems,
        customer: {
          first_name: customerInfo.firstName,
          last_name: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone
        },
        shipping_address: {
          first_name: customerInfo.firstName,
          last_name: customerInfo.lastName,
          address1: customerInfo.address,
          city: customerInfo.city,
          province: customerInfo.state || 'Tunis',
          zip: customerInfo.postalCode || '1000',
          country: customerInfo.country || 'Tunisia',
          phone: customerInfo.phone
        },
        billing_address: {
          first_name: customerInfo.firstName,
          last_name: customerInfo.lastName,
          address1: customerInfo.address,
          city: customerInfo.city,
          province: customerInfo.state || 'Tunis',
          zip: customerInfo.postalCode || '1000',
          country: customerInfo.country || 'Tunisia',
          phone: customerInfo.phone
        },
        note_attributes: [
          {
            name: 'payment_method',
            value: 'Cash on Delivery'
          },
          {
            name: 'order_source',
            value: 'Website'
          }
        ],
        use_customer_default_address: false
      }
    };

    console.log('Creating draft order via REST API:', JSON.stringify(draftOrderPayload, null, 2));

    const url = `https://${shopDomain}/admin/api/${apiVersion}/draft_orders.json`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminAccessToken,
      },
      body: JSON.stringify(draftOrderPayload),
    });

    const responseData = await response.json();

    console.log('REST API response status:', response.status);
    console.log('REST API response data:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      return {
        success: false,
        errors: [responseData.errors || `HTTP ${response.status}: ${response.statusText}`],
        simulated: false
      };
    }

    if (responseData.draft_order) {
      console.log('Successfully created draft order via REST API:', responseData.draft_order.name);

      return {
        success: true,
        simulated: false,
        order: {
          id: `gid://shopify/DraftOrder/${responseData.draft_order.id}`,
          name: responseData.draft_order.name,
          status: responseData.draft_order.status,
          processedAt: new Date().toISOString(),
          totalPriceSet: {
            shopMoney: {
              amount: responseData.draft_order.total_price,
              currencyCode: responseData.draft_order.currency || 'TND'
            }
          },
          customer: responseData.draft_order.customer,
          shippingAddress: responseData.draft_order.shipping_address,
          lineItems: responseData.draft_order.line_items
        }
      };
    }

    return {
      success: false,
      errors: ['No draft order returned from Shopify REST API'],
      simulated: false
    };

  } catch (error) {
    console.error('Error creating draft order via REST API:', error);
    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
      simulated: false
    };
  }
}

// Function to enrich cart items with proper variant IDs
async function enrichCartWithVariants(cart: any[]): Promise<any[]> {
  const enrichedItems = [];

  for (const item of cart) {
    const variantId = item.variantId || item.id;

    // If we have a product ID, get the first variant
    if (variantId && variantId.includes('gid://shopify/Product/')) {
      try {
        const productId = variantId.split('/').pop();
        const variantData = await getFirstVariantForProduct(productId);

        if (variantData) {
          enrichedItems.push({
            ...item,
            variantId: variantData.id,
            price: variantData.price || item.price
          });
          console.log(`Converted product ${productId} to variant ${variantData.id}`);
        } else {
          console.error(`No variant found for product ${productId}`);
        }
      } catch (error) {
        console.error('Error getting variant for product:', variantId, error);
      }
    } else if (variantId && variantId.includes('gid://shopify/ProductVariant/')) {
      // Already a variant ID, extract numeric part
      const numericId = variantId.split('/').pop();
      enrichedItems.push({
        ...item,
        variantId: numericId
      });
    }
  }

  return enrichedItems;
}

// Function to get the first variant of a product
async function getFirstVariantForProduct(productId: string): Promise<any> {
  const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const shopDomain = process.env.SHOPIFY_ADMIN_DOMAIN;
  const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION || '2024-07';

  if (!adminAccessToken || !shopDomain) {
    throw new Error('Missing Shopify Admin API credentials');
  }

  try {
    const url = `https://${shopDomain}/admin/api/${apiVersion}/products/${productId}/variants.json`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminAccessToken,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.variants && data.variants.length > 0) {
      const variant = data.variants[0];
      return {
        id: variant.id,
        price: variant.price
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching product variants:', error);
    return null;
  }
}
