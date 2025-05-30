import { NextRequest, NextResponse } from 'next/server';
import { createShopifyOrder } from '@/lib/shopifyAdmin';
import { auth } from '@/auth';
import { createOrUpdateShopifyCustomer } from '@/lib/shopifyCustomer';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { customerInfo, cart, userId } = body;

    // Log the received data for debugging
    console.log('Received order data:', {
      customerInfoReceived: !!customerInfo,
      cartReceived: !!cart,
      cartIsArray: Array.isArray(cart),
      cartLength: cart ? (Array.isArray(cart) ? cart.length : 'not an array') : 'no cart',
      bodyKeys: Object.keys(body),
      customerInfo: customerInfo ? {
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        email: customerInfo.email,
        hasAddress: !!customerInfo.address
      } : null
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
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
    const missingFields = requiredFields.filter(field => !customerInfo[field]);

    if (missingFields.length > 0) {
      console.log('Validation failed: Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
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

    // Validate cart items
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
        quantity: item.quantity,
        variantId: item.variantId || (item as any).id
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

    // Get the current user session
    const session = await auth();

    // Create or update Shopify customer
    let shopifyCustomerId = null;
    try {
      // Create or update the customer in Shopify
      const shopifyCustomer = await createOrUpdateShopifyCustomer({
        email: customerInfo.email,
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        phone: customerInfo.phone,
        address: {
          address1: customerInfo.address,
          city: customerInfo.city,
          province: customerInfo.state,
          zip: customerInfo.postalCode,
          country: customerInfo.country
        }
      });

      if (shopifyCustomer && shopifyCustomer.id) {
        shopifyCustomerId = shopifyCustomer.id;
        console.log('Using Shopify customer ID:', shopifyCustomerId);

        // If user is logged in but doesn't have a Shopify customer ID, update their record
        if (session?.user?.id && process.env.DATABASE_URL && process.env.SKIP_ENV_VALIDATION !== '1') {
          const { default: prisma } = await import('@/lib/prisma');

          const user = await prisma.user.findUnique({
            where: { id: session.user.id }
          });

          if (user && !user.shopifyCustomerId) {
            await prisma.user.update({
              where: { id: session.user.id },
              data: { shopifyCustomerId }
            });
            console.log('Updated user with Shopify customer ID');
          }
        }
      }
    } catch (shopifyError) {
      console.error('Error with Shopify customer:', shopifyError);
      // Continue with order creation even if customer creation fails
    }

    // Create the order in Shopify
    console.log('Creating Shopify order...');
    const orderData = {
      customerInfo,
      cart,
      shopifyCustomerId // Pass the Shopify customer ID to link the order
    };
    const shopifyOrderResult = await createShopifyOrder(orderData);

    console.log('Shopify order result:', {
      success: shopifyOrderResult.success,
      simulated: shopifyOrderResult.simulated,
      orderName: shopifyOrderResult.order?.name,
      errors: shopifyOrderResult.errors
    });

    if (!shopifyOrderResult.success) {
      console.error('Failed to create Shopify order:', shopifyOrderResult.errors);
      return NextResponse.json(
        {
          error: 'Failed to create order in Shopify: ' + (shopifyOrderResult.errors?.join(', ') || 'Unknown error'),
          details: shopifyOrderResult.errors
        },
        { status: 500 }
      );
    }

    // Generate a random order number if not provided by Shopify
    const orderNumber = shopifyOrderResult.order?.name?.replace('#', '') ||
                        Math.floor(100000 + Math.random() * 900000).toString();

    // Get the total price from the Shopify order or calculate it
    const totalPrice = shopifyOrderResult.order?.totalPriceSet?.shopMoney?.amount ||
                      (subtotal + deliveryFee).toString();

    // Save the order to the database if user is logged in
    let savedOrder = null;
    if (session?.user?.id && process.env.DATABASE_URL && process.env.SKIP_ENV_VALIDATION !== '1') {
      try {
        // Dynamic import to avoid build-time issues
        const { default: prisma } = await import('@/lib/prisma');

        // Create the order in the database
        savedOrder = await prisma.order.create({
          data: {
            userId: session.user.id,
            orderNumber: orderNumber,
            shopifyOrderId: shopifyOrderResult.order?.id || null,
            status: 'pending',
            total: parseFloat(totalPrice),
            items: {
              create: cart.map(item => ({
                productId: item.variantId || 'unknown',
                title: item.title,
                price: parseFloat(item.price),
                quantity: item.quantity,
                image: item.image || null
              }))
            }
          },
          include: {
            items: true
          }
        });

        console.log('Order saved to database:', savedOrder.id);
      } catch (error) {
        console.error('Error saving order to database:', error);
        // Continue with the order process even if saving to database fails
      }
    } else {
      console.log('User not logged in or database not available, order not saved to database');
    }

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
      simulated: shopifyOrderResult.simulated || false,
      savedToDatabase: !!savedOrder,
      userLoggedIn: !!session?.user
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
