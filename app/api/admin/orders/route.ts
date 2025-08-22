import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// Helper function to get order statistics
async function getOrderStats(prismaClient: any) {
  try {
    const stats = await prismaClient.order.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    return stats.reduce((acc: any, stat: any) => {
      acc[stat.status] = stat._count.status;
      return acc;
    }, {} as Record<string, number>);
  } catch (error) {
    console.error('Error getting order stats:', error);
    return {};
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    // Check admin permissions
    if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const { default: prisma } = await import('@/lib/prisma');
    
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {};

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { shippingCity: { contains: search, mode: 'insensitive' } },
        { shippingCountry: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      where.status = status;
    }

    // Get orders with pagination
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              image: true
            }
          },
          items: {
            select: {
              id: true,
              title: true,
              quantity: true,
              price: true,
              image: true
            }
          }
        },
        orderBy: {
          [sortBy]: sortOrder as 'asc' | 'desc'
        },
        skip,
        take: limit
      }),
      prisma.order.count({ where })
    ]);

    // If no orders found, try to sync from Shopify automatically
    if (totalCount === 0 && !search && !status) {
      console.log('📭 No orders found in database, attempting to sync from Shopify...');
      try {
        // Trigger a sync from Shopify
        await syncOrdersFromShopify(prisma);

        // Retry fetching orders after sync
        const [syncedOrders, syncedTotalCount] = await Promise.all([
          prisma.order.findMany({
            where,
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                  image: true
                }
              },
              items: {
                select: {
                  id: true,
                  title: true,
                  quantity: true,
                  price: true,
                  image: true
                }
              }
            },
            orderBy: {
              [sortBy]: sortOrder as 'asc' | 'desc'
            },
            skip,
            take: limit
          }),
          prisma.order.count({ where })
        ]);

        if (syncedTotalCount > 0) {
          console.log(`✅ Successfully synced ${syncedTotalCount} orders from Shopify`);
          return NextResponse.json({
            orders: syncedOrders,
            total: syncedTotalCount,
            pagination: {
              page,
              limit,
              totalCount: syncedTotalCount,
              totalPages: Math.ceil(syncedTotalCount / limit),
              hasNext: page < Math.ceil(syncedTotalCount / limit),
              hasPrev: page > 1
            },
            stats: await getOrderStats(prisma)
          });
        }
      } catch (syncError) {
        console.error('❌ Failed to sync orders from Shopify:', syncError);
      }
    }

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      orders,
      total: totalCount,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      stats: await getOrderStats(prisma)
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// Helper function to update order status in Shopify
async function updateShopifyOrderStatus(shopifyOrderId: string, status: string) {
  const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const shopDomain = process.env.SHOPIFY_ADMIN_DOMAIN;
  const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION || '2024-07';

  if (!adminAccessToken || !shopDomain) {
    throw new Error('Missing Shopify Admin API credentials');
  }

  // Extract numeric ID from Shopify order ID
  const numericOrderId = shopifyOrderId.replace('gid://shopify/Order/', '');

  // Map our internal status to Shopify status
  let shopifyStatus = status;
  let fulfillmentStatus = null;

  switch (status) {
    case 'pending':
      shopifyStatus = 'open';
      break;
    case 'confirmed':
      shopifyStatus = 'open';
      break;
    case 'processing':
      shopifyStatus = 'open';
      fulfillmentStatus = 'partial';
      break;
    case 'completed':
      shopifyStatus = 'closed';
      fulfillmentStatus = 'fulfilled';
      break;
    case 'cancelled':
      shopifyStatus = 'cancelled';
      break;
    default:
      shopifyStatus = 'open';
  }

  const url = `https://${shopDomain}/admin/api/${apiVersion}/orders/${numericOrderId}.json`;

  const updateData: any = {
    order: {
      id: numericOrderId
    }
  };

  // Only update status if it's a valid Shopify status
  if (shopifyStatus === 'cancelled') {
    // For cancelled orders, we need to use the cancel endpoint
    const cancelUrl = `https://${shopDomain}/admin/api/${apiVersion}/orders/${numericOrderId}/cancel.json`;

    const response = await fetch(cancelUrl, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': adminAccessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reason: 'other',
        email: false,
        refund: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Failed to cancel Shopify order: ${errorText}`);
      throw new Error(`Failed to cancel Shopify order: ${response.status}`);
    }
  } else if (shopifyStatus === 'closed') {
    // For closed orders, we need to use the close endpoint
    const closeUrl = `https://${shopDomain}/admin/api/${apiVersion}/orders/${numericOrderId}/close.json`;

    const response = await fetch(closeUrl, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': adminAccessToken,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Failed to close Shopify order: ${errorText}`);
      throw new Error(`Failed to close Shopify order: ${response.status}`);
    }
  }

  console.log(`✅ Updated Shopify order ${numericOrderId} status to ${shopifyStatus}`);
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    // Check admin permissions
    if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    const { default: prisma } = await import('@/lib/prisma');

    // Get the order first to check if it has a Shopify order ID
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      select: { shopifyOrderId: true }
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update status in Shopify if the order has a Shopify order ID
    if (existingOrder.shopifyOrderId) {
      try {
        await updateShopifyOrderStatus(existingOrder.shopifyOrderId, status);
        console.log(`✅ Successfully updated Shopify order status`);
      } catch (shopifyError) {
        console.error('❌ Failed to update Shopify order status:', shopifyError);
        // Continue with local update even if Shopify update fails
      }
    }

    // Update the order in our database
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true
          }
        },
        items: true
      }
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      shopifyUpdated: !!existingOrder.shopifyOrderId
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}



