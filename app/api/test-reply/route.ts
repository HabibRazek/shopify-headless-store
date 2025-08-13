import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendReplyEmail } from '@/lib/email';

// Test endpoint to simulate admin reply (no auth required for testing)
export async function POST(request: NextRequest) {
  try {
    const { messageId, subject, message } = await request.json();

    if (!messageId || !subject || !message) {
      return NextResponse.json(
        { error: 'messageId, subject and message are required' },
        { status: 400 }
      );
    }

    // Get the original contact message
    const contactMessage = await prisma.contactMessage.findUnique({
      where: { id: messageId },
    });

    if (!contactMessage) {
      return NextResponse.json(
        { error: 'Contact message not found' },
        { status: 404 }
      );
    }

    console.log('Sending reply email to:', contactMessage.email);

    // Send reply email
    try {
      const result = await sendReplyEmail({
        to: contactMessage.email,
        toName: contactMessage.name,
        subject,
        message,
        originalMessage: {
          name: contactMessage.name,
          email: contactMessage.email,
          phone: contactMessage.phone,
          company: contactMessage.company,
          subject: contactMessage.subject,
          message: contactMessage.message,
          createdAt: contactMessage.createdAt.toISOString(),
        },
      });

      console.log('Reply email sent successfully:', result);

      // Update message status to replied
      await prisma.contactMessage.update({
        where: { id: messageId },
        data: { status: 'replied' },
      });

      return NextResponse.json({
        success: true,
        message: 'Reply sent successfully',
        emailId: result.data?.id,
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return NextResponse.json(
        { error: 'Failed to send reply email', details: emailError },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Reply error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
