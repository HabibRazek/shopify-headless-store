import { NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log('🧪 Testing PDF generation...');
        
        // Create a simple test PDF
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(20);
        doc.setTextColor(34, 197, 94);
        doc.text('PDF Test', 20, 30);
        
        // Add some content
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('This is a test PDF to verify jsPDF is working correctly.', 20, 50);
        doc.text(`Generated at: ${new Date().toISOString()}`, 20, 70);
        
        // Test autoTable
        try {
            autoTable(doc, {
                head: [['Column 1', 'Column 2', 'Column 3']],
                body: [
                    ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
                    ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3'],
                ],
                startY: 90,
                theme: 'grid',
                headStyles: {
                    fillColor: [34, 197, 94],
                    textColor: [255, 255, 255],
                },
            });
            console.log('✅ AutoTable test successful');
        } catch (tableError) {
            console.error('❌ AutoTable test failed:', tableError);
            doc.text('AutoTable failed - see console for details', 20, 90);
        }
        
        // Generate PDF buffer
        const pdfArrayBuffer = doc.output('arraybuffer');
        const pdfBuffer = Buffer.from(pdfArrayBuffer);
        
        console.log(`✅ Test PDF generated: ${pdfBuffer.length} bytes`);
        
        // Return PDF
        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Disposition', 'attachment; filename="test.pdf"');
        
        return new Response(pdfBuffer, { headers });
        
    } catch (error) {
        console.error('❌ PDF test failed:', error);
        
        return NextResponse.json({
            error: 'PDF test failed',
            details: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace'
        }, { status: 500 });
    }
}
