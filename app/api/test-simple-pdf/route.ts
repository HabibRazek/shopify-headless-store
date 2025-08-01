import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { Document, Page, Text, View, pdf, StyleSheet } from '@react-pdf/renderer';

// Simple styles for testing
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 30,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        color: '#22c55e',
    },
    text: {
        fontSize: 12,
        marginBottom: 10,
    },
});

// Simple test document
const createTestDocument = () => {
    const page = React.createElement(Page, { size: 'A4', style: styles.page }, [
        React.createElement(Text, { key: 'title', style: styles.title }, 'PACKEDIN - Test PDF'),
        React.createElement(Text, { key: 'text1', style: styles.text }, 'This is a simple test PDF to verify React-PDF is working.'),
        React.createElement(Text, { key: 'text2', style: styles.text }, 'If you can see this, the basic PDF generation is functional.'),
        React.createElement(View, { key: 'spacer', style: { height: 20 } }),
        React.createElement(Text, { key: 'text3', style: styles.text }, 'Company: KINGS WORLDWIDE DISTRIBUTION'),
        React.createElement(Text, { key: 'text4', style: styles.text }, 'Email: contact@packedin.tn'),
        React.createElement(Text, { key: 'text5', style: styles.text }, 'Phone: +216 50095115 / +216 20387333'),
    ]);

    return React.createElement(Document, {}, [page]);
};

export async function GET() {
    try {
        console.log('🧪 Testing simple PDF generation...');
        
        const doc = createTestDocument();
        console.log('✅ Simple document created');
        
        const pdfBlob = await pdf(doc).toBlob();
        const pdfArrayBuffer = await pdfBlob.arrayBuffer();
        const pdfBuffer = Buffer.from(pdfArrayBuffer);
        console.log(`✅ Simple PDF generated: ${pdfBuffer.length} bytes`);

        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Disposition', 'attachment; filename="test-simple.pdf"');
        headers.set('Content-Length', pdfBuffer.length.toString());

        return new Response(pdfBuffer, { headers });

    } catch (error) {
        console.error('❌ Simple PDF test failed:', error);
        return NextResponse.json({
            error: 'Simple PDF test failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
