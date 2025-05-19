import { GraphQLClient } from 'graphql-request';

// Shopify Admin API configuration
const shopifyAdminDomain = process.env.SHOPIFY_ADMIN_DOMAIN || 'udcrg6-jn.myshopify.com';
const shopifyAdminApiVersion = process.env.SHOPIFY_ADMIN_API_VERSION || '2024-07';
const shopifyAdminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '';

// For debugging
console.log('Shopify Admin API Configuration:');
console.log('Domain:', shopifyAdminDomain);
console.log('API Version:', shopifyAdminApiVersion);
console.log('Access Token Available:', !!shopifyAdminAccessToken);

// Create a GraphQL client for the Shopify Admin API
const adminClient = new GraphQLClient(
  `https://${shopifyAdminDomain}/admin/api/${shopifyAdminApiVersion}/graphql.json`,
  {
    headers: {
      'X-Shopify-Access-Token': shopifyAdminAccessToken,
      'Content-Type': 'application/json',
    },
  }
);

// IMPORTANT MESSAGE FOR STORE OWNER
console.log('\n==================================================');
console.log('IMPORTANT MESSAGE FOR STORE OWNER:');
console.log('==================================================');
console.log('To create real orders in Shopify, you need to:');
console.log('1. Create a custom app in your Shopify admin');
console.log('2. Generate an Admin API access token with these permissions:');
console.log('   - write_orders');
console.log('   - write_draft_orders');
console.log('   - write_customers');
console.log('3. Update your .env.local file with the new token');
console.log('==================================================\n');

