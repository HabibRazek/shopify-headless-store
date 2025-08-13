import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { sendReplyEmail } from '@/lib/email';

async function requireAdminAuth(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== 'admin' && session.user.role !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return null;
}

// POST /api/admin/messages/[id]/reply - Send reply to contact message
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { subject, message } = await request.json();

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    // Get the original contact message
    const contactMessage = await prisma.contactMessage.findUnique({
      where: { id: params.id },
    });

    if (!contactMessage) {
      return NextResponse.json(
        { error: 'Contact message not found' },
        { status: 404 }
      );
    }

    // Send reply email
    try {
      await sendReplyEmail({
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

      // Update message status to replied
      await prisma.contactMessage.update({
        where: { id: params.id },
        data: { status: 'replied' },
      });

      return NextResponse.json({
        success: true,
        message: 'Reply sent successfully',
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return NextResponse.json(
        { error: 'Failed to send reply email' },
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
