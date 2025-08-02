import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Function to convert invoice logo to base64
async function getInvoiceLogoBase64(): Promise<string> {
    try {
        const logoPath = path.join(process.cwd(), 'public', 'invoice-logo.jpg');
        const logoBuffer = fs.readFileSync(logoPath);
        return logoBuffer.toString('base64');
    } catch (error) {
        console.error('Error loading invoice logo:', error);
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

        // Get logos as base64
        const logoBase64 = await getInvoiceLogoBase64();
        const footerLogoBase64 = await getFooterLogoBase64();

        // Generate professional PDF using React-PDF
        const doc = createProfessionalInvoice(invoice, logoBase64, footerLogoBase64);

        // Generate PDF buffer
        const pdfBlob = await pdf(doc).toBlob();
        const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

        // Return as PDF
        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Disposition', `attachment; filename="Facture_${invoice.invoiceNumber}_${invoice.companyName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`);

        return new Response(pdfBuffer, { headers });

    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json(
            { error: 'Failed to generate PDF' },
            { status: 500 }
        );
    }
}

// Professional compact styles for the invoice
const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 9,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#22c55e',
    },
    logo: {
        backgroundColor: '#22c55e',
        color: '#ffffff',
        padding: 4,
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        width: 180, 
        height: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    invoiceInfo: {
        textAlign: 'right',
    },
    invoiceTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#22c55e',
        marginBottom: 4,
    },
    invoiceNumber: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    invoiceDate: {
        fontSize: 10,
        color: '#666666',
    },
    companySection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        gap: 10,
    },
    companyBox: {
        width: '48%',
        padding: 8,
        borderRadius: 4,
        borderWidth: 1,
    },
    fromBox: {
        backgroundColor: '#f0fdf4',
        borderColor: '#22c55e',
    },
    toBox: {
        backgroundColor: '#f8f9fa',
        borderColor: '#e9ecef',
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#22c55e',
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#22c55e',
        paddingBottom: 2,
    },
    companyName: {
        fontSize: 9,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    companyDetails: {
        fontSize: 8,
        lineHeight: 1.3,
        marginBottom: 1,
    },
    table: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 4,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#22c55e',
        color: '#ffffff',
        padding: 6,
        fontWeight: 'bold',
        fontSize: 8,
    },
    tableRow: {
        flexDirection: 'row',
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        minHeight: 20,
    },
    tableRowEven: {
        backgroundColor: '#f9fafb',
    },
    tableCell: {
        flex: 1,
        fontSize: 8,
        paddingRight: 3,
    },
    tableCellCenter: {
        flex: 1,
        fontSize: 8,
        textAlign: 'center',
        paddingRight: 3,
    },
    tableCellRight: {
        flex: 1,
        fontSize: 8,
        textAlign: 'right',
        paddingRight: 3,
    },
    totalsSection: {
        width: 200,
        marginLeft: 'auto',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 4,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        fontSize: 8,
    },
    totalRowBold: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 4,
        backgroundColor: '#f0fdf4',
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        fontSize: 8,
    },
    grandTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 6,
        backgroundColor: '#22c55e',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 9,
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#22c55e',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 7,
        color: '#666666',
    },
    footerSection: {
        flexDirection: 'column',
    },
    footerRight: {
        alignItems: 'flex-end',
    },
    footerCompany: {
        fontWeight: 'bold',
        color: '#22c55e',
        fontSize: 8,
        marginBottom: 2,
    },
});

