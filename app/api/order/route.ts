import { NextRequest, NextResponse } from 'next/server';
import { createShopifyOrder } from '@/lib/shopifyAdmin';
import { auth } from '@/auth';
import { createOrUpdateShopifyCustomer } from '@/lib/shopifyCustomer';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    // Check if request is FormData (for file uploads) or JSON
    const contentType = request.headers.get('content-type');
    let customerInfo, cart, bankReceipt = null;

    if (contentType?.includes('multipart/form-data')) {
      // Handle FormData (with file upload)
      const formData = await request.formData();
      const orderDataString = formData.get('orderData') as string;
      const orderData = JSON.parse(orderDataString);
      customerInfo = orderData.customerInfo;
      cart = orderData.cart;
      bankReceipt = formData.get('bankReceipt') as File | null;
    } else {
      // Handle JSON (legacy support)
      const body = await request.json();
      customerInfo = body.customerInfo;
      cart = body.cart;
    }

    // Log the received data for debugging
    console.log('Received order data:', {
      customerInfoReceived: !!customerInfo,
      cartReceived: !!cart,
      cartIsArray: Array.isArray(cart),
      cartLength: cart ? (Array.isArray(cart) ? cart.length : 'not an array') : 'no cart',
      paymentMethod: customerInfo?.paymentMethod,
      hasBankReceipt: !!bankReceipt,
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

    // Handle bank receipt file upload
    let bankReceiptPath = null;
    if (bankReceipt && bankReceipt.size > 0) {
      try {
        const bytes = await bankReceipt.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const timestamp = Date.now();
        const filename = `order_receipt_${timestamp}_${bankReceipt.name}`;
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'receipts');

        // Save file
        await writeFile(join(uploadDir, filename), buffer);
        bankReceiptPath = `/uploads/receipts/${filename}`;
        console.log('Bank receipt saved:', bankReceiptPath);
      } catch (error) {
        console.error('Error saving bank receipt:', error);
        // Continue without file if upload fails
      }
    }

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
      shopifyCustomerId: shopifyCustomerId || undefined // Pass the Shopify customer ID to link the order
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
    if (session?.user?.id) {
      try {
        console.log('Attempting to save order to database for user:', session.user.id);

        // Dynamic import to avoid build-time issues
        const { default: prisma } = await import('@/lib/prisma');

        // First, ensure the user exists in the database
        const existingUser = await prisma.user.findUnique({
          where: { id: session.user.id }
        });

        if (!existingUser) {
          console.log('User not found in database, creating user:', session.user.id);

          // Use the same logic as test-order API that works
          try {
            // Try to find existing user by email first
            const userEmail = session.user.email || customerInfo.email || `user-${session.user.id}@example.com`;
            const existingUserByEmail = await prisma.user.findUnique({
              where: { email: userEmail }
            });

            if (existingUserByEmail) {
              // Update existing user with new ID if needed
              await prisma.user.update({
                where: { email: userEmail },
                data: {
                  id: session.user.id,
                  name: session.user.name || `${customerInfo.firstName} ${customerInfo.lastName}`,
                  image: session.user.image || null,
                }
              });
              console.log('✅ Updated existing user with new ID');
            } else {
              // Create new user
              await prisma.user.create({
                data: {
                  id: session.user.id,
                  email: userEmail,
                  name: session.user.name || `${customerInfo.firstName} ${customerInfo.lastName}`,
                  emailVerified: null,
                  image: session.user.image || null,
                }
              });
              console.log('✅ Created new user');
            }
          } catch (userError) {
            console.error('❌ Error creating/updating user:', userError);
            // Try upsert as fallback
            await prisma.user.upsert({
              where: { id: session.user.id },
              update: {
                name: session.user.name || `${customerInfo.firstName} ${customerInfo.lastName}`,
                image: session.user.image || null,
              },
              create: {
                id: session.user.id,
                email: `user-${Date.now()}-${session.user.id}@example.com`, // Use unique email
                name: session.user.name || `${customerInfo.firstName} ${customerInfo.lastName}`,
                emailVerified: null,
                image: session.user.image || null,
              }
            });
            console.log('✅ User created/updated via fallback upsert');
          }
        } else {
          console.log('✅ User already exists in database');
        }

        // Create the order in the database
        savedOrder = await prisma.order.create({
          data: {
            userId: session.user.id,
            orderNumber: orderNumber,
            shopifyOrderId: shopifyOrderResult.order?.id || null,
            status: customerInfo.paymentMethod === 'bankTransfer' ? 'pending_payment' : 'pending',
            total: parseFloat(totalPrice),
            currency: 'TND',
            paymentMethod: customerInfo.paymentMethod === 'bankTransfer' ? 'Virement bancaire' : 'Paiement à la livraison',
            bankReceiptPath: bankReceiptPath,
            shippingAddress: customerInfo.address,
            shippingCity: customerInfo.city,
            shippingPostalCode: customerInfo.postalCode,
            shippingCountry: customerInfo.country,
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

        console.log('✅ Order saved to database successfully:', savedOrder.id);
        console.log('Order details:', {
          orderNumber: savedOrder.orderNumber,
          userId: savedOrder.userId,
          total: savedOrder.total,
          itemsCount: savedOrder.items?.length || 0
        });
      } catch (error) {
        console.error('❌ Error saving order to database:', error);
        console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
        // Continue with the order process even if saving to database fails
      }
    } else {
      console.log('❌ User not logged in, order not saved to database');
      console.log('Session info:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id
      });
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
          paymentMethod: customerInfo.paymentMethod === 'bankTransfer' ? 'Virement bancaire' : 'Paiement à la livraison',
          notes: customerInfo.notes || '',
          bankReceiptPath: bankReceiptPath
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
