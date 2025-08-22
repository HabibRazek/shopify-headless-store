import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

interface ShopifyOrder {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  total_price: string;
  currency: string;
  financial_status: string;
  fulfillment_status: string | null;
  customer: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
  } | null;
  shipping_address: {
    first_name: string;
    last_name: string;
    address1: string;
    address2: string | null;
    city: string;
    province: string;
    country: string;
    zip: string;
    phone: string | null;
  } | null;
  line_items: Array<{
    id: string;
    product_id: string;
    variant_id: string;
    title: string;
    quantity: number;
    price: string;
    name: string;
  }>;
}

async function fetchShopifyOrders(limit = 250, sinceId?: string, pageInfo?: string): Promise<{
  orders: ShopifyOrder[];
  hasMore: boolean;
  nextPageInfo?: string;
}> {
  const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const shopDomain = process.env.SHOPIFY_ADMIN_DOMAIN;
  const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION || '2024-07';

  if (!adminAccessToken || !shopDomain) {
    throw new Error('Missing Shopify Admin API credentials');
  }

  // Fetch all orders including archived ones with comprehensive parameters
  let url = `https://${shopDomain}/admin/api/${apiVersion}/orders.json?limit=${limit}&status=any&financial_status=any&fulfillment_status=any&fields=id,name,email,created_at,updated_at,cancelled_at,closed_at,processed_at,currency,total_price,subtotal_price,total_tax,total_discounts,financial_status,fulfillment_status,order_status_url,line_items,shipping_address,billing_address,customer,tags,note,order_number,source_name`;

  if (pageInfo) {
    url += `&page_info=${pageInfo}`;
  } else if (sinceId) {
    url += `&since_id=${sinceId}`;
  }

  console.log(`📡 Fetching orders from Shopify (limit: ${limit})...`);

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
    throw new Error(`Shopify API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const orders = data.orders || [];

  console.log(`📦 Fetched ${orders.length} orders from Shopify`);

  // Check pagination using Link header
  const linkHeader = response.headers.get('Link');
  let hasMore = false;
  let nextPageInfo = undefined;

  if (linkHeader) {
    const nextMatch = linkHeader.match(/<[^>]*[?&]page_info=([^&>]+)[^>]*>;\s*rel="next"/);
    if (nextMatch) {
      hasMore = true;
      nextPageInfo = nextMatch[1];
    }
  }

  return { orders, hasMore, nextPageInfo };
}

async function syncOrderToDatabase(shopifyOrder: ShopifyOrder, prisma: any) {
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

    // Create new order data
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
        data: shopifyOrder.line_items.map(item => ({
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

function mapShopifyStatus(financialStatus: string, fulfillmentStatus: string | null): string {
  // Map Shopify statuses to our internal statuses
  if (fulfillmentStatus === 'fulfilled') return 'completed';
  if (financialStatus === 'refunded') return 'refunded';
  if (financialStatus === 'paid' && fulfillmentStatus === 'partial') return 'processing';
  if (financialStatus === 'paid') return 'confirmed';
  if (financialStatus === 'pending') return 'pending_payment';
  if (financialStatus === 'voided') return 'cancelled';
  
  return 'pending';
}

export async function POST(request: NextRequest) {
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
    
    let totalSynced = 0;
    let totalUpdated = 0;
    let totalCreated = 0;
    let hasMore = true;
    let sinceId: string | undefined;
    let pageInfo: string | undefined;
    let batchCount = 0;

    console.log('🔄 Starting comprehensive Shopify orders synchronization...');

    while (hasMore) {
      try {
        batchCount++;
        console.log(`📦 Processing batch ${batchCount}...`);

        const { orders, hasMore: moreOrders, nextPageInfo } = await fetchShopifyOrders(250, sinceId, pageInfo);
        hasMore = moreOrders;
        pageInfo = nextPageInfo;

        if (orders.length === 0) {
          console.log('📭 No more orders to process');
          break;
        }

        console.log(`📦 Processing batch of ${orders.length} orders...`);

        // Process orders in smaller chunks to avoid memory issues
        const chunkSize = 50;
        for (let i = 0; i < orders.length; i += chunkSize) {
          const chunk = orders.slice(i, i + chunkSize);

          for (const shopifyOrder of chunk) {
            try {
              const existingOrder = await prisma.order.findFirst({
                where: { shopifyOrderId: String(shopifyOrder.id) }
              });

              await syncOrderToDatabase(shopifyOrder, prisma);

              if (existingOrder) {
                totalUpdated++;
              } else {
                totalCreated++;
              }
              totalSynced++;

              // Log progress every 10 orders
              if (totalSynced % 10 === 0) {
                console.log(`✅ Processed ${totalSynced} orders so far...`);
              }
            } catch (orderError) {
              console.error(`❌ Error syncing order ${shopifyOrder.name}:`, orderError);
            }
          }
        }

        // Set pagination info for next iteration
        if (orders.length > 0 && !pageInfo) {
          sinceId = orders[orders.length - 1].id;
          console.log(`➡️ Next batch will start from order ID: ${sinceId}`);
        } else if (pageInfo) {
          console.log(`➡️ Next batch will use page info: ${pageInfo.substring(0, 20)}...`);
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (batchError) {
        console.error('❌ Error in batch processing:', batchError);
        // Don't break completely, try to continue with next batch
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log(`✅ Synchronization completed: ${totalSynced} orders processed (${totalCreated} created, ${totalUpdated} updated)`);

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${totalSynced} orders from Shopify`,
      stats: {
        totalSynced,
        totalCreated,
        totalUpdated
      }
    });

  } catch (error) {
    console.error('❌ Orders sync error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to sync orders from Shopify',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
