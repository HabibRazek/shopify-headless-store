import { NextRequest, NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';
import { QUERY_PRODUCTS_BY_TITLE } from '@/lib/queries';

export async function GET(request: NextRequest) {
  try {
    // Get the query parameter from the URL
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    console.log(`Searching products with query: ${query}`);
    
    const { status, body } = await shopifyFetch({
      query: QUERY_PRODUCTS_BY_TITLE,
      variables: { 
        query: query,
        first: 20 
      },
    });

    console.log('Shopify API response status:', status);

    if (status === 200) {
      return NextResponse.json(body);
    } else {
      return NextResponse.json(
        { error: 'Error searching products' },
        { status }
      );
    }
  } catch (error) {
    console.error('Products Search API Error:', error);
    return NextResponse.json(
      { error: 'Error searching products' },
      { status: 500 }
    );
  }
}