// Helper function to sync orders from Shopify
async function syncOrdersFromShopify(prisma: any) {
  const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const shopDomain = process.env.SHOPIFY_ADMIN_DOMAIN;
  const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION || '2024-07';

  if (!adminAccessToken || !shopDomain) {
    throw new Error('Missing Shopify Admin API credentials');
  }

  // Fetch recent orders from Shopify
  const url = `https://${shopDomain}/admin/api/${apiVersion}/orders.json?limit=50&status=any&financial_status=any&fulfillment_status=any`;

  console.log('📡 Fetching recent orders from Shopify...');

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': adminAccessToken,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ Shopify API error: ${response.status} - ${errorText}`);
    throw new Error(`Shopify API error: ${response.status}`);
  }

  const data = await response.json();
  const orders = data.orders || [];

  console.log(`📦 Fetched ${orders.length} orders from Shopify`);

  // Sync each order to database
  for (const shopifyOrder of orders) {
    try {
      await syncOrderToDatabase(shopifyOrder, prisma);
    } catch (error) {
      console.error(`❌ Error syncing order ${shopifyOrder.name}:`, error);
    }
  }

  return orders.length;
}

// Helper function to sync a single order to database
async function syncOrderToDatabase(shopifyOrder: any, prisma: any) {
  try {
    // Check if order already exists
    const existingOrder = await prisma.order.findFirst({
      where: {
        shopifyOrderId: String(shopifyOrder.id)
      }
    });

    if (existingOrder) {
      // Update existing order
      return await prisma.order.update({
        where: { id: existingOrder.id },
        data: {
          status: mapShopifyStatus(shopifyOrder.financial_status, shopifyOrder.fulfillment_status),
          total: parseFloat(shopifyOrder.total_price),
          currency: shopifyOrder.currency,
          updatedAt: new Date(),
        }
      });
    }

    // Find or create user based on email
    let user = null;
    if (shopifyOrder.customer?.email) {
      user = await prisma.user.findUnique({
        where: { email: shopifyOrder.customer.email }
      });

      if (!user) {
        // Create new user for this order
        user = await prisma.user.create({
          data: {
            email: shopifyOrder.customer.email,
            name: `${shopifyOrder.customer.first_name || ''} ${shopifyOrder.customer.last_name || ''}`.trim(),
            shopifyCustomerId: shopifyOrder.customer.id,
            phone: shopifyOrder.customer.phone,
            role: 'user',
            status: 'active'
          }
        });
      }
    }

    // Create new order without userId if user doesn't exist
    const orderData: any = {
      orderNumber: shopifyOrder.name.replace('#', ''),
      shopifyOrderId: String(shopifyOrder.id),
      status: mapShopifyStatus(shopifyOrder.financial_status, shopifyOrder.fulfillment_status),
      total: parseFloat(shopifyOrder.total_price),
      currency: shopifyOrder.currency,
      paymentMethod: 'Shopify',
      shippingAddress: shopifyOrder.shipping_address?.address1,
      shippingCity: shopifyOrder.shipping_address?.city,
      shippingCountry: shopifyOrder.shipping_address?.country,
      shippingPostalCode: shopifyOrder.shipping_address?.zip,
      createdAt: new Date(shopifyOrder.created_at),
      updatedAt: new Date(shopifyOrder.updated_at),
    };

    // Only add userId if user exists
    if (user?.id) {
      orderData.userId = user.id;
    }

    const newOrder = await prisma.order.create({
      data: orderData
    });

    // Create order items
    if (shopifyOrder.line_items && shopifyOrder.line_items.length > 0) {
      await prisma.orderItem.createMany({
        data: shopifyOrder.line_items.map((item: any) => ({
          orderId: newOrder.id,
          productId: item.variant_id || item.product_id,
          title: item.title,
          price: parseFloat(item.price),
          quantity: item.quantity,
        }))
      });
    }

    return newOrder;
  } catch (error) {
    console.error('Error syncing order to database:', error);
    throw error;
  }
}

// Helper function to map Shopify status to internal status
function mapShopifyStatus(financialStatus: string, fulfillmentStatus: string | null): string {
  if (fulfillmentStatus === 'fulfilled') return 'delivered';
  if (financialStatus === 'refunded') return 'cancelled';
  if (financialStatus === 'paid' && fulfillmentStatus === 'partial') return 'shipped';
  if (financialStatus === 'paid') return 'confirmed';
  if (financialStatus === 'pending') return 'pending_payment';
  if (financialStatus === 'voided') return 'cancelled';

  return 'pending';
}
