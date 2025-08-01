import { NextResponse } from 'next/server';
import jsPDF from 'jspdf';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET() {
    try {
        console.log('🔍 Testing PDF generation health...');
        console.log('Environment:', process.env.NODE_ENV);
        console.log('Platform:', process.platform);

        // Test jsPDF configuration
        console.log('🚀 Creating test PDF with jsPDF...');

        const doc = new jsPDF();

        // Add content to test PDF
        doc.setFontSize(20);
        doc.setTextColor(34, 197, 94); // Green color
        doc.text('✅ PDF Generation Health Check', 20, 30);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Environment: ${process.env.NODE_ENV}`, 20, 50);
        doc.text(`Platform: ${process.platform}`, 20, 60);
        doc.text(`Timestamp: ${new Date().toISOString()}`, 20, 70);
        doc.text('Status: PDF generation is working correctly!', 20, 80);

        // Generate PDF buffer
        console.log('📄 Generating test PDF...');
        const pdfArrayBuffer = doc.output('arraybuffer');
        const pdfBuffer = Buffer.from(pdfArrayBuffer);

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
            message: 'PDF generation is working correctly with jsPDF',
            environment: process.env.NODE_ENV,
            platform: process.platform,
            pdfSize: pdfBuffer.length,
            timestamp: new Date().toISOString(),
            pdfLibrary: 'jsPDF',
            note: 'Using jsPDF for better serverless compatibility'
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
            suggestion: 'Check jsPDF configuration and dependencies'
        }, { status: 500 });
    }
}
