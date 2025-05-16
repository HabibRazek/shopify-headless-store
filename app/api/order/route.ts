import { NextRequest, NextResponse } from 'next/server';
import { createShopifyOrder } from '@/lib/shopifyAdmin';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { customerInfo, cart } = body;

    // Validate required fields
    if (!customerInfo) {
      return NextResponse.json(
        { error: 'Missing customer information' },
        { status: 400 }
      );
    }

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid cart items' },
        { status: 400 }
      );
    }

    // Add delivery fee (8 TND)
    const deliveryFee = 8;

    // Calculate subtotal and total
    const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    const total = subtotal + deliveryFee;

    // Log the order data for debugging
    console.log('Processing order with data:', {
      customer: `${customerInfo.firstName} ${customerInfo.lastName}`,
      email: customerInfo.email,
      items: cart.length,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      total: total
    });

    // Create the order in Shopify (or simulate if no API token)
    const orderData = { customerInfo, cart };
    const shopifyOrderResult = await createShopifyOrder(orderData);

    // Generate a random order number if not provided by Shopify
    const orderNumber = shopifyOrderResult.order?.name?.replace('#', '') ||
                        Math.floor(100000 + Math.random() * 900000).toString();

    // Get the total price from the Shopify order or calculate it
    const totalPrice = shopifyOrderResult.order?.totalPriceSet?.shopMoney?.amount ||
                      (subtotal + deliveryFee).toString();

    // Return success with order information
    return NextResponse.json({
      success: true,
      order: {
        orderNumber,
        processedAt: shopifyOrderResult.order?.processedAt || new Date().toISOString(),
        totalPrice,
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
      shopifyOrder: shopifyOrderResult.simulated ? null : shopifyOrderResult.order,
      simulated: shopifyOrderResult.simulated || false
    });
  } catch (error) {
    console.error('Order API Error:', error);

    // Return a friendly error message
    return NextResponse.json(
      { error: 'Error processing order. Please try again.' },
      { status: 500 }
    );
  }
}
