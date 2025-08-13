import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_RuTNXtVV_Q4Wpevrp7peLv5vAUZm8V88K');

export async function POST(request: NextRequest) {
  try {
    console.log('Testing Resend email...');
    
    const result = await resend.emails.send({
      from: 'Packedin Test <onboarding@resend.dev>', // Using Resend's test domain
      to: 'delivered@resend.dev', // Resend's guaranteed delivery test email
      subject: 'Test Email from Packedin - ' + new Date().toISOString(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #22c55e;">✅ Test Email from Packedin</h1>
          <p>This is a test email to verify Resend is working correctly.</p>
          <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
          <p><strong>API Key:</strong> ${process.env.RESEND_API_KEY ? 'Configured' : 'Missing'}</p>
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Status:</strong> Email system is working! 🎉</p>
          </div>
        </div>
      `,
    });

    console.log('Email sent successfully:', result);

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      data: result,
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
