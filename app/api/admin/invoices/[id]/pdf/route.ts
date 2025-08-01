import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, pdf } from '@react-pdf/renderer';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

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

// Function to get PACKEDIN header logo - try multiple formats for best compatibility
async function getLogoBase64(): Promise<{ data: string; format: string }> {
    try {
        // Try SVG first (most reliable with React-PDF)
        const svgPath = path.join(process.cwd(), 'public', 'packedin-logo.svg');
        if (fs.existsSync(svgPath)) {
            console.log('🔍 Loading packedin-logo.svg at:', svgPath);
            const svgContent = fs.readFileSync(svgPath, 'utf8');
            const base64 = Buffer.from(svgContent).toString('base64');
            console.log('✅ SVG logo loaded successfully, length:', base64.length);
            return { data: base64, format: 'svg' };
        }

        // Try PNG next (better React-PDF support than JPG)
        const pngPath = path.join(process.cwd(), 'public', 'packedin.png');
        if (fs.existsSync(pngPath)) {
            console.log('🔍 Loading packedin.png at:', pngPath);
            const logoBuffer = fs.readFileSync(pngPath);
            console.log('✅ PNG logo loaded successfully, size:', logoBuffer.length, 'bytes');
            const base64 = logoBuffer.toString('base64');
            return { data: base64, format: 'png' };
        }

        // Try JPG as last resort
        const jpgPath = path.join(process.cwd(), 'public', 'packedin.jpg');
        if (fs.existsSync(jpgPath)) {
            console.log('🔍 Loading packedin.jpg at:', jpgPath);
            const logoBuffer = fs.readFileSync(jpgPath);
            console.log('✅ JPG logo loaded successfully, size:', logoBuffer.length, 'bytes');
            const base64 = logoBuffer.toString('base64');
            return { data: base64, format: 'jpg' };
        }

        console.log('❌ No packedin logo files found');
        return { data: '', format: '' };
    } catch (error) {
        console.log('❌ Error loading packedin logo:', error);
        return { data: '', format: '' };
    }
}

// Function to get footer logo
async function getFooterLogoBase64(): Promise<{ data: string; format: string }> {
    try {
        const footerPath = path.join(process.cwd(), 'public', 'footer-logo.jpg');
        if (fs.existsSync(footerPath)) {
            console.log('🔍 Loading footer-logo.jpg at:', footerPath);
            const logoBuffer = fs.readFileSync(footerPath);
            console.log('✅ Footer logo loaded successfully, size:', logoBuffer.length, 'bytes');
            const base64 = logoBuffer.toString('base64');
            return { data: base64, format: 'jpg' };
        }

        console.log('❌ Footer logo not found');
        return { data: '', format: '' };
    } catch (error) {
        console.log('❌ Error loading footer logo:', error);
        return { data: '', format: '' };
    }
}

// Footer logo function removed - only using main packedin.jpg logo

// Styles that match your HTML design exactly
const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 12,
        padding: 30,
        color: '#333',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
        paddingBottom: 10,
        borderBottom: '2px solid #22c55e',
    },
    logo: {
        width: 120,
        height: 60,
        marginRight: 20,
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 5,
        border: '1px solid #e5e5e5',
    },
    textLogo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#22c55e',
        marginRight: 20,
        padding: 10,
        border: '2px solid #22c55e',
        borderRadius: 5,
        backgroundColor: 'white',
    },
    invoiceInfo: {
        textAlign: 'right',
    },
    invoiceTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#22c55e',
        marginBottom: 5,
    },
    invoiceNumber: {
        fontWeight: 'bold',
        marginBottom: 3,
    },
    invoiceDate: {
        color: '#666',
    },
    companyInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    fromSection: {
        width: '48%',
        padding: 10,
    },
    toSection: {
        width: '48%',
        padding: 10,
        backgroundColor: '#f8f9fa',
        border: '1px solid #e9ecef',
        borderRadius: 5,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#22c55e',
        fontSize: 14,
        borderBottom: '1px solid #eee',
        paddingBottom: 3,
    },
    table: {
        marginBottom: 15,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#22c55e',
        color: 'white',
        padding: 8,
        fontWeight: 'bold',
        fontSize: 11,
    },
    tableRow: {
        flexDirection: 'row',
        padding: 8,
        borderBottom: '1px solid #eee',
    },
    tableRowEven: {
        backgroundColor: '#f9f9f9',
    },
    col1: { width: '45%' },
    col2: { width: '10%', textAlign: 'center' },
    col3: { width: '15%', textAlign: 'right' },
    col4: { width: '10%', textAlign: 'center' },
    col5: { width: '20%', textAlign: 'right' },
    totals: {
        width: 300,
        marginLeft: 'auto',
        marginTop: 10,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
    },
    totalRowBold: {
        fontWeight: 'bold',
        backgroundColor: '#f1f8e9',
    },
    grandTotal: {
        fontWeight: 'bold',
        fontSize: 14,
        backgroundColor: '#22c55e',
        color: 'white',
        padding: 8,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        paddingTop: 10,
        borderTop: '2px solid #22c55e',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 10,
        color: '#666',
    },
    footerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerLogo: {
        width: 40,
        height: 40,
        marginRight: 10,
        backgroundColor: 'white',
        padding: 3,
        borderRadius: 3,
        border: '1px solid #e5e5e5',
    },
    footerCompany: {
        fontWeight: 'bold',
        color: '#22c55e',
    },
});

