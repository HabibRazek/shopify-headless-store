import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// Function to convert logo to base64
async function getLogoBase64(): Promise<string> {
    try {
        const logoPath = path.join(process.cwd(), 'public', 'packedin.jpg');
        const logoBuffer = fs.readFileSync(logoPath);
        return logoBuffer.toString('base64');
    } catch (error) {
        console.error('Error loading logo:', error);
        return '';
    }
}

// Function to convert footer logo to base64
async function getFooterLogoBase64(): Promise<string> {
    try {
        const logoPath = path.join(process.cwd(), 'public', 'footer-logo.jpg');
        const logoBuffer = fs.readFileSync(logoPath);
        return logoBuffer.toString('base64');
    } catch (error) {
        console.error('Error reading footer logo file:', error);
        return '';
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log('PDF generation requested for invoice ID:', params.id);

        // Fetch invoice with all related data
        const invoice = await prisma.invoice.findUnique({
            where: { id: params.id },
            include: {
                items: true,
                printing: true,
            },
        });

        if (!invoice) {
            console.log('Invoice not found:', params.id);
            return NextResponse.json(
                { error: 'Invoice not found' },
                { status: 404 }
            );
        }

        console.log('Invoice found:', invoice.invoiceNumber, 'with', invoice.items.length, 'items');

        // Generate HTML content for the invoice
        const htmlContent = await generateInvoiceHTML(invoice);

        try {
            // Generate PDF using Puppeteer
            const browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu'
                ]
            });

            const page = await browser.newPage();

            // Set content and wait for it to load
            await page.setContent(htmlContent, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });

            // Generate PDF
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '10mm',
                    bottom: '10mm',
                    left: '10mm',
                    right: '10mm'
                }
            });

            await browser.close();

            // Set up response headers for PDF download
            const headers = new Headers();
            headers.set('Content-Type', 'application/pdf');
            headers.set('Content-Disposition', `attachment; filename="Facture_${invoice.invoiceNumber}_${invoice.companyName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`);

            console.log('PDF generated successfully using Puppeteer, size:', pdfBuffer.length, 'bytes');
            return new Response(pdfBuffer, { headers });

        } catch (pdfError) {
            console.error('Error generating PDF with Puppeteer:', pdfError);

            // Fallback: return HTML for manual printing
            const headers = new Headers();
            headers.set('Content-Type', 'text/html; charset=utf-8');
            headers.set('Content-Disposition', `inline; filename="Facture_${invoice.invoiceNumber}_${invoice.companyName.replace(/[^a-zA-Z0-9]/g, '_')}.html"`);

            return new Response(htmlContent, { headers });
        }

    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json(
            { error: 'Failed to generate PDF' },
            { status: 500 }
        );
    }
}

