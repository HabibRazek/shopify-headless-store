import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

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
    if (!customerName || !customerEmail || !material || !dimensions || !quantity || !deliveryDate || !designFileUrl) {
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

    // Validate delivery date (minimum 7 days from now)
    const deliveryDateTime = new Date(deliveryDate);
    const minDeliveryDate = new Date();
    minDeliveryDate.setDate(minDeliveryDate.getDate() + 7);
    
    if (deliveryDateTime < minDeliveryDate) {
      return NextResponse.json(
        { error: 'La date de livraison doit être d\'au moins 7 jours ouvrables' },
        { status: 400 }
      );
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

    // Send confirmation email to customer
    const customerEmailContent = `
      <h2>Confirmation de votre demande d'impression personnalisée</h2>
      <p>Bonjour ${customerName},</p>
      <p>Nous avons bien reçu votre demande d'impression personnalisée. Voici un résumé de votre demande :</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Détails de la demande</h3>
        <p><strong>Numéro de demande :</strong> ${printRequest.id}</p>
        <p><strong>Matériau :</strong> ${material === 'KRAFT_VIEW' ? 'Kraft View' : 'Kraft Alu'}</p>
        <p><strong>Dimensions :</strong> ${dimensions} cm</p>
        <p><strong>Quantité :</strong> ${quantity} unités</p>
        <p><strong>Date de livraison souhaitée :</strong> ${deliveryDateTime.toLocaleDateString('fr-FR')}</p>
        ${company ? `<p><strong>Entreprise :</strong> ${company}</p>` : ''}
        ${notes ? `<p><strong>Notes :</strong> ${notes}</p>` : ''}
      </div>
      
      <h3>Prochaines étapes</h3>
      <ul>
        <li>Notre équipe va examiner votre design et vos spécifications</li>
        <li>Nous vous contacterons sous 24-48h pour validation</li>
        <li>Un devis détaillé vous sera envoyé</li>
        <li>Après confirmation, nous procéderons à la production</li>
      </ul>
      
      <p>Si vous avez des questions, n'hésitez pas à nous contacter :</p>
      <p>Email : packedin.tn@gmail.com<br>
      Téléphone : +216 29 362 224</p>
      
      <p>Merci de votre confiance !</p>
      <p>L'équipe Packedin</p>
    `;

    try {
      await sendEmail({
        to: customerEmail,
        subject: 'Confirmation de votre demande d\'impression personnalisée - Packedin',
        html: customerEmailContent
      });
    } catch (emailError) {
      console.error('Error sending customer email:', emailError);
    }

    // Send notification email to admin
    const adminEmailContent = `
      <h2>Nouvelle demande d'impression personnalisée</h2>
      <p>Une nouvelle demande d'impression personnalisée a été reçue.</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Informations client</h3>
        <p><strong>Nom :</strong> ${customerName}</p>
        <p><strong>Email :</strong> ${customerEmail}</p>
        ${customerPhone ? `<p><strong>Téléphone :</strong> ${customerPhone}</p>` : ''}
        ${company ? `<p><strong>Entreprise :</strong> ${company}</p>` : ''}
      </div>
      
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Détails de la commande</h3>
        <p><strong>Numéro de demande :</strong> ${printRequest.id}</p>
        <p><strong>Matériau :</strong> ${material === 'KRAFT_VIEW' ? 'Kraft View' : 'Kraft Alu'}</p>
        <p><strong>Dimensions :</strong> ${dimensions} cm</p>
        <p><strong>Quantité :</strong> ${quantity} unités</p>
        <p><strong>Date de livraison souhaitée :</strong> ${deliveryDateTime.toLocaleDateString('fr-FR')}</p>
        ${notes ? `<p><strong>Notes :</strong> ${notes}</p>` : ''}
      </div>
      
      <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Fichier design</h3>
        <p><strong>Nom du fichier :</strong> ${designFileName || 'Non spécifié'}</p>
        <p><strong>URL :</strong> <a href="${designFileUrl}" target="_blank">Télécharger le fichier</a></p>
      </div>
      
      <p>Connectez-vous à l'administration pour traiter cette demande :</p>
      <p><a href="${process.env.NEXTAUTH_URL}/admin/print-service" style="background-color: #22c55e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Voir dans l'admin</a></p>
    `;

    try {
      await sendEmail({
        to: 'packedin.tn@gmail.com',
        subject: `Nouvelle demande d'impression - ${customerName}`,
        html: adminEmailContent
      });
    } catch (emailError) {
      console.error('Error sending admin email:', emailError);
    }

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
