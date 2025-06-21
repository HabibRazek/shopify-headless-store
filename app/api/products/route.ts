import { NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';
import { QUERY_ALL_PRODUCTS } from '@/lib/queries';

export async function GET() {
  try {
    const { status, body } = await shopifyFetch({
      query: QUERY_ALL_PRODUCTS,
      variables: { first: 100 }, // Increased to 100 to ensure we get all products
    });

    if (status === 200) {
      return NextResponse.json(body);
    } else {
      return NextResponse.json({ error: 'Error fetching products' }, { status });
    }
  } catch (fetchError) {
    console.error('Products fetch error:', fetchError);
    return NextResponse.json(
      { error: 'Error fetching products' },
      { status: 500 }
    );
  }
}
