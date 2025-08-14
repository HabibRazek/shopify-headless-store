import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

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

    // Send status update email to customer if status changed
    if (status && status !== printRequest.status) {
      const statusMessages = {
        'PENDING': 'En attente de révision',
        'IN_REVIEW': 'En cours de révision',
        'APPROVED': 'Approuvée - Devis en préparation',
        'IN_PRODUCTION': 'En production',
        'READY': 'Prête pour livraison',
        'DELIVERED': 'Livrée',
        'CANCELLED': 'Annulée'
      };

      const statusMessage = statusMessages[status as keyof typeof statusMessages] || status;

      const emailContent = `
        <h2>Mise à jour de votre demande d'impression</h2>
        <p>Bonjour ${printRequest.customerName},</p>
        <p>Le statut de votre demande d'impression personnalisée a été mis à jour.</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Informations de la demande</h3>
          <p><strong>Numéro de demande :</strong> ${printRequest.id}</p>
          <p><strong>Nouveau statut :</strong> ${statusMessage}</p>
          <p><strong>Matériau :</strong> ${printRequest.material === 'KRAFT_VIEW' ? 'Kraft View' : 'Kraft Alu'}</p>
          <p><strong>Dimensions :</strong> ${printRequest.dimensions} cm</p>
          <p><strong>Quantité :</strong> ${printRequest.quantity} unités</p>
        </div>
        
        ${adminNotes ? `
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Notes de notre équipe</h3>
          <p>${adminNotes}</p>
        </div>
        ` : ''}
        
        <p>Si vous avez des questions, n'hésitez pas à nous contacter :</p>
        <p>Email : packedin.tn@gmail.com<br>
        Téléphone : +216 29 362 224</p>
        
        <p>Merci de votre confiance !</p>
        <p>L'équipe Packedin</p>
      `;

      try {
        await sendEmail({
          to: printRequest.customerEmail,
          subject: `Mise à jour de votre demande d'impression - ${statusMessage}`,
          html: emailContent
        });
      } catch (emailError) {
        console.error('Error sending status update email:', emailError);
      }
    }

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
