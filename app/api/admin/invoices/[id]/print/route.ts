import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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
    console.log('Print view requested for invoice ID:', params.id);

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

    console.log('Invoice found for print:', invoice.invoiceNumber, 'with', invoice.items.length, 'items');

    // Generate HTML content for printing
    const htmlContent = await generatePrintHTML(invoice);

    // Return HTML for printing
    const headers = new Headers();
    headers.set('Content-Type', 'text/html; charset=utf-8');

    return new Response(htmlContent, { headers });

  } catch (error) {
    console.error('Error generating print view:', error);
    return NextResponse.json(
      { error: 'Failed to generate print view' },
      { status: 500 }
    );
  }
}

async function generatePrintHTML(invoice: any): Promise<string> {
  console.log('Starting HTML generation for print view:', invoice.invoiceNumber);

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
    <title>Facture ${invoice.invoiceNumber} - Impression</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        @page {
            size: A4;
            margin: 0;
        }

        .content-wrapper {
            padding-bottom: 40mm;
        }

        @media print {
            .invoice-container {
                page-break-inside: avoid;
                max-height: 297mm;
            }
            .footer-section {
                page-break-inside: avoid;
            }
        }
        
        body {
            font-family: Arial, sans-serif;
            line-height: 1.4;
            color: #333;
            background: white;
            padding: 0;
            margin: 0;
        }

        .invoice-container {
            max-width: 210mm;
            margin: 0 auto;
            background: white;
            position: relative;
            padding: 10mm 8mm 3mm 8mm;
            min-height: 287mm;
        }

        .header {
            background: white;
            padding: 5px 15mm;
            margin: 0 0 5px 0;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            position: relative;
        }

        .header::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #22c55e 0%, #16a34a 50%, #22c55e 100%);
        }

        .company-logo-section {
            display: flex;
            align-items: flex-start;
            align-self: flex-start;
        }

        .company-logo {
            max-height: 50px;
            max-width: 160px;
            object-fit: contain;
        }

        .invoice-title-section {
            text-align: left;
            color: #333;
            align-self: flex-start;
        }

        .invoice-box {
            border: 2px solid #22c55e;
            border-radius: 8px;
            padding: 15px;
            background: rgba(34, 197, 94, 0.05);
            display: inline-block;
        }

        .invoice-title {
            font-size: 24px;
            font-weight: 900;
            margin: 0;
            color: #22c55e;
            letter-spacing: 1.5px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }

        .invoice-basic-info {
            color: #666;
            font-size: 13px;
            margin-top: 6px;
            line-height: 1.3;
        }

        .content-section {
            padding: 30px;
        }
        
        .invoice-info {
            float: right;
            background: #22c55e;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-top: -20px;
        }
        
        .invoice-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .invoice-details {
            font-size: 14px;
        }
        
        .clearfix::after {
            content: "";
            display: table;
            clear: both;
        }
        
        .client-section {
            margin: 0 15mm 5px 15mm;
            position: relative;
        }

        .client-section::before {
            content: '';
            position: absolute;
            top: -5px;
            left: 0;
            width: 50px;
            height: 2px;
            background: #22c55e;
        }

        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .client-info {
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 12px;
        }
        
        .client-name {
            font-size: 18px;
            font-weight: bold;
            color: #374151;
            margin-bottom: 10px;
        }
        
        .client-details {
            font-size: 14px;
            line-height: 1.8;
        }
        
        .product-section {
            margin: 0 15mm 5px 15mm;
        }

        .product-title {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
            border: none;
            font-size: 12px;
            margin-bottom: 15px;
            background: white;
        }

        .items-table th {
            background: #22c55e;
            color: white;
            padding: 8px 10px;
            text-align: center;
            font-weight: 700;
            font-size: 10px;
            border: none;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .items-table th::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
        }

        .items-table th:first-child {
            border-top-left-radius: 10px;
            text-align: left;
        }

        .items-table th:last-child {
            border-top-right-radius: 10px;
        }

        .items-table td {
            padding: 6px 8px;
            border: none;
            font-size: 12px;
            text-align: center;
            border-bottom: 1px solid #f1f5f9;
            background: white;
        }

        .items-table td:first-child {
            text-align: left;
            font-weight: 500;
            color: #374151;
        }

        .items-table tr:hover td {
            background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
        }

        .items-table tr:last-child td {
            border-bottom: none;
        }

        .items-table .text-center {
            text-align: center;
        }

        .items-table .text-right {
            text-align: right;
            font-weight: 600;
        }

        .items-table tbody tr {
            background: white;
            transition: background-color 0.2s ease;
        }

        .items-table tbody tr:nth-child(even) {
            background: #f9fafb;
        }

        .items-table tbody tr:hover {
            background: #f3f4f6;
        }

        .items-table tbody tr:last-child td {
            border-bottom: none;
        }
        
        .text-right {
            text-align: right;
        }
        
        .text-center {
            text-align: center;
        }
        
        .printing-section {
            background: #f0f9ff;
            padding: 20px;
            border: 1px solid #bae6fd;
            border-radius: 8px;
            margin: 20px 0;
        }
        
        .totals-section {
            float: right;
            width: 300px;
            background: #f8fafc;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            margin-right: 15mm;
            padding: 20px;
            margin: 20px 0;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .total-row:last-child {
            border-bottom: 2px solid #22c55e;
            font-weight: bold;
            font-size: 16px;
            color: #22c55e;
            margin-top: 10px;
            padding-top: 15px;
        }

        .footer-section {
            position: absolute;
            bottom: 0;
            left: 8mm;
            right: 8mm;
            padding-top: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            color: #666;
            border-top: 2px solid #22c55e;
        }



        .footer-left {
            display: flex;
            align-items: center;
        }

        .footer-logo {
            max-height: 30px;
            max-width: 120px;
            object-fit: contain;
            margin-right: 8px;
        }

        .footer-contact {
            line-height: 1.2;
        }

        .footer-right {
            text-align: right;
            line-height: 1.2;
        }

        .footer-company {
            font-weight: bold;
            color: #22c55e;
            margin-bottom: 2px;
        }

        .print-controls {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        }
        
        .print-btn {
            background: #22c55e;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-right: 10px;
        }
        
        .close-btn {
            background: #6b7280;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        @media print {
            body { 
                padding: 0; 
                margin: 0;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }
            .invoice-container { 
                box-shadow: none; 
                margin: 0;
                padding: 20px;
                max-width: none;
            }
            .header {
                margin: -20px -20px 20px -20px;
            }
            .print-controls {
                display: none !important;
            }
        }
    </style>
</head>
<body>
    <!-- Print Controls -->
    <div class="print-controls">
        <button onclick="window.print()" class="print-btn">
            🖨️ Imprimer
        </button>
        <button onclick="window.close()" class="close-btn">
            ✕ Fermer
        </button>
    </div>

    <div class="invoice-container">
        <div class="content-wrapper">
        <div class="header">
            <div class="company-logo-section">
                <img src="data:image/jpeg;base64,${logoBase64}" alt="Packedin Logo" class="company-logo" />
            </div>
            <div class="invoice-title-section">
                <div class="invoice-box">
                    <div class="invoice-title">FACTURE</div>
                    <div class="invoice-basic-info">
                        Date : ${new Date(invoice.invoiceDate).toLocaleDateString('fr-FR')}<br>
                        Numéro : ${invoice.invoiceNumber}
                    </div>
                </div>
            </div>
        </div>
        
        <div class="client-section">
            <div class="section-title">FACTURÉ À:</div>
            <div class="client-info">
                <div class="client-name">${invoice.companyName}</div>
                ${invoice.matriculeFiscale ? `<div style="color: #6b7280; font-size: 12px; margin-bottom: 10px;">Matricule Fiscale: ${invoice.matriculeFiscale}</div>` : ''}
                <div class="client-details">
                    <div><strong>Contact:</strong> ${invoice.contactPerson}</div>
                    <div><strong>Email:</strong> ${invoice.email}</div>
                    <div><strong>Téléphone:</strong> ${invoice.phone}</div>
                    <div><strong>Adresse:</strong> ${invoice.address}</div>
                </div>
            </div>
        </div>
        
        <div class="section-title">ARTICLES DE LA FACTURE</div>
        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 40%;">Produit</th>
                    <th class="text-center" style="width: 15%;">Quantité</th>
                    <th class="text-right" style="width: 20%;">Prix Unitaire</th>
                    <th class="text-center" style="width: 10%;">Remise</th>
                    <th class="text-right" style="width: 25%;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${invoice.items.map((item: any) => `
                    <tr>
                        <td>${item.productName}</td>
                        <td class="text-center">${item.quantity}</td>
                        <td class="text-right">${item.unitPrice.toFixed(2)} TND</td>
                        <td class="text-center">${item.discount}%</td>
                        <td class="text-right">${item.total.toFixed(2)} TND</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        ${invoice.printing?.includePrinting ? `
            <div class="printing-section">
                <div class="section-title" style="color: #0369a1; border-color: #0369a1;">IMPRESSION PERSONNALISÉE</div>
                <div style="margin-top: 15px;">
                    <div><strong>Dimensions:</strong> ${invoice.printing.dimensions}</div>
                    <div><strong>Quantité:</strong> ${invoice.printing.quantity}</div>
                    <div><strong>Prix par unité:</strong> ${invoice.printing.printingPricePerUnit.toFixed(2)} TND</div>
                    <div style="margin-top: 10px; font-weight: bold; color: #22c55e;">
                        <strong>Total impression: ${invoice.printing.total.toFixed(2)} TND</strong>
                    </div>
                </div>
            </div>
        ` : ''}
        
        <div class="clearfix">
            <div class="totals-section">
                <div class="total-row">
                    <span>Sous-total:</span>
                    <span>${invoice.subtotal.toFixed(2)} TND</span>
                </div>
                ${invoice.totalDiscount > 0 ? `
                    <div class="total-row" style="color: #ef4444;">
                        <span>Remise totale:</span>
                        <span>-${invoice.totalDiscount.toFixed(2)} TND</span>
                    </div>
                ` : ''}
                ${invoice.printingCosts > 0 ? `
                    <div class="total-row">
                        <span>Impression:</span>
                        <span>${invoice.printingCosts.toFixed(2)} TND</span>
                    </div>
                ` : ''}
                <div class="total-row">
                    <span>TOTAL TTC:</span>
                    <span>${invoice.total.toFixed(2)} TND</span>
                </div>
            </div>
        </div>
        </div>

        <div class="footer-section">
            <div class="footer-left">
                <img src="data:image/jpeg;base64,${footerLogoBase64}" alt="Packedin Footer Logo" class="footer-logo" />
                <div class="footer-contact">
                    +216 50095115 / +216 20387333<br>
                    contact@packedin.tn<br>
                    www.packedin.tn<br>
                    Jasmin 8050 Nabeul- Tunisia
                </div>
            </div>
            <div class="footer-right">
                <div class="footer-company">Powered by: KINGS WORLDWIDE DISTRIBUTION</div>
                <div>Adresse: B215 Megrine Business Center 2033</div>
                <div>Ben Arous - Tunisie</div>
                <div>MF: 1586831/T/N/M/000</div>
            </div>
        </div>

    </div>
</body>
</html>`;
}
