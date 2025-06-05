import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🧪 TEST SYNC: Starting manual Shopify sync test...');
    
    // Test Shopify environment
    const shopifyDomain = process.env.SHOPIFY_ADMIN_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
    console.log('🧪 TEST SYNC: Environment check:', {
      SHOPIFY_ADMIN_DOMAIN: !!process.env.SHOPIFY_ADMIN_DOMAIN,
      SHOPIFY_STORE_DOMAIN: !!process.env.SHOPIFY_STORE_DOMAIN,
      SHOPIFY_ADMIN_ACCESS_TOKEN: !!process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
      shopifyDomain: !!shopifyDomain
    });

    if (!shopifyDomain || !process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
      return NextResponse.json({ 
        error: 'Shopify environment not configured',
        environment: {
          SHOPIFY_ADMIN_DOMAIN: !!process.env.SHOPIFY_ADMIN_DOMAIN,
          SHOPIFY_STORE_DOMAIN: !!process.env.SHOPIFY_STORE_DOMAIN,
          SHOPIFY_ADMIN_ACCESS_TOKEN: !!process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
        }
      }, { status: 500 });
    }

    // Test draft order fetch
    console.log('🧪 TEST SYNC: Testing draft order 55...');
    try {
      const response = await fetch(`https://${shopifyDomain}/admin/api/2024-07/draft_orders/55.json`, {
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
          'Content-Type': 'application/json',
        },
      });

      console.log('🧪 TEST SYNC: Draft order 55 response:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🧪 TEST SYNC: Draft order 55 data:', data.draft_order);
        return NextResponse.json({ 
          success: true, 
          draftOrder: data.draft_order,
          message: 'Draft order found successfully'
        });
      } else if (response.status === 404) {
        console.log('🧪 TEST SYNC: Draft order 55 not found (404) - testing order search...');
        
        // Test order search
        const ordersResponse = await fetch(`https://${shopifyDomain}/admin/api/2024-07/orders.json?limit=10&status=any`, {
          headers: {
            'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
            'Content-Type': 'application/json',
          },
        });

        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          console.log('🧪 TEST SYNC: Found orders:', ordersData.orders.length);
          console.log('🧪 TEST SYNC: Recent orders:', ordersData.orders.map((o: any) => ({
            id: o.id,
            name: o.name,
            total_price: o.total_price,
            financial_status: o.financial_status,
            fulfillment_status: o.fulfillment_status,
            created_at: o.created_at
          })));
          
          return NextResponse.json({ 
            success: true, 
            draftOrderNotFound: true,
            orders: ordersData.orders.map((o: any) => ({
              id: o.id,
              name: o.name,
              total_price: o.total_price,
              financial_status: o.financial_status,
              fulfillment_status: o.fulfillment_status,
              created_at: o.created_at
            })),
            message: 'Draft order not found, but orders retrieved successfully'
          });
        } else {
          return NextResponse.json({ 
            error: 'Failed to fetch orders',
            status: ordersResponse.status
          }, { status: 500 });
        }
      } else {
        return NextResponse.json({ 
          error: 'Failed to fetch draft order',
          status: response.status
        }, { status: 500 });
      }
    } catch (fetchError) {
      console.error('🧪 TEST SYNC: Fetch error:', fetchError);
      return NextResponse.json({ 
        error: 'Network error during Shopify API call',
        details: fetchError instanceof Error ? fetchError.message : 'Unknown error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('🧪 TEST SYNC: General error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
