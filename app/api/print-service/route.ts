import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      company,
      material,
      dimensions,
      quantity,
      deliveryDate,
      notes,
      designFileUrl,
      designFileName
    } = body;

    // Validate required fields
    if (!customerName || !customerEmail || !material || !dimensions || !quantity || !deliveryDate) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Validate quantity minimum
    if (quantity < 300) {
      return NextResponse.json(
        { error: 'La quantité minimum est de 300 unités' },
        { status: 400 }
      );
    }

    // Validate delivery date (minimum 7 days from now for public requests, more flexible for admin)
    const deliveryDateTime = new Date(deliveryDate);
    const minDeliveryDate = new Date();

    // If no design file provided, assume it's an admin request with more flexibility
    if (designFileUrl) {
      minDeliveryDate.setDate(minDeliveryDate.getDate() + 7);
      if (deliveryDateTime < minDeliveryDate) {
        return NextResponse.json(
          { error: 'La date de livraison doit être d\'au moins 7 jours ouvrables' },
          { status: 400 }
        );
      }
    } else {
      // For admin requests, just ensure it's not in the past
      if (deliveryDateTime < new Date()) {
        return NextResponse.json(
          { error: 'La date de livraison ne peut pas être dans le passé' },
          { status: 400 }
        );
      }
    }

    // Create print service request
    const prisma = getPrismaClient();
    const printRequest = await prisma.printServiceRequest.create({
      data: {
        customerName,
        customerEmail,
        customerPhone: customerPhone || null,
        company: company || null,
        material,
        dimensions,
        quantity: parseInt(quantity),
        deliveryDate: deliveryDateTime,
        notes: notes || null,
        designFileUrl,
        designFileName: designFileName || null,
        status: 'PENDING'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Demande envoyée avec succès',
      requestId: printRequest.id
    });

  } catch (error) {
    console.error('Error creating print service request:', error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Prisma')) {
        return NextResponse.json(
          { error: 'Erreur de base de données. Veuillez réessayer.' },
          { status: 500 }
        );
      }
      if (error.message.includes('validation')) {
        return NextResponse.json(
          { error: 'Données invalides. Veuillez vérifier vos informations.' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur. Veuillez réessayer plus tard.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const material = searchParams.get('material');

    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (material) where.material = material;

    const prisma = getPrismaClient();
    const [requests, total] = await Promise.all([
      prisma.printServiceRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.printServiceRequest.count({ where })
    ]);

    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching print service requests:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des demandes' },
      { status: 500 }
    );
  }
}