// Function to create an order in Shopify (simplified version)
export async function createShopifyOrder(orderData: any) {
  try {
    console.log('Creating order with data:', JSON.stringify(orderData, null, 2));

    // If no admin access token is available, return a simulated order
    if (!shopifyAdminAccessToken) {
      console.log('No Shopify Admin access token provided. Simulating order creation.');

      // Generate a random order number
      const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();

      return {
        success: true,
        simulated: true,
        order: {
          id: `gid://shopify/Order/${orderNumber}`,
          name: `#${orderNumber}`,
          processedAt: new Date().toISOString(),
          totalPrice: {
            amount: calculateTotal(orderData.cart),
            currencyCode: 'TND'
          }
        }
      };
    }

    // Log the cart items for debugging
    console.log('Creating order with cart items:', orderData.cart.map((item: any) => ({
      variantId: item.variantId,
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity
    })));

    // Format line items for the order
    const lineItems = [
      // Product items
      ...orderData.cart.map((item: any) => ({
        title: item.title,
        quantity: item.quantity,
        originalUnitPrice: item.price
      })),
      // Add delivery fee as a separate line item
      {
        title: "Delivery Fee",
        quantity: 1,
        originalUnitPrice: "8.00"
      }
    ];

    // We'll add the delivery fee as a note instead of a line item
    const deliveryFeeNote = "Delivery Fee: 8.00 TND";

    // Format shipping address
    const shippingAddress = {
      firstName: orderData.customerInfo.firstName,
      lastName: orderData.customerInfo.lastName,
      address1: orderData.customerInfo.address,
      city: orderData.customerInfo.city,
      province: orderData.customerInfo.state,
      zip: orderData.customerInfo.postalCode,
      country: orderData.customerInfo.country,
      phone: orderData.customerInfo.phone,
    };

    // Create a draft order with delivery fee
    const createDraftOrderMutation = `
      mutation draftOrderCreate($input: DraftOrderInput!) {
        draftOrderCreate(input: $input) {
          draftOrder {
            id
            name
            totalPrice
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    // Calculate the total price including delivery fee
    const subtotal = parseFloat(calculateTotal(orderData.cart));
    const deliveryFeeAmount = 8.00;
    const total = (subtotal + deliveryFeeAmount).toFixed(2);

    // Calculate the total price including delivery fee

    const draftOrderInput: any = {
      // Add delivery fee as a separate line item
      appliedDiscount: null,
      // Only include product items - we'll add shipping fee separately
      lineItems: lineItems,
      // Add shipping line for delivery fee
      shippingLine: {
        title: "Delivery Fee",
        price: deliveryFeeAmount.toFixed(2)
      },
      shippingAddress: {
        address1: shippingAddress.address1,
        city: shippingAddress.city,
        province: shippingAddress.province,
        zip: shippingAddress.zip,
        country: shippingAddress.country,
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        phone: shippingAddress.phone
      },
      billingAddress: {
        address1: shippingAddress.address1,
        city: shippingAddress.city,
        province: shippingAddress.province,
        zip: shippingAddress.zip,
        country: shippingAddress.country,
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        phone: shippingAddress.phone
      },
      customAttributes: [
        { key: "payment_method", value: "Cash on Delivery" },
        { key: "delivery_fee", value: "8.00 TND" }
      ],
      note: `${deliveryFeeNote}\n${orderData.customerInfo.notes || "Cash on Delivery order"}`,
      email: orderData.customerInfo.email,
      tags: ["cash-on-delivery", "headless-store"]
    };

    // If we have a Shopify customer ID, associate the order with the customer
    if (orderData.shopifyCustomerId) {
      draftOrderInput.customerId = orderData.shopifyCustomerId;
      console.log(`Associating order with Shopify customer ID: ${orderData.shopifyCustomerId}`);
    }

    const variables = {
      input: draftOrderInput
    };



    try {
      // Create the draft order
      const response = await adminClient.request(createDraftOrderMutation, { input: variables.input });

      // Type assertion to handle the unknown type
      const typedResponse = response as {
        draftOrderCreate?: {
          draftOrder?: {
            id: string;
            name: string;
            totalPrice: string
          };
          userErrors?: Array<{ field: string; message: string }>
        }
      };

      if (typedResponse.draftOrderCreate?.draftOrder?.id) {
        // Draft order created successfully
        return {
          success: true,
          order: {
            id: typedResponse.draftOrderCreate.draftOrder.id,
            name: typedResponse.draftOrderCreate.draftOrder.name,
            processedAt: new Date().toISOString(),
            totalPriceSet: {
              shopMoney: {
                amount: typedResponse.draftOrderCreate.draftOrder.totalPrice,
                currencyCode: 'TND'
              }
            }
          },
          errors: []
        };
      } else {
        // Failed to create draft order
        console.error('Failed to create draft order:', typedResponse.draftOrderCreate?.userErrors);

        // Return a simulated order as fallback
        const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();
        return {
          success: true,
          simulated: true,
          order: {
            id: `gid://shopify/Order/${orderNumber}`,
            name: `#${orderNumber}`,
            processedAt: new Date().toISOString(),
            totalPriceSet: {
              shopMoney: {
                amount: total,
                currencyCode: 'TND'
              }
            }
          }
        };
      }
    } catch (error) {
      console.error('Shopify API error:', error);

      // Return a simulated order as fallback
      const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();
      return {
        success: true,
        simulated: true,
        error: error instanceof Error ? error.message : String(error),
        order: {
          id: `gid://shopify/Order/${orderNumber}`,
          name: `#${orderNumber}`,
          processedAt: new Date().toISOString(),
          totalPriceSet: {
            shopMoney: {
              amount: total,
              currencyCode: 'TND'
            }
          }
        }
      };
    }
  } catch (error) {
    console.error("Error creating Shopify order:", error);

    // Return a simulated order as ultimate fallback
    const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();
    const subtotal = parseFloat(calculateTotal(orderData.cart));
    const deliveryFeeAmount = 8.00;
    const total = (subtotal + deliveryFeeAmount).toFixed(2);

    return {
      success: true,
      simulated: true,
      fallback: true,
      error: error instanceof Error ? error.message : String(error),
      order: {
        id: `gid://shopify/Order/${orderNumber}`,
        name: `#${orderNumber}`,
        processedAt: new Date().toISOString(),
        totalPriceSet: {
          shopMoney: {
            amount: total,
            currencyCode: 'TND'
          }
        }
      }
    };
  }
}

// Helper function to calculate total price
function calculateTotal(cart: Array<{ price: string; quantity: number }>): string {
  return cart.reduce((total, item) => {
    return total + (parseFloat(item.price) * item.quantity);
  }, 0).toFixed(2);
}

// Generic function to fetch from Shopify Admin API
export async function shopifyAdminFetch({ query, variables = {} }: { query: string; variables?: any }) {
  try {
    if (!shopifyAdminAccessToken) {
      console.warn('No Shopify Admin access token provided. API call will fail.');
      return { status: 401, body: { error: 'No access token' } };
    }

    const data = await adminClient.request(query, variables);
    return { status: 200, body: data };
  } catch (error) {
    console.error('Shopify Admin API error:', error);
    return {
      status: 500,
      body: {
        error: error instanceof Error ? error.message : String(error)
      }
    };
  }
}
