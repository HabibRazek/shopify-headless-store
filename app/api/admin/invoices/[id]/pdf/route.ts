import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface InvoiceItem {
    productName: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    total: number;
}

interface Invoice {
    id: string;
    invoiceNumber: string;
    invoiceDate: Date;
    createdAt: Date;
    items: InvoiceItem[];
    subtotal: number;
    delivery?: number;
    total: number;
    totalDiscount: number;
    companyName: string;
    contactPerson: string;
    address: string;
    matriculeFiscale?: string | null;
    phone: string;
    email: string;
    printing?: {
        id: string;
        total: number;
        createdAt: Date;
        updatedAt: Date;
        invoiceId: string;
        quantity: number;
        includePrinting: boolean;
        dimensions: string | null;
        printingPricePerUnit: number;
        notes: string | null;
        discount?: number;
    } | null;
}

// Function to convert logo to base64
async function getLogoBase64(): Promise<string> {
    try {
        const logoPath = path.join(process.cwd(), 'public', 'packedin.jpg');
        const logoBuffer = fs.readFileSync(logoPath);
        return logoBuffer.toString('base64');
    } catch {
        console.log('Could not load logo');
        return '';
    }
}

export async function GET(
    _request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🚀 Starting PDF generation with jsPDF...');

        // Fetch invoice with all related data
        const invoice = await prisma.invoice.findUnique({
            where: { id: params.id },
            include: {
                items: true,
                printing: true,
            },
        });

        if (!invoice) {
            return NextResponse.json(
                { error: 'Invoice not found' },
                { status: 404 }
            );
        }

        // Generate PDF using jsPDF
        const doc = new jsPDF();

        // Set font
        doc.setFont('helvetica');

        // Add logo
        try {
            const logoBase64 = await getLogoBase64();
            if (logoBase64) {
                doc.addImage(`data:image/jpeg;base64,${logoBase64}`, 'JPEG', 15, 15, 30, 15);
            }
        } catch (error) {
            console.log('Could not add logo:', error);
        }

        // Header - Company Info
        doc.setFontSize(20);
        doc.setTextColor(34, 197, 94); // Green color
        doc.text('FACTURE', 150, 25);

        // Invoice details
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Facture N°: ${invoice.invoiceNumber}`, 150, 35);
        doc.text(`Date: ${new Date(invoice.invoiceDate).toLocaleDateString('fr-FR')}`, 150, 42);

        // Client information
        doc.setFontSize(12);
        doc.setTextColor(34, 197, 94);
        doc.text('FACTURÉ À:', 15, 55);

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(invoice.companyName, 15, 65);
        doc.text(invoice.contactPerson, 15, 72);
        doc.text(invoice.address, 15, 79);
        doc.text(`Tél: ${invoice.phone}`, 15, 86);
        doc.text(`Email: ${invoice.email}`, 15, 93);

        if (invoice.matriculeFiscale) {
            doc.text(`MF: ${invoice.matriculeFiscale}`, 15, 100);
        }

        // Items table
        const tableData = invoice.items.map((item: InvoiceItem) => [
            item.productName,
            item.quantity.toString(),
            `${item.unitPrice.toFixed(3)} TND`,
            item.discount ? `${item.discount}%` : '0%',
            `${item.total.toFixed(2)} TND`
        ]);

        // Add printing if included
        if (invoice.printing?.includePrinting) {
            tableData.push([
                `Impression personnalisée (${invoice.printing.dimensions})`,
                invoice.printing.quantity.toString(),
                `${invoice.printing.printingPricePerUnit.toFixed(3)} TND`,
                '0%',
                `${invoice.printing.total.toFixed(2)} TND`
            ]);
        }

        // Use autoTable for the items table
        (doc as any).autoTable({
            head: [['Description', 'Qté', 'Prix Unitaire', 'Remise', 'Total']],
            body: tableData,
            startY: 115,
            theme: 'grid',
            headStyles: {
                fillColor: [34, 197, 94],
                textColor: [255, 255, 255],
                fontSize: 10,
                halign: 'center'
            },
            bodyStyles: {
                fontSize: 9,
                halign: 'center'
            },
            columnStyles: {
                0: { halign: 'left', cellWidth: 80 },
                1: { halign: 'center', cellWidth: 20 },
                2: { halign: 'right', cellWidth: 30 },
                3: { halign: 'center', cellWidth: 20 },
                4: { halign: 'right', cellWidth: 30 }
            }
        });

        // Get the final Y position after the table
        const finalY = (doc as any).lastAutoTable.finalY + 10;

        // Totals section
        const totalsX = 130;
        let currentY = finalY;

        doc.setFontSize(10);
        doc.text(`Sous-total: ${invoice.subtotal.toFixed(2)} TND`, totalsX, currentY);
        currentY += 7;

        doc.text('Livraison: 8.00 TND', totalsX, currentY);
        currentY += 7;

        if (invoice.totalDiscount > 0) {
            doc.text(`Remise: ${invoice.totalDiscount.toFixed(2)} TND`, totalsX, currentY);
            currentY += 7;
        }

        // Total
        doc.setFontSize(12);
        doc.setTextColor(34, 197, 94);
        doc.text(`TOTAL TTC: ${invoice.total.toFixed(2)} TND`, totalsX, currentY);

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('KINGS WORLDWIDE DISTRIBUTION', 15, 270);
        doc.text('+216 50095115 / +216 20387333', 15, 277);
        doc.text('contact@packedin.tn - www.packedin.tn', 15, 284);
        doc.text('Jasmin 8050 Nabeul- Tunisia', 15, 291);

        // Convert to buffer
        const pdfArrayBuffer = doc.output('arraybuffer');
        const pdfBuffer = Buffer.from(pdfArrayBuffer);

        console.log(`✅ PDF generated successfully: ${pdfBuffer.length} bytes`);

        // Set up response headers for PDF download
        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Disposition', `attachment; filename="Facture_${invoice.invoiceNumber}_${invoice.companyName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`);
        headers.set('Content-Length', pdfBuffer.length.toString());
        headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        headers.set('Pragma', 'no-cache');
        headers.set('Expires', '0');

        return new Response(pdfBuffer, { headers });

    } catch (pdfError) {
        console.error('❌ Error generating PDF:', pdfError);

        return NextResponse.json(
            {
                error: 'PDF generation failed',
                details: pdfError instanceof Error ? pdfError.message : 'Unknown error',
                suggestion: 'Please try again or contact support if the issue persists'
            },
            { status: 500 }
        );
    }
}
