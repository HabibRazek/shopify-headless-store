import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// TypeScript interfaces
interface Order {
  id: string;
  orderNumber: string;
  status: string;
  shopifyOrderId?: string;
  userId: string;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

// Function to sync order status with Shopify
async function syncOrderWithShopify(order: Order) {
  if (!order.shopifyOrderId && !order.orderNumber?.startsWith('D')) {
    return order;
  }

  // Check if Shopify environment is configured
  const shopifyDomain = process.env.SHOPIFY_ADMIN_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
  if (!shopifyDomain || !process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
    return order;
  }

  try {
    // Check if it's a draft order (starts with D) or regular order
    const isDraftOrder = order.orderNumber?.startsWith('D');

    if (isDraftOrder) {
      // For draft orders, extract the numeric ID from orderNumber
      const draftOrderId = order.orderNumber.replace('D', '');

      console.log(`🔄 Checking draft order D${draftOrderId} status...`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`https://${shopifyDomain}/admin/api/2024-07/draft_orders/${draftOrderId}.json`, {
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const draftOrder = data.draft_order;

        console.log(`📋 Draft order ${draftOrderId} status:`, {
          status: draftOrder.status,
          completed_at: draftOrder.completed_at,
          order_id: draftOrder.order_id
        });

        // Check if draft order was completed (converted to order)
        if (draftOrder.order_id) {
          // Draft order was completed, update status and get the real order
          const { default: prisma } = await import('@/lib/prisma');
          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: 'confirmed',
              shopifyOrderId: `gid://shopify/Order/${draftOrder.order_id}`
            },
          });
          console.log(`✅ Updated draft order ${order.orderNumber} to confirmed (converted to order ${draftOrder.order_id})`);

          // Now check the actual order status
          const controller3 = new AbortController();
          const timeoutId3 = setTimeout(() => controller3.abort(), 5000); // 5 second timeout

          const orderResponse = await fetch(`https://${shopifyDomain}/admin/api/2024-07/orders/${draftOrder.order_id}.json`, {
            headers: {
              'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
              'Content-Type': 'application/json',
            },
            signal: controller3.signal,
          });

          clearTimeout(timeoutId3);

          if (orderResponse.ok) {
            const orderData = await orderResponse.json();
            const shopifyOrder = orderData.order;

            // Map the actual order status with detailed logging
            let finalStatus = 'confirmed';

            console.log(`🔍 Mapping converted draft order ${order.orderNumber} status:`, {
              financial_status: shopifyOrder.financial_status,
              fulfillment_status: shopifyOrder.fulfillment_status,
              cancelled_at: shopifyOrder.cancelled_at,
              closed_at: shopifyOrder.closed_at
            });

            if (shopifyOrder.cancelled_at) {
              finalStatus = 'cancelled';
              console.log(`📋 Converted order ${order.orderNumber} is cancelled`);
            } else if (shopifyOrder.fulfillment_status === 'fulfilled') {
              finalStatus = 'fulfilled';
              console.log(`📋 Converted order ${order.orderNumber} is fulfilled`);
            } else if (shopifyOrder.closed_at && shopifyOrder.financial_status === 'paid') {
              finalStatus = 'completed';
              console.log(`📋 Converted order ${order.orderNumber} is completed (closed + paid)`);
            } else if (shopifyOrder.fulfillment_status === 'partial') {
              finalStatus = 'processing';
              console.log(`📋 Converted order ${order.orderNumber} is partially fulfilled`);
            } else if (shopifyOrder.financial_status === 'paid') {
              finalStatus = 'confirmed';
              console.log(`📋 Converted order ${order.orderNumber} is confirmed (paid)`);
            } else {
              console.log(`📋 Converted order ${order.orderNumber} defaulting to confirmed`);
            }

            if (finalStatus !== 'confirmed') {
              await prisma.order.update({
                where: { id: order.id },
                data: { status: finalStatus },
              });
              console.log(`✅ Updated order ${order.orderNumber} final status to ${finalStatus}`);
            }

            return { ...order, status: finalStatus, shopifyOrderId: `gid://shopify/Order/${draftOrder.order_id}` };
          }

          return { ...order, status: 'confirmed', shopifyOrderId: `gid://shopify/Order/${draftOrder.order_id}` };
        }
      } else if (response.status === 404) {
        // Draft order not found - it might have been completed, deleted, or never existed
        console.log(`📋 Draft order ${draftOrderId} not found (404) - checking if it was converted to an order`);

        // Only search for completed orders if the current status suggests it might have been processed
        if (['pending', 'processing', 'confirmed'].includes(order.status.toLowerCase())) {
          // Try to find the completed order by searching recent orders
          try {
          const ordersResponse = await fetch(`https://${shopifyDomain}/admin/api/2024-07/orders.json?limit=50&status=any`, {
            headers: {
              'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
              'Content-Type': 'application/json',
            },
          });

          if (ordersResponse.ok) {
            const ordersData = await ordersResponse.json();
            const orders = ordersData.orders;

            // Look for an order that might have been created from this draft
            // We'll look for orders with similar total amount (rough match)
            const possibleOrder = orders.find((o: any) =>
              Math.abs(parseFloat(o.total_price) - order.total) < 1 && // Within 1 unit of currency
              new Date(o.created_at) > new Date(order.createdAt) // Created after our order
            );

            if (possibleOrder) {
              console.log(`🎯 Found possible completed order for draft ${draftOrderId}:`, possibleOrder.id);

              // Update our order with the new Shopify order ID and status
              const { default: prisma } = await import('@/lib/prisma');

              let newStatus = 'confirmed';
              if (possibleOrder.cancelled_at) {
                newStatus = 'cancelled';
              } else if (possibleOrder.fulfillment_status === 'fulfilled') {
                newStatus = 'fulfilled';
              } else if (possibleOrder.closed_at && possibleOrder.financial_status === 'paid') {
                newStatus = 'completed';
              } else if (possibleOrder.fulfillment_status === 'partial') {
                newStatus = 'processing';
              } else if (possibleOrder.financial_status === 'paid') {
                newStatus = 'confirmed';
              }

              await prisma.order.update({
                where: { id: order.id },
                data: {
                  status: newStatus,
                  shopifyOrderId: `gid://shopify/Order/${possibleOrder.id}`
                },
              });

              console.log(`✅ Updated draft order ${order.orderNumber} to ${newStatus} with Shopify order ${possibleOrder.id}`);
              return { ...order, status: newStatus, shopifyOrderId: `gid://shopify/Order/${possibleOrder.id}` };
            } else {
              // No matching order found, keep current status (don't assume completion)
              console.log(`📋 No matching order found for draft ${draftOrderId}, keeping current status: ${order.status}`);
              // Don't automatically change status without clear evidence
              return order;
            }
          }
          } catch (searchError) {
            console.error(`❌ Error searching for completed order for draft ${draftOrderId}:`, searchError);
          }
        } else {
          console.log(`📋 Draft order ${draftOrderId} not found, but current status is ${order.status} - keeping as is`);
        }
      } else {
        console.log(`❌ Failed to fetch draft order ${draftOrderId}:`, response.status);
      }
    } else if (order.shopifyOrderId) {
      // For regular orders, extract the numeric ID from the Shopify order ID
      const shopifyOrderId = order.shopifyOrderId.replace('gid://shopify/Order/', '');

      console.log(`🔄 Checking order ${shopifyOrderId} status...`);

      const controller2 = new AbortController();
      const timeoutId2 = setTimeout(() => controller2.abort(), 5000); // 5 second timeout

      const response = await fetch(`https://${shopifyDomain}/admin/api/2024-07/orders/${shopifyOrderId}.json`, {
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
          'Content-Type': 'application/json',
        },
        signal: controller2.signal,
      });

