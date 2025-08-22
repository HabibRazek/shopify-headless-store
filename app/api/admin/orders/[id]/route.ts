import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    console.log('Fetching order with ID:', params.id);

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            address: true,
            city: true,
            country: true,
            postalCode: true
          }
        },
        items: {
          select: {
            id: true,
            productId: true,
            title: true,
            quantity: true,
            price: true,
            image: true
          }
        }
      }
    });

    console.log('Order found:', order ? 'Yes' : 'No');
    if (order) {
      console.log('Order items count:', order.items?.length || 0);
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Format the response with proper data structure
    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total || 0,
      currency: order.currency || 'TND',
      createdAt: order.createdAt?.toISOString() || new Date().toISOString(),
      shopifyOrderId: order.shopifyOrderId,
      user: order.user ? {
        name: order.user.name,
        email: order.user.email,
        phone: order.user.phone,
        image: order.user.image,
      } : null,
      shippingAddress: order.shippingAddress ? {
        firstName: '',
        lastName: '',
        address1: order.shippingAddress,
        address2: '',
        city: order.shippingCity || '',
        province: '',
        country: order.shippingCountry || '',
        zip: order.shippingPostalCode || '',
      } : null,
      orderItems: order.items?.map(item => ({
        id: item.id,
        productTitle: item.title || 'Produit inconnu',
        variantTitle: null, // Not available in current schema
        quantity: item.quantity || 1,
        price: item.price || 0,
        image: item.image,
      })) || [],
    };

    return NextResponse.json(formattedOrder);

  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}
