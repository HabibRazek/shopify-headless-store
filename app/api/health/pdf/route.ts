import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET() {
    try {
        console.log('🔍 Testing PDF generation health...');
        console.log('Environment:', process.env.NODE_ENV);
        console.log('Platform:', process.platform);

        // Test Puppeteer configuration
        const isProduction = process.env.NODE_ENV === 'production';
        const browserConfig = {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--single-process'
            ],
            ...(isProduction && process.env.PUPPETEER_EXECUTABLE_PATH && {
                executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
            })
        };

        console.log('🚀 Launching browser...');
        const browser = await puppeteer.launch(browserConfig);
        
        console.log('📄 Creating test page...');
        const page = await browser.newPage();
        
        // Simple HTML content for testing
        const testHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>PDF Health Check</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .header { color: #22c55e; font-size: 24px; font-weight: bold; }
                    .content { margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="header">✅ PDF Generation Health Check</div>
                <div class="content">
                    <p>Environment: ${process.env.NODE_ENV}</p>
                    <p>Platform: ${process.platform}</p>
                    <p>Timestamp: ${new Date().toISOString()}</p>
                    <p>Status: PDF generation is working correctly!</p>
                </div>
            </body>
            </html>
        `;

        await page.setContent(testHTML, {
            waitUntil: 'domcontentloaded',
            timeout: 10000
        });

        console.log('📄 Generating test PDF...');
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' }
        });

        await browser.close();

        // Validate PDF
        if (!pdfBuffer || pdfBuffer.length === 0) {
            throw new Error('Generated PDF buffer is empty');
        }

        const pdfHeader = pdfBuffer.slice(0, 4).toString();
        if (pdfHeader !== '%PDF') {
            throw new Error('Generated buffer is not a valid PDF');
        }

        console.log('✅ PDF health check successful:', pdfBuffer.length, 'bytes');

        return NextResponse.json({
            status: 'healthy',
            message: 'PDF generation is working correctly',
            environment: process.env.NODE_ENV,
            platform: process.platform,
            pdfSize: pdfBuffer.length,
            timestamp: new Date().toISOString(),
            puppeteerConfig: {
                hasCustomExecutablePath: !!process.env.PUPPETEER_EXECUTABLE_PATH,
                isProduction
            }
        });

    } catch (error) {
        console.error('❌ PDF health check failed:', error);
        
        return NextResponse.json({
            status: 'unhealthy',
            message: 'PDF generation failed',
            error: error instanceof Error ? error.message : 'Unknown error',
            environment: process.env.NODE_ENV,
            platform: process.platform,
            timestamp: new Date().toISOString(),
            suggestion: 'Check Puppeteer configuration and environment variables'
        }, { status: 500 });
    }
}
