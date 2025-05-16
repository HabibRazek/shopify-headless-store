import { NextRequest, NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';
import { QUERY_COLLECTION_BY_HANDLE } from '@/lib/queries';

export async function GET(request: NextRequest, { params }: { params: { handle: string } }) {
  try {
    // Get the handle directly from the route params
    const rawHandle = params.handle;

    // Decode the handle if it's URL encoded
    let handle = decodeURIComponent(rawHandle);
    if (handle.includes('%')) {
      handle = decodeURIComponent(handle);
    }

    // Clean up the handle - remove trademark symbols and other special characters
    handle = handle.replace('™', '').trim();

    // Fetch the collection from Shopify
    const { status, body } = await shopifyFetch({
      query: QUERY_COLLECTION_BY_HANDLE,
      variables: { handle, first: 20 },
    });

    if (status === 200) {
      if (body.data && body.data.collection) {
        return NextResponse.json(body);
      } else {
        return NextResponse.json(
          { error: 'Collection not found' },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Error fetching collection' },
        { status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching collection' },
      { status: 500 }
    );
  }
}
