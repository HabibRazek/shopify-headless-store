import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

// Extend jsPDF type for autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  companyName: string;
  matriculeFiscale?: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  invoiceDate: string;
  dueDate: string;
  status: string;
  subtotal: number;
  totalDiscount: number;
  printingCosts: number;
  total: number;
  currency: string;
  items: Array<{
    id: string;
    productId?: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    total: number;
  }>;
  printing?: {
    id: string;
    includePrinting: boolean;
    dimensions: string;
    printingPricePerUnit: number;
    quantity: number;
    total: number;
  };
}

// Create a professional PDF invoice
export const generateInvoicePDF = async (invoice: InvoiceData): Promise<void> => {
  try {
    console.log('Starting PDF generation for invoice:', invoice.invoiceNumber);

    // Create PDF instance
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    let currentY = 20;

    // Colors
    const primaryGreen = [34, 197, 94];
    const darkGray = [55, 65, 81];
    const lightGray = [156, 163, 175];

    // Helper function to add text with automatic line breaks
    const addText = (text: string, x: number, y: number, maxWidth?: number) => {
      if (maxWidth) {
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y);
        return y + (lines.length * 5);
      } else {
        pdf.text(text, x, y);
        return y + 5;
      }
    };
    
    // === HEADER SECTION ===
    // Company Header Background
    pdf.setFillColor(248, 250, 252);
    pdf.rect(0, 0, pageWidth, 50, 'F');

    // Company Logo/Name
    pdf.setFontSize(32);
    pdf.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PACKEDIN', 20, 25);

    // Company Tagline
    pdf.setFontSize(12);
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Solutions d\'emballage innovantes', 20, 33);

    // Contact Information
    pdf.setFontSize(9);
    pdf.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    pdf.text('📧 packedin.tn@gmail.com  📞 29 362 224  📱 WhatsApp: 20 387 333 / 50 095 115', 20, 42);
    
    // Invoice Information Box
    pdf.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
    pdf.roundedRect(pageWidth - 75, 10, 65, 35, 3, 3, 'F');

    // Invoice Title
    pdf.setFontSize(20);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.text('FACTURE', pageWidth - 65, 22);

    // Invoice Details
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`N° ${invoice.invoiceNumber}`, pageWidth - 72, 30);
    pdf.text(`Date: ${new Date(invoice.invoiceDate).toLocaleDateString('fr-FR')}`, pageWidth - 72, 37);

    currentY = 55;
    
    // Status Badge
    const statusColors = {
      'DRAFT': [156, 163, 175],
      'SENT': [59, 130, 246],
      'PAID': [34, 197, 94],
      'OVERDUE': [239, 68, 68],
      'CANCELLED': [107, 114, 128]
    };
    const statusColor = statusColors[invoice.status as keyof typeof statusColors] || [156, 163, 175];
    pdf.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    pdf.roundedRect(pageWidth - 72, 47, 30, 8, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.text(invoice.status, pageWidth - 67, 53);

    // Due Date
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    pdf.setFontSize(10);
    pdf.text(`Échéance: ${new Date(invoice.dueDate).toLocaleDateString('fr-FR')}`, pageWidth - 72, 65);

    currentY = 75;
    
    // === CLIENT INFORMATION SECTION ===
    // Section Title
    pdf.setFontSize(16);
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    pdf.setFont('helvetica', 'bold');
    pdf.text('FACTURÉ À:', 20, currentY);
    currentY += 10;

    // Client Info Box
    pdf.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
    pdf.setLineWidth(0.5);
    pdf.rect(20, currentY, pageWidth - 40, 35);

    // Company Name
    pdf.setFontSize(14);
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    pdf.setFont('helvetica', 'bold');
    currentY = addText(invoice.companyName, 25, currentY + 8);

    // Fiscal Number
    if (invoice.matriculeFiscale) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
      currentY = addText(`Matricule Fiscale: ${invoice.matriculeFiscale}`, 25, currentY + 2);
    }

    // Contact Information
    pdf.setFontSize(11);
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    currentY = addText(`Contact: ${invoice.contactPerson}`, 25, currentY + 3);
    currentY = addText(`Email: ${invoice.email}`, 25, currentY + 2);
    currentY = addText(`Téléphone: ${invoice.phone}`, 25, currentY + 2);

    // Address
    currentY = addText(`Adresse: ${invoice.address}`, 25, currentY + 2, pageWidth - 50);

    currentY += 15;
    
    // === PRODUCTS TABLE ===
    // Section Title
    pdf.setFontSize(16);
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ARTICLES DE LA FACTURE', 20, currentY);
    currentY += 10;

    // Prepare table data
    const tableData = invoice.items.map(item => [
      item.productName,
      item.quantity.toString(),
      `${item.unitPrice.toFixed(2)} TND`,
      `${item.discount}%`,
      `${item.total.toFixed(2)} TND`
    ]);

    // Create professional table
    pdf.autoTable({
      startY: currentY,
      head: [['Produit', 'Quantité', 'Prix Unitaire', 'Remise', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: primaryGreen,
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 10,
        textColor: darkGray
      },
      columnStyles: {
        0: { cellWidth: 70, halign: 'left' },   // Product name
        1: { cellWidth: 25, halign: 'center' }, // Quantity
        2: { cellWidth: 35, halign: 'right' },  // Unit price
        3: { cellWidth: 25, halign: 'center' }, // Discount
        4: { cellWidth: 35, halign: 'right' }   // Total
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      margin: { left: 20, right: 20 }
    });

    currentY = pdf.lastAutoTable.finalY + 10;
    
    // === PRINTING SECTION (if applicable) ===
    if (invoice.printing?.includePrinting) {
      pdf.setFontSize(14);
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.setFont('helvetica', 'bold');
      pdf.text('IMPRESSION PERSONNALISÉE', 20, currentY);
      currentY += 8;

      // Printing details box
      pdf.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
      pdf.rect(20, currentY, pageWidth - 40, 25);

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);

      currentY = addText(`Dimensions: ${invoice.printing.dimensions}`, 25, currentY + 6);
      currentY = addText(`Quantité: ${invoice.printing.quantity}`, 25, currentY + 2);
      currentY = addText(`Prix par unité: ${invoice.printing.printingPricePerUnit.toFixed(2)} TND`, 25, currentY + 2);

      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
      currentY = addText(`Total impression: ${invoice.printing.total.toFixed(2)} TND`, 25, currentY + 3);

      currentY += 15;
    }
    
    // === TOTALS SECTION ===
    const totalsStartX = pageWidth - 90;
    const totalsWidth = 70;

    // Totals background
    pdf.setFillColor(248, 250, 252);
    pdf.rect(totalsStartX, currentY, totalsWidth, 50, 'F');
    pdf.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
    pdf.rect(totalsStartX, currentY, totalsWidth, 50);

    currentY += 8;

    // Subtotal
    pdf.setFontSize(11);
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Sous-total:', totalsStartX + 5, currentY);
    pdf.text(`${invoice.subtotal.toFixed(2)} TND`, pageWidth - 25, currentY, { align: 'right' });
    currentY += 7;

    // Discount (if any)
    if (invoice.totalDiscount > 0) {
      pdf.setTextColor(239, 68, 68);
      pdf.text('Remise totale:', totalsStartX + 5, currentY);
      pdf.text(`-${invoice.totalDiscount.toFixed(2)} TND`, pageWidth - 25, currentY, { align: 'right' });
      currentY += 7;
    }

    // Printing costs (if any)
    if (invoice.printingCosts > 0) {
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.text('Impression:', totalsStartX + 5, currentY);
      pdf.text(`${invoice.printingCosts.toFixed(2)} TND`, pageWidth - 25, currentY, { align: 'right' });
      currentY += 7;
    }

    // Separator line
    pdf.setDrawColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
    pdf.setLineWidth(1);
    pdf.line(totalsStartX + 5, currentY + 2, pageWidth - 25, currentY + 2);
    currentY += 10;

    // Final Total
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
    pdf.text('TOTAL TTC:', totalsStartX + 5, currentY);
    pdf.text(`${invoice.total.toFixed(2)} TND`, pageWidth - 25, currentY, { align: 'right' });

    currentY += 20;
    
    // === FOOTER SECTION ===
    const footerY = 270; // Fixed position for footer

    // Footer separator line
    pdf.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
    pdf.setLineWidth(0.5);
    pdf.line(20, footerY - 5, pageWidth - 20, footerY - 5);

    // Thank you message
    pdf.setFontSize(12);
    pdf.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Merci pour votre confiance !', 20, footerY);

    // Company info
    pdf.setFontSize(9);
    pdf.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    pdf.setFont('helvetica', 'normal');
    pdf.text('PACKEDIN - Solutions d\'emballage innovantes', 20, footerY + 8);
    pdf.text('Votre partenaire pour tous vos besoins d\'emballage personnalisé', 20, footerY + 14);

    // Generation timestamp
    const now = new Date();
    const timestamp = `Généré le ${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR')}`;
    pdf.text(timestamp, pageWidth - 20, footerY + 14, { align: 'right' });

    // === SAVE PDF ===
    try {
      // Validate PDF
      const pdfOutput = pdf.output('blob');
      console.log('PDF generated successfully. Size:', pdfOutput.size, 'bytes');

      if (pdfOutput.size === 0) {
        throw new Error('PDF generation failed - empty file');
      }

      // Create clean filename
      const cleanCompanyName = invoice.companyName
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 20); // Limit length

      const cleanInvoiceNumber = invoice.invoiceNumber.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `Facture_${cleanInvoiceNumber}_${cleanCompanyName}.pdf`;

      console.log('Saving PDF with filename:', fileName);

      // Save the PDF
      pdf.save(fileName);

      console.log('✅ PDF generation completed successfully');

    } catch (saveError) {
      console.error('Error saving PDF:', saveError);
      throw new Error('Erreur lors de la sauvegarde du PDF');
    }

  } catch (error) {
    console.error('❌ Error generating PDF:', error);

    // Try fallback simple PDF generation
    try {
      console.log('🔄 Attempting fallback PDF generation...');
      await generateSimplePDF(invoice);
    } catch (fallbackError) {
      console.error('❌ Fallback PDF generation also failed:', fallbackError);
      throw new Error(`Erreur lors de la génération du PDF: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }
};

// Fallback simple PDF generator
const generateSimplePDF = async (invoice: InvoiceData): Promise<void> => {
  const pdf = new jsPDF();

  // Simple header
  pdf.setFontSize(20);
  pdf.text('PACKEDIN - FACTURE', 20, 20);

  // Invoice info
  pdf.setFontSize(12);
  pdf.text(`Facture N°: ${invoice.invoiceNumber}`, 20, 40);
  pdf.text(`Date: ${new Date(invoice.invoiceDate).toLocaleDateString('fr-FR')}`, 20, 50);

  // Client info
  pdf.text(`Client: ${invoice.companyName}`, 20, 70);
  pdf.text(`Contact: ${invoice.contactPerson}`, 20, 80);
  pdf.text(`Email: ${invoice.email}`, 20, 90);

  // Items
  let y = 110;
  pdf.text('Articles:', 20, y);
  y += 10;

  invoice.items.forEach((item, index) => {
    pdf.text(`${index + 1}. ${item.productName} - Qté: ${item.quantity} - Prix: ${item.unitPrice} TND - Total: ${item.total} TND`, 20, y);
    y += 10;
  });

  // Total
  y += 10;
  pdf.setFontSize(14);
  pdf.text(`TOTAL: ${invoice.total.toFixed(2)} TND`, 20, y);

  // Save
  const fileName = `Facture_${invoice.invoiceNumber.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  pdf.save(fileName);

  console.log('✅ Fallback PDF generated successfully');
};

// Alternative method using HTML to Canvas (for more complex layouts)
export const generateInvoicePDFFromHTML = async (elementId: string, fileName: string): Promise<void> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF from HTML:', error);
    throw new Error('Erreur lors de la génération du PDF');
  }
};
