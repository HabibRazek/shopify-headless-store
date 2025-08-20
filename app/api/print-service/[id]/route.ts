import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prisma = getPrismaClient();
    const printRequest = await prisma.printServiceRequest.findUnique({
      where: { id: params.id }
    });

    if (!printRequest) {
      return NextResponse.json(
        { error: 'Demande non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(printRequest);

  } catch (error) {
    console.error('Error fetching print service request:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la demande' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, adminNotes } = body;

    const prisma = getPrismaClient();
    const printRequest = await prisma.printServiceRequest.findUnique({
      where: { id: params.id }
    });

    if (!printRequest) {
      return NextResponse.json(
        { error: 'Demande non trouvée' },
        { status: 404 }
      );
    }

    const updatedRequest = await prisma.printServiceRequest.update({
      where: { id: params.id },
      data: {
        status,
        adminNotes: adminNotes || printRequest.adminNotes
      }
    });

    return NextResponse.json(updatedRequest);

  } catch (error) {
    console.error('Error updating print service request:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la demande' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prisma = getPrismaClient();
    const printRequest = await prisma.printServiceRequest.findUnique({
      where: { id: params.id }
    });

    if (!printRequest) {
      return NextResponse.json(
        { error: 'Demande non trouvée' },
        { status: 404 }
      );
    }

    await prisma.printServiceRequest.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting print service request:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la demande' },
      { status: 500 }
    );
  }
}
