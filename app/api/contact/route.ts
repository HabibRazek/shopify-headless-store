import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';

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

    // Send contact email
    try {
      await sendContactEmail({
        name,
        email,
        phone: phone || 'Non spécifié',
        company: company || 'Non spécifiée',
        subject: subject || 'Demande de contact',
        message,
        timestamp: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        message: 'Message envoyé avec succès'
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
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
