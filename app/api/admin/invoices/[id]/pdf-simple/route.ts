import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jsPDF from 'jspdf';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET(
    _request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🚀 Starting SIMPLE PDF generation...');
        console.log('📋 Invoice ID:', params.id);

        // Fetch invoice with all related data
        const invoice = await prisma.invoice.findUnique({
            where: { id: params.id },
            include: {
                items: true,
                printing: true,
            },
        });

        if (!invoice) {
            console.error('❌ Invoice not found:', params.id);
            return NextResponse.json(
                { error: 'Invoice not found' },
                { status: 404 }
            );
        }

        console.log('✅ Invoice found, creating simple PDF...');

        // Create simple PDF without complex features
        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(20);
        doc.text('FACTURE', 20, 30);
        
        // Invoice info
        doc.setFontSize(12);
        doc.text(`Facture N°: ${invoice.invoiceNumber}`, 20, 50);
        doc.text(`Date: ${new Date(invoice.invoiceDate).toLocaleDateString('fr-FR')}`, 20, 60);
        
        // Client info
        doc.text('Client:', 20, 80);
        doc.text(invoice.companyName, 20, 90);
        doc.text(invoice.contactPerson, 20, 100);
        doc.text(invoice.address, 20, 110);
        doc.text(`Tel: ${invoice.phone}`, 20, 120);
        doc.text(`Email: ${invoice.email}`, 20, 130);
        
        // Items (simple list)
        let yPos = 150;
        doc.text('Articles:', 20, yPos);
        yPos += 10;
        
        invoice.items.forEach((item, index) => {
            doc.text(`${index + 1}. ${item.productName}`, 20, yPos);
            doc.text(`Qté: ${item.quantity} - Prix: ${item.unitPrice.toFixed(2)} TND`, 30, yPos + 8);
            doc.text(`Total: ${item.total.toFixed(2)} TND`, 30, yPos + 16);
            yPos += 25;
        });
        
        // Totals
        yPos += 10;
        doc.text(`Sous-total: ${invoice.subtotal.toFixed(2)} TND`, 20, yPos);
        doc.text(`Total: ${invoice.total.toFixed(2)} TND`, 20, yPos + 10);
        
        // Generate buffer
        console.log('📄 Converting to buffer...');
        const pdfArrayBuffer = doc.output('arraybuffer');
        const pdfBuffer = Buffer.from(pdfArrayBuffer);
        
        console.log(`✅ Simple PDF generated: ${pdfBuffer.length} bytes`);

        // Return PDF
        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Disposition', `attachment; filename="Simple_Facture_${invoice.invoiceNumber}.pdf"`);
        
        return new Response(pdfBuffer, { headers });

    } catch (error) {
        console.error('❌ Simple PDF generation failed:', error);
        
        return NextResponse.json({
            error: 'Simple PDF generation failed',
            details: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace'
        }, { status: 500 });
    }
}