async function generateInvoiceHTML(invoice: any): Promise<string> {
    console.log('Starting HTML generation for invoice:', invoice.invoiceNumber);

    const logoBase64 = await getLogoBase64();
    const footerLogoBase64 = await getFooterLogoBase64();

    // Check if any items have a discount to show REMISE column
    const hasDiscount = invoice.items.some((item: any) => item.discount && item.discount > 0) ||
        (invoice.printing?.includePrinting && invoice.printing.discount && invoice.printing.discount > 0);

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture ${invoice.invoiceNumber}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        @page {
            size: A4;
            margin: 10mm;
        }

        body {
            width: 210mm;
            height: 297mm;
            margin: 0 auto;
            padding: 10mm;
            color: #333;
            font-size: 12px;
            position: relative;
        }

        .invoice-container {
            display: flex;
            flex-direction: column;
            height: 277mm; /* 297mm - 10mm top - 10mm bottom */
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #22c55e;
        }

        .logo {
            height: 60px;
        }

        .invoice-info {
            text-align: right;
        }

        .invoice-title {
            font-size: 24px;
            font-weight: bold;
            color: #22c55e;
            margin-bottom: 5px;
        }

        .invoice-number {
            font-weight: bold;
            margin-bottom: 3px;
        }

        .invoice-date {
            color: #666;
        }

        .company-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .from, .to {
            width: 48%;
            padding: 10px;
            border-radius: 5px;
        }

        .to {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
        }

        .section-title {
            font-weight: bold;
            margin-bottom: 8px;
            color: #22c55e;
            font-size: 14px;
            border-bottom: 1px solid #eee;
            padding-bottom: 3px;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }

        .items-table th {
            background-color: #22c55e;
            color: white;
            padding: 8px 10px;
            text-align: left;
            font-weight: bold;
            font-size: 11px;
        }

        .items-table td {
            padding: 8px 10px;
            border-bottom: 1px solid #eee;
        }

        .items-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .totals {
            width: 300px;
            margin-left: auto;
            margin-top: 10px;
        }

        .totals table {
            width: 100%;
            border-collapse: collapse;
        }

        .totals td {
            padding: 5px 10px;
        }

        .total-row {
            font-weight: bold;
            background-color: #f1f8e9 !important;
        }

        .grand-total {
            font-weight: bold;
            font-size: 14px;
            background-color: #22c55e !important;
            color: white;
        }

        .footer {
            position: absolute;
            bottom: 10mm;
            left: 10mm;
            right: 10mm;
            padding-top: 10px;
            border-top: 2px solid #22c55e;
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: #666;
        }

        .footer-logo {
            height: 40px;
            margin-right: 10px;
        }

        .footer-left {
            display: flex;
            align-items: center;
        }

        .footer-contact {
            line-height: 1.4;
        }

        .footer-company {
            font-weight: bold;
            color: #22c55e;
        }

        .note {
            margin-top: 20px;
            font-size: 11px;
            color: #666;
            font-style: italic;
        }

        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <img src="data:image/jpeg;base64,${logoBase64}" alt="Company Logo" class="logo">
            <div class="invoice-info">
                <div class="invoice-title">FACTURE</div>
                <div class="invoice-number">N°: ${invoice.invoiceNumber}</div>
                <div class="invoice-date">Date: ${new Date(invoice.invoiceDate).toLocaleDateString('fr-FR')}</div>
            </div>
        </div>

        <div class="company-info">
            <div class="from">
                <div class="section-title">Émetteur</div>
                <div><strong>KINGS WORLDWIDE DISTRIBUTION</strong></div>
                <div>B215 Megrine Business Center 2033</div>
                <div>Ben Arous - Tunisie</div>
                <div>MF: 1586831/T/N/M/000</div>
                <div>Tél: +216 50095115 / +216 20387333</div>
                <div>Email: contact@packedin.tn</div>
            </div>
            <div class="to">
                <div class="section-title">Client</div>
                <div><strong>${invoice.companyName}</strong></div>
                <div>${invoice.contactPerson}</div>
                <div>${invoice.address}</div>
                ${invoice.matriculeFiscale ? `<div>MF: ${invoice.matriculeFiscale}</div>` : ''}
                <div>Tél: ${invoice.phone}</div>
                <div>Email: ${invoice.email}</div>
            </div>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 45%">Description</th>
                    <th style="width: 10%">Qté</th>
                    <th style="width: 15%">Prix Unitaire</th>
                    ${hasDiscount ? '<th style="width: 10%">Remise</th>' : ''}
                    <th style="width: 20%" class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                ${invoice.items.map((item: any) => `
                    <tr>
                        <td>${item.productName}</td>
                        <td class="text-center">${item.quantity}</td>
                        <td class="text-right">${item.unitPrice.toFixed(3)} TND</td>
                        ${hasDiscount ? `<td class="text-center">${item.discount ? item.discount + '%' : '0%'}</td>` : ''}
                        <td class="text-right">${item.total.toFixed(2)} TND</td>
                    </tr>
                `).join('')}
                ${invoice.printing?.includePrinting ? `
                    <tr>
                        <td>Impression personnalisée (${invoice.printing.dimensions})</td>
                        <td class="text-center">${invoice.printing.quantity}</td>
                        <td class="text-right">${invoice.printing.printingPricePerUnit.toFixed(3)} TND</td>
                        ${hasDiscount ? `<td class="text-center">${invoice.printing.discount ? invoice.printing.discount + '%' : '0%'}</td>` : ''}
                        <td class="text-right">${invoice.printing.total.toFixed(2)} TND</td>
                    </tr>
                ` : ''}
            </tbody>
        </table>

        <div class="totals">
            <table>
                <tr>
                    <td>Sous-total:</td>
                    <td class="text-right">${invoice.subtotal.toFixed(2)} TND</td>
                </tr>
                <tr class="total-row">
                    <td>Livraison:</td>
                    <td class="text-right">8.00 TND</td>
                </tr>
                ${invoice.totalDiscount > 0 ? `
                <tr class="total-row">
                    <td>Remise:</td>
                    <td class="text-right">${invoice.totalDiscount.toFixed(2)} TND</td>
                </tr>
                ` : ''}
                <tr class="grand-total">
                    <td>TOTAL TTC:</td>
                    <td class="text-right">${invoice.total.toFixed(2)} TND</td>
                </tr>
            </table>
        </div>

        <div class="note">
            <div>Mode de paiement: Virement bancaire</div>
            <div>RIB: 10 325 124 12457895 78 - STB</div>
            <div>Délai de paiement: 30 jours à partir de la date de facturation</div>
        </div>

        <div class="footer">
            <div class="footer-left">
                <img src="data:image/jpeg;base64,${footerLogoBase64}" alt="Footer Logo" class="footer-logo">
                <div class="footer-contact">
                    <div>+216 50095115 / +216 20387333</div>
                    <div>contact@packedin.tn - www.packedin.tn</div>
                    <div>Jasmin 8050 Nabeul- Tunisia</div>
                </div>
            </div>
            <div class="footer-right">
                <div class="footer-company">KINGS WORLDWIDE DISTRIBUTION</div>
                <div>Merci pour votre confiance</div>
            </div>
        </div>
    </div>
</body>
</html>`;
}