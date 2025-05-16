import { NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';
import { QUERY_ALL_COLLECTIONS } from '@/lib/queries';

export async function GET() {
  try {
    const { status, body } = await shopifyFetch({
      query: QUERY_ALL_COLLECTIONS,
      variables: { first: 20 },
    });

    if (status === 200) {
      return NextResponse.json(body);
    } else {
      return NextResponse.json(
        { error: 'Error fetching collections' },
        { status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching collections' },
      { status: 500 }
    );
  }
}
