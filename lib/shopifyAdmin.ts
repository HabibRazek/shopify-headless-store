/**
 * Shopify Admin API utilities
 * Note: These functions simulate admin operations for development
 * In production, you would need proper Shopify Admin API credentials
 */

// Simulate admin fetch for development
export async function shopifyAdminFetch({
  query,
  variables
}: {
  query: string;
  variables?: Record<string, any>;
}): Promise<{ status: number; body: any }> {
  // Simulate admin API call for development
  
  // Simulate successful response for customer operations
  if (query.includes('customers')) {
    return {
      status: 200,
      body: {
        data: {
          customers: {
            edges: []
          }
        }
      }
    };
  }
  
  if (query.includes('customerCreate')) {
    return {
      status: 200,
      body: {
        data: {
          customerCreate: {
            customer: {
              id: `gid://shopify/Customer/${Math.floor(Math.random() * 1000000)}`,
              email: variables?.input?.email || 'test@example.com',
              firstName: variables?.input?.firstName || '',
              lastName: variables?.input?.lastName || ''
            },
            userErrors: []
          }
        }
      }
    };
  }
  
  if (query.includes('customerUpdate')) {
    return {
      status: 200,
      body: {
        data: {
          customerUpdate: {
            customer: {
              id: variables?.input?.id || 'gid://shopify/Customer/123',
              email: variables?.input?.email || 'test@example.com',
              firstName: variables?.input?.firstName || '',
              lastName: variables?.input?.lastName || ''
            },
            userErrors: []
          }
        }
      }
    };
  }
  
  // Default response
  return {
    status: 200,
    body: { data: {} }
  };
}

// Simulate order creation
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
  // Simulate order creation for development
  
  // Simulate order creation
  const orderNumber = Math.floor(100000 + Math.random() * 900000);
  const total = orderData.cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  
  return {
    success: true,
    simulated: true,
    order: {
      id: `gid://shopify/Order/${orderNumber}`,
      name: `#${orderNumber}`,
      processedAt: new Date().toISOString(),
      totalPriceSet: {
        shopMoney: {
          amount: total.toString(),
          currencyCode: 'TND'
        }
      },
      customer: orderData.shopifyCustomerId ? {
        id: orderData.shopifyCustomerId
      } : null
    }
  };
}