      clearTimeout(timeoutId2);

      if (response.ok) {
        const data = await response.json();
        const shopifyOrder = data.order;

        console.log(`📦 Order ${shopifyOrderId} status:`, {
          financial_status: shopifyOrder.financial_status,
          fulfillment_status: shopifyOrder.fulfillment_status,
          cancelled_at: shopifyOrder.cancelled_at
        });

        // Map Shopify status to our status with detailed logging
        let newStatus = order.status;

        console.log(`🔍 Mapping status for order ${order.orderNumber}:`, {
          current_status: order.status,
          financial_status: shopifyOrder.financial_status,
          fulfillment_status: shopifyOrder.fulfillment_status,
          cancelled_at: shopifyOrder.cancelled_at,
          closed_at: shopifyOrder.closed_at
        });

        // Priority order for status mapping
        if (shopifyOrder.cancelled_at) {
          newStatus = 'cancelled';
          console.log(`📋 Order ${order.orderNumber} is cancelled`);
        } else if (shopifyOrder.fulfillment_status === 'fulfilled') {
          newStatus = 'fulfilled';
          console.log(`📋 Order ${order.orderNumber} is fulfilled`);
        } else if (shopifyOrder.closed_at && shopifyOrder.financial_status === 'paid') {
          newStatus = 'completed';
          console.log(`📋 Order ${order.orderNumber} is completed (closed + paid)`);
        } else if (shopifyOrder.fulfillment_status === 'partial') {
          newStatus = 'processing';
          console.log(`📋 Order ${order.orderNumber} is partially fulfilled`);
        } else if (shopifyOrder.financial_status === 'paid') {
          newStatus = 'confirmed';
          console.log(`📋 Order ${order.orderNumber} is confirmed (paid)`);
        } else if (shopifyOrder.financial_status === 'pending') {
          newStatus = 'pending_payment';
          console.log(`📋 Order ${order.orderNumber} is pending payment`);
        } else {
          console.log(`📋 Order ${order.orderNumber} status unchanged: ${order.status}`);
        }

        // Update status if it changed
        if (newStatus !== order.status) {
          const { default: prisma } = await import('@/lib/prisma');
          await prisma.order.update({
            where: { id: order.id },
            data: { status: newStatus },
          });
          console.log(`✅ Updated order ${order.orderNumber} status from ${order.status} to ${newStatus}`);
          return { ...order, status: newStatus };
        }
      } else {
        console.log(`❌ Failed to fetch order ${shopifyOrderId}:`, response.status);
      }
    }
  } catch (error) {
    console.error(`❌ Error syncing order ${order.orderNumber} with Shopify:`, error);
  }

  return order;
}