// Create professional invoice document
const createProfessionalInvoice = (invoice: any, logoBase64: string, footerLogoBase64: string) => {
    const hasDiscount = invoice.items.some((item: any) => item.discount && item.discount > 0) ||
        (invoice.printing?.includePrinting && invoice.printing.discount && invoice.printing.discount > 0);

    return React.createElement(Document, {}, [
        React.createElement(Page, { key: 'invoice-page', size: 'A4', style: styles.page }, [
            // Header with logo and invoice info
            React.createElement(View, { key: 'header', style: styles.header }, [
                logoBase64 ? React.createElement(Image, {
                    key: 'logo-image',
                    src: `data:image/jpeg;base64,${logoBase64}`,
                    style: {
                        width: 120,
                        height: 'auto',
                        maxHeight: 50,
                        objectFit: 'contain',
                        borderRadius: 4
                    }
                }) : React.createElement(View, { key: 'logo', style: styles.logo }, [
                    React.createElement(Text, { key: 'logo-text' }, 'PACKEDIN')
                ]),
                React.createElement(View, { key: 'invoice-info', style: styles.invoiceInfo }, [
                    React.createElement(Text, { key: 'title', style: styles.invoiceTitle }, 'FACTURE'),
                    React.createElement(Text, { key: 'number', style: styles.invoiceNumber }, `N°: ${invoice.invoiceNumber}`),
                    React.createElement(Text, { key: 'date', style: styles.invoiceDate }, `Date: ${new Date(invoice.invoiceDate).toLocaleDateString('fr-FR')}`)
                ])
            ]),

            // Company information section
            React.createElement(View, { key: 'companies', style: styles.companySection }, [
                React.createElement(View, { key: 'from', style: [styles.companyBox, styles.fromBox] }, [
                    React.createElement(Text, { key: 'from-title', style: styles.sectionTitle }, 'Émetteur'),
                    React.createElement(Text, { key: 'company-name', style: styles.companyName }, 'KINGS WORLDWIDE DISTRIBUTION'),
                    React.createElement(Text, { key: 'address1', style: styles.companyDetails }, 'B215 Megrine Business Center 2033'),
                    React.createElement(Text, { key: 'address2', style: styles.companyDetails }, 'Ben Arous - Tunisie'),
                    React.createElement(Text, { key: 'mf', style: styles.companyDetails }, 'MF: 1586831/T/N/M/000'),
                    React.createElement(Text, { key: 'phone', style: styles.companyDetails }, 'Tél: +216 50095115 / +216 20387333'),
                    React.createElement(Text, { key: 'email', style: styles.companyDetails }, 'Email: contact@packedin.tn')
                ]),
                React.createElement(View, { key: 'to', style: [styles.companyBox, styles.toBox] }, [
                    React.createElement(Text, { key: 'to-title', style: styles.sectionTitle }, 'Client'),
                    React.createElement(Text, { key: 'client-name', style: styles.companyName }, invoice.companyName),
                    React.createElement(Text, { key: 'contact', style: styles.companyDetails }, invoice.contactPerson),
                    React.createElement(Text, { key: 'client-address', style: styles.companyDetails }, invoice.address),
                    invoice.matriculeFiscale ? React.createElement(Text, { key: 'client-mf', style: styles.companyDetails }, `MF: ${invoice.matriculeFiscale}`) : null,
                    React.createElement(Text, { key: 'client-phone', style: styles.companyDetails }, `Tél: ${invoice.phone}`),
                    React.createElement(Text, { key: 'client-email', style: styles.companyDetails }, `Email: ${invoice.email}`)
                ].filter(Boolean))
            ]),

            // Items table
            React.createElement(View, { key: 'table', style: styles.table }, [
                // Table header
                React.createElement(View, { key: 'table-header', style: styles.tableHeader }, [
                    React.createElement(Text, { key: 'desc-header', style: { ...styles.tableCell, width: '45%' } }, 'Description'),
                    React.createElement(Text, { key: 'qty-header', style: { ...styles.tableCellCenter, width: '10%' } }, 'Qté'),
                    React.createElement(Text, { key: 'price-header', style: { ...styles.tableCellRight, width: '15%' } }, 'Prix Unit.'),
                    hasDiscount ? React.createElement(Text, { key: 'discount-header', style: { ...styles.tableCellCenter, width: '10%' } }, 'Remise') : null,
                    React.createElement(Text, { key: 'total-header', style: { ...styles.tableCellRight, width: '20%' } }, 'Total')
                ].filter(Boolean)),

                // Table rows for items
                ...invoice.items.map((item: any, index: number) =>
                    React.createElement(View, {
                        key: `item-${index}`,
                        style: index % 2 === 1 ? [styles.tableRow, styles.tableRowEven] : styles.tableRow
                    }, [
                        React.createElement(Text, { key: 'desc', style: { ...styles.tableCell, width: '45%' } }, item.productName),
                        React.createElement(Text, { key: 'qty', style: { ...styles.tableCellCenter, width: '10%' } }, item.quantity.toString()),
                        React.createElement(Text, { key: 'price', style: { ...styles.tableCellRight, width: '15%' } }, `${item.unitPrice.toFixed(3)} TND`),
                        hasDiscount ? React.createElement(Text, { key: 'discount', style: { ...styles.tableCellCenter, width: '10%' } }, item.discount ? `${item.discount}%` : '0%') : null,
                        React.createElement(Text, { key: 'total', style: { ...styles.tableCellRight, width: '20%' } }, `${item.total.toFixed(2)} TND`)
                    ].filter(Boolean))
                ),

                // Printing row if exists
                invoice.printing?.includePrinting ? React.createElement(View, {
                    key: 'printing-row',
                    style: styles.tableRow
                }, [
                    React.createElement(Text, { key: 'print-desc', style: { ...styles.tableCell, width: '45%' } }, `Impression personnalisée (${invoice.printing.dimensions})`),
                    React.createElement(Text, { key: 'print-qty', style: { ...styles.tableCellCenter, width: '10%' } }, invoice.printing.quantity.toString()),
                    React.createElement(Text, { key: 'print-price', style: { ...styles.tableCellRight, width: '15%' } }, `${invoice.printing.printingPricePerUnit.toFixed(3)} TND`),
                    hasDiscount ? React.createElement(Text, { key: 'print-discount', style: { ...styles.tableCellCenter, width: '10%' } }, invoice.printing.discount ? `${invoice.printing.discount}%` : '0%') : null,
                    React.createElement(Text, { key: 'print-total', style: { ...styles.tableCellRight, width: '20%' } }, `${invoice.printing.total.toFixed(2)} TND`)
                ].filter(Boolean)) : null
            ].filter(Boolean)),

            // Totals section
            React.createElement(View, { key: 'totals', style: styles.totalsSection }, [
                React.createElement(View, { key: 'subtotal', style: styles.totalRow }, [
                    React.createElement(Text, { key: 'subtotal-label' }, 'Sous-total:'),
                    React.createElement(Text, { key: 'subtotal-value' }, `${invoice.subtotal.toFixed(2)} TND`)
                ]),
                React.createElement(View, { key: 'delivery', style: styles.totalRowBold }, [
                    React.createElement(Text, { key: 'delivery-label' }, 'Livraison:'),
                    React.createElement(Text, { key: 'delivery-value' }, '8.00 TND')
                ]),
                invoice.totalDiscount > 0 ? React.createElement(View, { key: 'discount-total', style: styles.totalRowBold }, [
                    React.createElement(Text, { key: 'discount-label' }, 'Remise:'),
                    React.createElement(Text, { key: 'discount-value' }, `${invoice.totalDiscount.toFixed(2)} TND`)
                ]) : null,
                React.createElement(View, { key: 'grand-total', style: styles.grandTotal }, [
                    React.createElement(Text, { key: 'grand-total-label' }, 'TOTAL TTC:'),
                    React.createElement(Text, { key: 'grand-total-value' }, `${invoice.total.toFixed(2)} TND`)
                ])
            ].filter(Boolean)),

            // Footer
            React.createElement(View, { key: 'footer', style: styles.footer }, [
                React.createElement(View, { key: 'footer-left', style: { ...styles.footerSection, flexDirection: 'row', alignItems: 'center' } }, [
                    footerLogoBase64 ? React.createElement(Image, {
                        key: 'footer-logo',
                        src: `data:image/jpeg;base64,${footerLogoBase64}`,
                        style: {
                            width: 50,
                            height: 'auto',
                            maxHeight: 50,
                            objectFit: 'contain',
                            marginRight: 8
                        }
                    }) : null,
                    React.createElement(View, { key: 'footer-text' }, [
                        React.createElement(Text, { key: 'footer-phone' }, '+216 50095115 / +216 20387333'),
                        React.createElement(Text, { key: 'footer-web' }, 'contact@packedin.tn - www.packedin.tn'),
                        React.createElement(Text, { key: 'footer-address' }, 'Jasmin 8050 Nabeul- Tunisia')
                    ])
                ].filter(Boolean)),
                React.createElement(View, { key: 'footer-right', style: [styles.footerSection, styles.footerRight] }, [
                    React.createElement(Text, { key: 'footer-company', style: styles.footerCompany }, 'KINGS WORLDWIDE DISTRIBUTION'),
                    React.createElement(Text, { key: 'footer-thanks' }, 'Merci pour votre confiance')
                ])
            ])
        ])
    ]);
};