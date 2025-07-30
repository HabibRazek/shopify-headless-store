import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// POST /api/admin/invoices/direct - Create invoice with direct Prisma client
export async function POST(request: NextRequest) {
  let prisma: PrismaClient | null = null;
  
  try {
    const session = await auth();
    
    if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if database is available
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    // Create a fresh Prisma client instance
    console.log('Creating fresh Prisma client...');
    prisma = new PrismaClient({
      log: ['error', 'warn'],
    });
    
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('Database connected successfully');

    const body = await request.json();
    console.log('Received invoice data:', JSON.stringify(body, null, 2));
    
    // Validate required fields
    const {
      companyName,
      matriculeFiscale,
      contactPerson,
      email,
      phone,
      address,
      invoiceNumber,
      invoiceDate,
      dueDate,
      status = 'DRAFT',
      items = [],
      doypacks,
      subtotal,
      totalDiscount,
      printingCosts,
      total,
    } = body;

    if (!companyName || !contactPerson || !email || !phone || !address) {
      return NextResponse.json(
        { error: 'Missing required company information' },
        { status: 400 }
      );
    }

    if (!invoiceNumber || !invoiceDate || !dueDate) {
      return NextResponse.json(
        { error: 'Missing required invoice details' },
        { status: 400 }
      );
    }

    // Check if invoice number already exists
    console.log('Checking for existing invoice...');
    const existingInvoice = await prisma.invoice.findUnique({
      where: { invoiceNumber },
    });

    if (existingInvoice) {
      return NextResponse.json(
        { error: 'Invoice number already exists' },
        { status: 400 }
      );
    }

    // Create invoice
    console.log('Creating new invoice...');
    const newInvoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        companyName,
        matriculeFiscale: matriculeFiscale || null,
        contactPerson,
        email,
        phone,
        address,
        invoiceDate: new Date(invoiceDate),
        dueDate: new Date(dueDate),
        status: status.toUpperCase(),
        subtotal: Number(subtotal) || 0,
        totalDiscount: Number(totalDiscount) || 0,
        printingCosts: Number(printingCosts) || 0,
        total: Number(total) || 0,
      },
    });

    console.log('Invoice created with ID:', newInvoice.id);

    // Create invoice items if any
    if (items && items.length > 0) {
      console.log('Creating invoice items:', items.length);
      const createdItems = await prisma.invoiceItem.createMany({
        data: items.map((item: any) => ({
          invoiceId: newInvoice.id,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount || 0,
          total: item.total || 0,
        })),
      });
      console.log('Created items:', createdItems.count);
    }

    // Create printing record if needed
    if (doypacks?.includePrinting) {
      console.log('Creating printing record');
      const printingRecord = await prisma.invoicePrinting.create({
        data: {
          invoiceId: newInvoice.id,
          includePrinting: doypacks.includePrinting,
          dimensions: doypacks.dimensions || '',
          printingPricePerUnit: doypacks.printingPricePerUnit || 0,
          quantity: doypacks.quantity || 0,
          total: doypacks.total || 0,
        },
      });
      console.log('Created printing record:', printingRecord.id);
    }

    // Fetch the complete invoice with relations
    const invoice = await prisma.invoice.findUnique({
      where: { id: newInvoice.id },
      include: {
        items: true,
        printing: true,
      },
    });

    console.log('Invoice creation completed successfully');

    return NextResponse.json({
      success: true,
      invoice,
      message: 'Invoice created successfully',
    });

  } catch (error) {
    console.error('Error creating invoice (direct):', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    // Always disconnect the Prisma client
    if (prisma) {
      try {
        await prisma.$disconnect();
        console.log('Prisma client disconnected');
      } catch (disconnectError) {
        console.error('Error disconnecting Prisma client:', disconnectError);
      }
    }
  }
}
