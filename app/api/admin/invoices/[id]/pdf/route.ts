import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

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
        const htmlContent = generateInvoiceHTML(invoice);

        // Return HTML that opens print dialog automatically
        const headers = new Headers();
        headers.set('Content-Type', 'text/html; charset=utf-8');

        return new Response(htmlContent, { headers });

    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json(
            { error: 'Failed to generate PDF' },
            { status: 500 }
        );
    }
}

function generateInvoiceHTML(invoice: any): string {
    // Check if any items have a discount to show REMISE column
    const hasDiscount = invoice.items.some((item: any) => item.discount && item.discount > 0) ||
        (invoice.printing?.includePrinting && invoice.printing.discount && invoice.printing.discount > 0);

    return `<!DOCTYPE html>
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
            margin: 15mm;
        }

        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .no-print { display: none !important; }
        }

        body {
            width: 210mm;
            margin: 0 auto;
            padding: 15mm;
            color: #333;
            font-size: 12px;
            background: white;
        }

        .print-header {
            background: #22c55e;
            color: white;
            padding: 15px;
            text-align: center;
            margin-bottom: 20px;
            border-radius: 8px;
        }

        .print-button {
            background: #22c55e;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 0 10px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 3px solid #22c55e;
        }

        .logo {
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            box-shadow: 0 4px 8px rgba(34, 197, 94, 0.3);
        }

        .invoice-info {
            text-align: right;
        }

        .invoice-title {
            font-size: 28px;
            font-weight: bold;
            color: #22c55e;
            margin-bottom: 8px;
        }

        .invoice-number {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 5px;
        }

        .invoice-date {
            color: #666;
            font-size: 13px;
        }

        .company-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 25px;
            gap: 20px;
        }

        .from, .to {
            width: 48%;
            padding: 15px;
            border-radius: 8px;
        }

        .from {
            background: #f8fffe;
            border: 2px solid #e6fffa;
        }

        .to {
            background: #f8f9fa;
            border: 2px solid #e9ecef;
        }

        .section-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: #22c55e;
            font-size: 16px;
            border-bottom: 2px solid #22c55e;
            padding-bottom: 5px;
        }

        .company-name {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 5px;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
        }

        .items-table th {
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
            font-size: 12px;
        }

        .items-table td {
            padding: 12px;
            border-bottom: 1px solid #eee;
        }

        .items-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .items-table tr:hover {
            background-color: #f0fdf4;
        }

        .text-right { text-align: right; }
        .text-center { text-align: center; }

        .totals {
            width: 350px;
            margin-left: auto;
            margin-top: 15px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .totals table {
            width: 100%;
            border-collapse: collapse;
        }

        .totals td {
            padding: 10px 15px;
            border-bottom: 1px solid #eee;
        }

        .total-row {
            font-weight: bold;
            background-color: #f1f8e9;
        }

        .grand-total {
            font-weight: bold;
            font-size: 16px;
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
        }

        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 3px solid #22c55e;
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #666;
        }

        .footer-left, .footer-right {
            display: flex;
            flex-direction: column;
        }

        .footer-right {
            align-items: flex-end;
        }

        .footer-company {
            font-weight: bold;
            color: #22c55e;
            font-size: 12px;
        }
    </style>
    <script>
        function printInvoice() {
            window.print();
        }

        function downloadPDF() {
            window.print();
        }

        // Auto-open print dialog after 1 second
        window.onload = function() {
            setTimeout(() => {
                window.print();
            }, 1000);
        }
    </script>
</head>
<body>
    <div class="print-header no-print">
        <h2>📄 Facture ${invoice.invoiceNumber} - Prête à imprimer</h2>
        <p style="margin: 10px 0;">Cliquez sur "Imprimer" puis sélectionnez "Enregistrer au format PDF"</p>
        <button class="print-button" onclick="printInvoice()">🖨️ Imprimer PDF</button>
        <button class="print-button" onclick="window.close()">❌ Fermer</button>
    </div>

    <div class="header">
        <div class="logo">PACKEDIN</div>
        <div class="invoice-info">
            <div class="invoice-title">FACTURE</div>
            <div class="invoice-number">N°: ${invoice.invoiceNumber}</div>
            <div class="invoice-date">Date: ${new Date(invoice.invoiceDate).toLocaleDateString('fr-FR')}</div>
        </div>
    </div>

    <div class="company-info">
        <div class="from">
            <div class="section-title">Émetteur</div>
            <div class="company-name">KINGS WORLDWIDE DISTRIBUTION</div>
            <div>B215 Megrine Business Center 2033</div>
            <div>Ben Arous - Tunisie</div>
            <div>MF: 1586831/T/N/M/000</div>
            <div>Tél: +216 50095115 / +216 20387333</div>
            <div>Email: contact@packedin.tn</div>
        </div>
        <div class="to">
            <div class="section-title">Client</div>
            <div class="company-name">${invoice.companyName}</div>
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

    <div class="footer">
        <div class="footer-left">
            <div>+216 50095115 / +216 20387333</div>
            <div>contact@packedin.tn - www.packedin.tn</div>
            <div>Jasmin 8050 Nabeul- Tunisia</div>
        </div>
        <div class="footer-right">
            <div class="footer-company">KINGS WORLDWIDE DISTRIBUTION</div>
            <div>Merci pour votre confiance</div>
        </div>
    </div>
</body>
</html>`;
}