import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, subject, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nom, email et message sont obligatoires' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Save contact message to database
    try {
      const contactMessage = await prisma.contactMessage.create({
        data: {
          name,
          email,
          phone: phone || null,
          company: company || null,
          subject: subject || null,
          message,
          status: 'unread'
        }
      });

      // Send contact email
      try {
        console.log('Attempting to send contact email...');
        const emailResult = await sendContactEmail({
          name,
          email,
          phone: phone || 'Non spécifié',
          company: company || 'Non spécifiée',
          subject: subject || 'Demande de contact',
          message,
          timestamp: new Date().toISOString()
        });
        console.log('Contact email sent successfully:', emailResult);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the request if email fails, message is still saved
      }

      return NextResponse.json({
        success: true,
        message: 'Message envoyé avec succès',
        id: contactMessage.id
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde du message' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
