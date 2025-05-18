import { NextRequest, NextResponse } from 'next/server';
import { createShopifyOrder } from '@/lib/shopifyAdmin';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { customerInfo, cart } = body;

    // Log the received data for debugging
    console.log('Received order data:', {
      customerInfoReceived: !!customerInfo,
      cartReceived: !!cart,
      cartIsArray: Array.isArray(cart),
      cartLength: cart ? (Array.isArray(cart) ? cart.length : 'not an array') : 'no cart',
      bodyKeys: Object.keys(body)
    });

    // Validate required fields
    if (!customerInfo) {
      console.log('Validation failed: Missing customer information');
      return NextResponse.json(
        { error: 'Missing customer information' },
        { status: 400 }
      );
    }

    // Validate customer info fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'postalCode', 'country'];
    const missingFields = requiredFields.filter(field => !customerInfo[field]);

    if (missingFields.length > 0) {
      console.log('Validation failed: Missing customer fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required customer information: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      console.log('Validation failed: Missing or invalid cart items');
      return NextResponse.json(
        { error: 'Missing or invalid cart items' },
        { status: 400 }
      );
    }

    // Validate each cart item has the minimum required fields
    try {
      // Log the cart items for debugging
      console.log('Cart items to validate:', cart.map(item => ({
        variantId: item.variantId,
        id: (item as any).id,
        title: item.title,
        price: item.price,
        quantity: item.quantity
      })));

      // Check if each cart item has the required fields
      const invalidItems = cart.filter(item => {
        // Check for required fields
        const hasRequiredFields =
          item.title &&
          item.price &&
          item.quantity &&
          typeof item.quantity === 'number';

        // Check for either variantId or id
        const hasIdentifier = item.variantId || (item as any).id;

        return !hasRequiredFields || !hasIdentifier;
      });

      if (invalidItems.length > 0) {
        console.log('Validation failed: Invalid cart items:', invalidItems);
        return NextResponse.json(
          { error: 'One or more items in your cart are invalid' },
          { status: 400 }
        );
      }

      // Log the valid cart items
      console.log('Valid cart items:', cart.map(item => ({
        title: item.title,
        price: item.price,
        quantity: item.quantity
      })));
    } catch (error) {
      console.error('Error validating cart items:', error);
      return NextResponse.json(
        { error: 'Error validating cart items' },
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