export async function GET(request: NextRequest) {
  try {
    // Dynamic import to avoid build-time issues
    const { default: prisma } = await import('@/lib/prisma');

    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const url = new URL(request.url);
    const shouldRefresh = url.searchParams.get('refresh') === 'true';



    // Get all orders for the user
    let orders = await prisma.order.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: true,
      },
    });



    // Sync with Shopify if refresh is explicitly requested
    if (shouldRefresh) {
      console.log('🔄 Refresh requested, checking Shopify environment...');
      const shopifyDomain = process.env.SHOPIFY_ADMIN_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
      console.log('Environment check:', {
        SHOPIFY_ADMIN_DOMAIN: !!process.env.SHOPIFY_ADMIN_DOMAIN,
        SHOPIFY_STORE_DOMAIN: !!process.env.SHOPIFY_STORE_DOMAIN,
        SHOPIFY_ADMIN_ACCESS_TOKEN: !!process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
        shopifyDomain: !!shopifyDomain
      });

      if (shopifyDomain && process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
        // Only sync orders that actually need syncing (have Shopify IDs and are not already in final states)
        const ordersToSync = orders.filter((order) => {
          const hasShopifyId = order.shopifyOrderId || order.orderNumber?.startsWith('D');
          const needsSync = !['completed', 'cancelled', 'refunded', 'fulfilled'].includes(order.status.toLowerCase());
          return hasShopifyId && needsSync;
        });

        if (ordersToSync.length > 0) {
          console.log(`🔄 Syncing ${ordersToSync.length} orders with Shopify (${orders.length - ordersToSync.length} skipped as completed)...`);

          try {
            const syncPromises = ordersToSync.map((order: any) => syncOrderWithShopify(order));
            const syncedOrders = await Promise.all(syncPromises);

            // Update the orders array with synced data
            orders = orders.map((order: any) => {
              const syncedOrder = syncedOrders.find((s: any) => s.id === order.id);
              return syncedOrder || order;
            });

            console.log('✅ Shopify sync completed');
          } catch (syncError) {
            console.error('❌ Shopify sync failed:', syncError);
            // Continue with cached data if sync fails
          }
        } else {
          console.log('📦 No orders need syncing with Shopify (all completed or no Shopify IDs)');
        }
      }
    }



    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
