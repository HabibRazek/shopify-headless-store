import { NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';
import { QUERY_FEATURED_PRODUCTS } from '@/lib/queries';

// Configuration for the 4 specific featured products
const FEATURED_PRODUCT_HANDLES = {
  // Kraft 12x20 - from KraftView collection
  handle1: 'kraftview™-50-pcs-12-20-4',
  // White 14x22 - from WhiteView collection
  handle2: 'whiteview™-50-pochettes-zip-kraft-blanc-avec-fenetre-mate-12-20-4-cm',
  // Black 12x20 - from BlackView collection
  handle3: 'blackview™-pochette-zip-noire-avec-fenetre-12x20-4-lot-de-50',
  // Frosted 10x15 - from FullTrans collection
  handle4: 'fulltrans™-frosted-pochette-zip-transparente-givree-10-15-3-lot-de-50'
};

export async function GET() {
  try {
    const { status, body } = await shopifyFetch({
      query: QUERY_FEATURED_PRODUCTS,
      variables: FEATURED_PRODUCT_HANDLES,
    });

    if (status === 200) {
      // Transform the response to match the expected format
      const data = body as any;
      const products = [];

      // Collect all products that exist
      if (data.product1) {
        products.push({ node: data.product1 });
      }
      if (data.product2) {
        products.push({ node: data.product2 });
      }
      if (data.product3) {
        products.push({ node: data.product3 });
      }
      if (data.product4) {
        products.push({ node: data.product4 });
      }

      return NextResponse.json({
        products: {
          edges: products
        }
      });
    } else {
      return NextResponse.json({ error: 'Error fetching featured products' }, { status });
    }
  } catch (error) {
    console.error('Featured Products API Error:', error);
    return NextResponse.json(
      { error: 'Error fetching featured products' },
      { status: 500 }
    );
  }
}
