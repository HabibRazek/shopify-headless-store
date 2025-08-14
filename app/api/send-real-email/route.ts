import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message } = await request.json();

    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'packedin.tn@gmail.com',
        pass: 'your-app-password', // You need to set this up
      },
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Message from Packedin</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f5f5f5;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #16a34a, #22c55e, #4ade80); 
            color: white; 
            padding: 30px; 
            text-align: center;
          }
          .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: 600;
          }
          .content { 
            padding: 30px; 
          }
          .message-content { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 8px; 
            border-left: 4px solid #22c55e; 
            margin: 20px 0;
            white-space: pre-wrap;
          }
          .footer { 
            background: #f8fafc; 
            padding: 25px; 
            text-align: center; 
            border-top: 1px solid #e2e8f0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Packedin</h1>
            <p>Solutions d'emballage professionnelles</p>
          </div>
          
          <div class="content">
            <div class="message-content">
              ${message}
            </div>
          </div>
          
          <div class="footer">
            <p><strong>L'équipe Packedin</strong><br>
            📧 contact@packedin.tn | 📞 +216 29 362 224</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: '"Packedin" <packedin.tn@gmail.com>',
      to: to,
      subject: subject,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully via Gmail',
      messageId: result.messageId,
    });
  } catch (error) {
    console.error('Gmail email sending failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send email via Gmail',
        details: error instanceof Error ? error.message : 'Unknown error',
        setup: 'You need to configure Gmail App Password in the code'
      },
      { status: 500 }
    );
  }
}
