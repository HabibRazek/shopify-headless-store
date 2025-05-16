import { NextRequest, NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';
import { createShopifyOrder } from '@/lib/shopifyAdmin';
import {
  CREATE_CHECKOUT,
  ADD_TO_CHECKOUT
} from '@/lib/queries';

export async function POST(request: NextRequest) {
  try {
    const { items, checkoutId, customerInfo, action, cart } = await request.json();

    // Handle different checkout actions
    switch (action) {
      // Create or update checkout with items
      case 'create':
        // If cartId is provided, we need to recreate the cart with all items
        // This is because Shopify's API doesn't allow updating the entire cart at once
        if (checkoutId) {
          try {
            // Create a new cart with all items
            const { status, body } = await shopifyFetch({
              query: CREATE_CHECKOUT,
              variables: {
                input: {
                  lines: items.map((item: any) => ({
                    merchandiseId: item.variantId,
                    quantity: item.quantity
                  })),
                },
              },
            });

            if (status === 200) {
              // Type assertion to handle the unknown type
              const typedBody = body as Record<string, any>;
              return NextResponse.json(typedBody);
            } else {
              console.error('Error recreating cart:', body);
              return NextResponse.json(
                { error: 'Error recreating cart with all items' },
                { status }
              );
            }
          } catch (error) {
            console.error('Error recreating cart:', error);
            return NextResponse.json(
              { error: 'Error recreating cart with all items' },
              { status: 500 }
            );
          }
        }
        // Otherwise create a new cart
        else {
          const { status, body } = await shopifyFetch({
            query: CREATE_CHECKOUT,
            variables: {
              input: {
                lines: items.map((item: any) => ({
                  merchandiseId: item.variantId,
                  quantity: item.quantity
                })),
              },
            },
          });

          if (status === 200) {
            // Type assertion to handle the unknown type
            const typedBody = body as Record<string, any>;
            return NextResponse.json(typedBody);
          } else {
            return NextResponse.json(
              { error: 'Error creating cart' },
              { status }
            );
          }
        }

      // Process order with customer information and create in Shopify
      case 'complete':
        if (!customerInfo || !cart) {
          return NextResponse.json(
            { error: 'Missing customer information or cart items' },
            { status: 400 }
          );
        }

        try {
          // Create the order in Shopify using the Admin API
          const orderData = {
            customerInfo,
            cart
          };

          const shopifyOrderResult = await createShopifyOrder(orderData);

          if (!shopifyOrderResult.success) {
            console.error('Error creating Shopify order:', shopifyOrderResult.errors);
            return NextResponse.json(
              { error: 'Failed to create order in Shopify' },
              { status: 500 }
            );
          }

          // Get the order number from the Shopify response or use a simulated one
          const orderNumber = shopifyOrderResult.order?.name?.replace('#', '') ||
                             Math.floor(100000 + Math.random() * 900000).toString();

          // Return success with order information
          return NextResponse.json({
            success: true,
            order: {
              orderNumber: orderNumber,
              processedAt: shopifyOrderResult.order?.processedAt || new Date().toISOString(),
              customerInfo: {
                name: `${customerInfo.firstName} ${customerInfo.lastName}`,
                email: customerInfo.email,
                phone: customerInfo.phone,
                address: customerInfo.address,
                city: customerInfo.city,
                state: customerInfo.state,
                postalCode: customerInfo.postalCode,
                country: customerInfo.country,
                paymentMethod: 'Cash on Delivery',
                notes: customerInfo.notes || ''
              }
            },
            shopifyOrder: shopifyOrderResult.simulated ? null : shopifyOrderResult.order
          });
        } catch (error) {
          console.error('Error processing order:', error);
          return NextResponse.json(
            { error: 'Error processing order' },
            { status: 500 }
          );
        }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Checkout API Error:', error);
    return NextResponse.json(
      { error: 'Error processing checkout' },
      { status: 500 }
    );
  }
}
