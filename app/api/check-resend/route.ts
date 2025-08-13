import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_RuTNXtVV_Q4Wpevrp7peLv5vAUZm8V88K');

export async function GET(request: NextRequest) {
  try {
    // Check Resend domains
    const domains = await resend.domains.list();
    
    // Check API key status by trying to get account info
    const apiKeyInfo = {
      configured: !!process.env.RESEND_API_KEY,
      keyLength: process.env.RESEND_API_KEY?.length || 0,
    };

    return NextResponse.json({
      success: true,
      apiKey: apiKeyInfo,
      domains: domains,
      recommendations: {
        currentSetup: 'Using onboarding@resend.dev (test domain)',
        issue: 'Test domain emails may not be delivered to real email addresses',
        solutions: [
          '1. Add and verify your own domain (packedin.tn) in Resend dashboard',
          '2. Use a verified email service domain',
          '3. For testing, use delivered@resend.dev as recipient'
        ]
      }
    });
  } catch (error) {
    console.error('Resend check failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check Resend configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