// Function to create React-PDF Invoice Document using React.createElement (no JSX)
const createInvoiceDocument = (invoice: any, headerLogo: { data: string; format: string }, footerLogo: { data: string; format: string }) => {
    const hasDiscount = invoice.items.some((item: any) => item.discount && item.discount > 0) ||
        (invoice.printing?.includePrinting && invoice.printing.discount && invoice.printing.discount > 0);

    // Create header section with packedin logo
    console.log('🎨 Creating header section, logo available:', !!headerLogo.data);
    console.log('🎨 Header logo format:', headerLogo.format);

    // Create logo element - try SVG/PNG/JPG with enhanced visibility
    let logoElement;
    if (headerLogo.data) {
        console.log('🎨 Creating image element for packedin logo, format:', headerLogo.format);

        let mimeType: string;
        switch (headerLogo.format) {
            case 'svg':
                mimeType = 'image/svg+xml';
                break;
            case 'png':
                mimeType = 'image/png';
                break;
            case 'jpg':
                mimeType = 'image/jpeg';
                break;
            default:
                mimeType = 'image/jpeg';
        }

        const dataUri = `data:${mimeType};base64,${headerLogo.data}`;
        console.log('🔍 Data URI preview:', dataUri.substring(0, 50) + '...');

        // Create a container with background to ensure logo visibility
        logoElement = React.createElement(View, {
            key: 'logo-container',
            style: {
                ...styles.logo,
                backgroundColor: headerLogo.format === 'svg' ? 'transparent' : '#f8f9fa',
                border: headerLogo.format === 'svg' ? 'none' : '2px solid #22c55e',
                borderRadius: 8,
                padding: headerLogo.format === 'svg' ? 0 : 8,
                alignItems: 'center',
                justifyContent: 'center'
            }
        }, [
            React.createElement(Image, {
                key: 'packedin-logo',
                src: dataUri,
                style: {
                    width: headerLogo.format === 'svg' ? 120 : 100,
                    height: headerLogo.format === 'svg' ? 60 : 40,
                    objectFit: 'contain'
                }
            })
        ]);
        console.log('✅ Packedin logo with container created successfully');
    } else {
        console.log('🔤 Packedin logo not available, using enhanced text logo fallback');
        logoElement = React.createElement(View, {
            key: 'text-logo-container',
            style: {
                width: 120,
                height: 60,
                backgroundColor: '#22c55e',
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 20,
                border: '2px solid #1a9c4a'
            }
        }, [
            React.createElement(Text, {
                key: 'text-logo',
                style: {
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center'
                }
            }, 'PACKEDIN')
        ]);
    }

    const headerSection = React.createElement(View, { style: styles.header }, [
        logoElement,
        React.createElement(View, { key: 'invoice-info', style: styles.invoiceInfo }, [
            React.createElement(Text, { key: 'title', style: styles.invoiceTitle }, 'FACTURE'),
            React.createElement(Text, { key: 'number', style: styles.invoiceNumber }, `N°: ${invoice.invoiceNumber}`),
            React.createElement(Text, { key: 'date', style: styles.invoiceDate },
                `Date: ${new Date(invoice.invoiceDate).toLocaleDateString('fr-FR')}`
            )
        ])
    ].filter(Boolean));

    // Create company info section
    const companyInfoSection = React.createElement(View, { style: styles.companyInfo }, [
        React.createElement(View, { key: 'from', style: styles.fromSection }, [
            React.createElement(Text, { key: 'from-title', style: styles.sectionTitle }, 'Émetteur'),
            React.createElement(Text, { key: 'company', style: { fontWeight: 'bold' } }, 'KINGS WORLDWIDE DISTRIBUTION'),
            React.createElement(Text, { key: 'address1' }, 'B215 Megrine Business Center 2033'),
            React.createElement(Text, { key: 'address2' }, 'Ben Arous - Tunisie'),
            React.createElement(Text, { key: 'mf' }, 'MF: 1586831/T/N/M/000'),
            React.createElement(Text, { key: 'phone' }, 'Tél: +216 50095115 / +216 20387333'),
            React.createElement(Text, { key: 'email' }, 'Email: contact@packedin.tn')
        ]),
        React.createElement(View, { key: 'to', style: styles.toSection }, [
            React.createElement(Text, { key: 'to-title', style: styles.sectionTitle }, 'Client'),
            React.createElement(Text, { key: 'client-name', style: { fontWeight: 'bold' } }, invoice.companyName),
            React.createElement(Text, { key: 'contact' }, invoice.contactPerson),
            React.createElement(Text, { key: 'client-address' }, invoice.address),
            invoice.matriculeFiscale ? React.createElement(Text, { key: 'client-mf' }, `MF: ${invoice.matriculeFiscale}`) : null,
            React.createElement(Text, { key: 'client-phone' }, `Tél: ${invoice.phone}`),
            React.createElement(Text, { key: 'client-email' }, `Email: ${invoice.email}`)
        ].filter(Boolean))
    ]);

    // Create table header
    const tableHeader = React.createElement(View, { style: styles.tableHeader }, [
        React.createElement(Text, { key: 'col1', style: styles.col1 }, 'Description'),
        React.createElement(Text, { key: 'col2', style: styles.col2 }, 'Qté'),
        React.createElement(Text, { key: 'col3', style: styles.col3 }, 'Prix Unitaire'),
        hasDiscount ? React.createElement(Text, { key: 'col4', style: styles.col4 }, 'Remise') : null,
        React.createElement(Text, { key: 'col5', style: styles.col5 }, 'Total')
    ].filter(Boolean));

    // Create table rows
    const tableRows = invoice.items.map((item: any, index: number) =>
        React.createElement(View, {
            key: `item-${index}`,
            style: index % 2 === 1 ? [styles.tableRow, styles.tableRowEven] : styles.tableRow
        }, [
            React.createElement(Text, { key: 'name', style: styles.col1 }, item.productName),
            React.createElement(Text, { key: 'qty', style: styles.col2 }, item.quantity.toString()),
            React.createElement(Text, { key: 'price', style: styles.col3 }, `${item.unitPrice.toFixed(3)} TND`),
            hasDiscount ? React.createElement(Text, { key: 'discount', style: styles.col4 },
                item.discount ? `${item.discount}%` : '0%') : null,
            React.createElement(Text, { key: 'total', style: styles.col5 }, `${item.total.toFixed(2)} TND`)
        ].filter(Boolean))
    );

    // Add printing row if needed
    if (invoice.printing?.includePrinting) {
        tableRows.push(
            React.createElement(View, { key: 'printing', style: styles.tableRow }, [
                React.createElement(Text, { key: 'print-desc', style: styles.col1 },
                    `Impression personnalisée (${invoice.printing.dimensions})`),
                React.createElement(Text, { key: 'print-qty', style: styles.col2 },
                    invoice.printing.quantity.toString()),
                React.createElement(Text, { key: 'print-price', style: styles.col3 },
                    `${invoice.printing.printingPricePerUnit.toFixed(3)} TND`),
                hasDiscount ? React.createElement(Text, { key: 'print-discount', style: styles.col4 }, '0%') : null,
                React.createElement(Text, { key: 'print-total', style: styles.col5 },
                    `${invoice.printing.total.toFixed(2)} TND`)
            ].filter(Boolean))
        );
    }

    // Create table section
    const tableSection = React.createElement(View, { style: styles.table }, [
        tableHeader,
        ...tableRows
    ]);

    // Create totals section
    const totalsRows = [
        React.createElement(View, { key: 'subtotal', style: styles.totalRow }, [
            React.createElement(Text, { key: 'label' }, 'Sous-total:'),
            React.createElement(Text, { key: 'value' }, `${invoice.subtotal.toFixed(2)} TND`)
        ]),
        React.createElement(View, { key: 'delivery', style: [styles.totalRow, styles.totalRowBold] }, [
            React.createElement(Text, { key: 'label' }, 'Livraison:'),
            React.createElement(Text, { key: 'value' }, '8.00 TND')
        ])
    ];

    if (invoice.totalDiscount > 0) {
        totalsRows.push(
            React.createElement(View, { key: 'discount', style: [styles.totalRow, styles.totalRowBold] }, [
                React.createElement(Text, { key: 'label' }, 'Remise:'),
                React.createElement(Text, { key: 'value' }, `${invoice.totalDiscount.toFixed(2)} TND`)
            ])
        );
    }

    totalsRows.push(
        React.createElement(View, { key: 'total', style: [styles.totalRow, styles.grandTotal] }, [
            React.createElement(Text, { key: 'label' }, 'TOTAL TTC:'),
            React.createElement(Text, { key: 'value' }, `${invoice.total.toFixed(2)} TND`)
        ])
    );

    const totalsSection = React.createElement(View, { style: styles.totals }, totalsRows);

    // Note section removed as requested

    // Create footer section with footer logo
    console.log('🎨 Creating footer section, footer logo available:', !!footerLogo.data);

    const footerLogoElement = footerLogo.data ? React.createElement(View, {
        key: 'footer-logo-container',
        style: {
            ...styles.footerLogo,
            backgroundColor: '#f8f9fa',
            border: '1px solid #22c55e',
            borderRadius: 5,
            padding: 3,
            alignItems: 'center',
            justifyContent: 'center'
        }
    }, [
        React.createElement(Image, {
            key: 'footer-logo',
            src: `data:image/jpeg;base64,${footerLogo.data}`,
            style: {
                width: 32,
                height: 32,
                objectFit: 'contain'
            }
        })
    ]) : null;

    const footerSection = React.createElement(View, { style: styles.footer }, [
        React.createElement(View, { key: 'footer-left', style: styles.footerLeft }, [
            footerLogoElement,
            React.createElement(View, { key: 'contact' }, [
                React.createElement(Text, { key: 'phone' }, '+216 50095115 / +216 20387333'),
                React.createElement(Text, { key: 'web' }, 'contact@packedin.tn - www.packedin.tn'),
                React.createElement(Text, { key: 'address' }, 'Jasmin 8050 Nabeul- Tunisia')
            ])
        ].filter(Boolean)),
        React.createElement(View, { key: 'footer-right' }, [
            React.createElement(Text, { key: 'company', style: styles.footerCompany }, 'KINGS WORLDWIDE DISTRIBUTION'),
            React.createElement(Text, { key: 'thanks' }, 'Merci pour votre confiance')
        ])
    ]);

    // Create the complete page
    const page = React.createElement(Page, { size: 'A4', style: styles.page }, [
        headerSection,
        companyInfoSection,
        tableSection,
        totalsSection,
        footerSection
    ]);

    // Create the document
    return React.createElement(Document, {}, [page]);
};

export async function GET(
    _request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🚀 Starting PDF generation with React-PDF...');
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

        console.log('✅ Invoice found:', {
            id: invoice.id,
            number: invoice.invoiceNumber,
            itemsCount: invoice.items.length,
            hasPrinting: !!invoice.printing
        });

        // Load logos
        console.log('📄 Loading logos...');
        const headerLogo = await getLogoBase64();
        const footerLogo = await getFooterLogoBase64();
        console.log('✅ Header logo loaded:', !!headerLogo.data, 'format:', headerLogo.format);
        console.log('✅ Footer logo loaded:', !!footerLogo.data, 'format:', footerLogo.format);

        // Generate PDF using React-PDF (maintains your exact HTML design)
        console.log('📄 Creating React-PDF document...');
        const doc = createInvoiceDocument(invoice, headerLogo, footerLogo);

        console.log('✅ Generating PDF buffer...');
        const pdfBlob = await pdf(doc).toBlob();
        const pdfArrayBuffer = await pdfBlob.arrayBuffer();
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
