import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    console.log('🔍 Creating test order for user:', session.user.id);

    // Dynamic import to avoid build-time issues
    const { default: prisma } = await import('@/lib/prisma');

    const { paymentMethod = 'cashOnDelivery' } = await request.json();

    // First, ensure the user exists in the database
    console.log('👤 Ensuring user exists in database...');

    try {
      await prisma.user.upsert({
        where: { id: session.user.id },
        update: {
          name: session.user.name || 'Test User',
          image: session.user.image || null,
        },
        create: {
          id: session.user.id,
          email: `test-${Date.now()}-${session.user.id}@example.com`, // Use completely unique email
          name: session.user.name || 'Test User',
          emailVerified: null,
          image: session.user.image || null,
        }
      });

      console.log('✅ User ensured in database');
    } catch (userError) {
      console.error('❌ Error ensuring user:', userError);
      // Continue anyway, maybe user already exists
    }

    // Create a test order
    const testOrder = await prisma.order.create({
      data: {
        userId: session.user.id,
        orderNumber: `TEST-${Date.now()}`,
        status: paymentMethod === 'bankTransfer' ? 'pending_payment' : 'pending',
        total: 25.99,
        currency: 'TND',
        paymentMethod: paymentMethod === 'bankTransfer' ? 'Virement bancaire' : 'Paiement à la livraison',
        shippingAddress: 'Test Address',
        shippingCity: 'Tunis',
        shippingPostalCode: '1000',
        shippingCountry: 'Tunisia',
        items: {
          create: [
            {
              productId: 'test-product-1',
              title: paymentMethod === 'bankTransfer' ? 'Test Product (Virement bancaire)' : 'Test Product (Paiement à la livraison)',
              price: 25.99,
              quantity: 1,
              image: null
            }
          ]
        }
      },
      include: {
        items: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Test order created successfully',
      order: testOrder,
      paymentMethod: paymentMethod === 'bankTransfer' ? 'Virement bancaire' : 'Paiement à la livraison'
    });
  } catch (error) {
    console.error('Error creating test order:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    console.log('🔍 Fetching orders for user:', session.user.id);

    // Dynamic import to avoid build-time issues
    const { default: prisma } = await import('@/lib/prisma');

    // Get all orders for the user
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      orders: orders,
      count: orders.length
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
