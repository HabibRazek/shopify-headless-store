import { NextRequest, NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';
import { QUERY_PRODUCT_BY_HANDLE } from '@/lib/queries';

export async function GET(request: NextRequest) {
  try {
    // Extract the handle from the URL
    const pathParts = request.nextUrl.pathname.split('/');
    const encodedHandle = pathParts[pathParts.length - 1];

    // Decode the handle
    let handle = decodeURIComponent(encodedHandle);
    if (handle.includes('%')) {
      handle = decodeURIComponent(handle);
    }

    // Fetch product from Shopify
    const { status, body } = await shopifyFetch({
      query: QUERY_PRODUCT_BY_HANDLE,
      variables: { handle },
    });

    if (status === 200) {
      return NextResponse.json(body);
    } else {
      return NextResponse.json(
        { error: 'Error fetching product' },
        { status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching product' },
      { status: 500 }
    );
  }
}
