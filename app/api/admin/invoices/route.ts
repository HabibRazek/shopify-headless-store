import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getPrismaClient } from '@/lib/prisma';
// import { InvoiceStatus } from '@prisma/client';

// Define the enum locally to avoid Prisma client issues
type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET /api/admin/invoices - Get all invoices with filtering and pagination
export async function GET(request: NextRequest) {
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

    const prisma = getPrismaClient();
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { contactPerson: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    // Fetch invoices with pagination
    const [invoices, totalCount] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          items: true,
          printing: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    return NextResponse.json({
      invoices,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        invoices: [] // Return empty array as fallback
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/invoices - Create a new invoice
export async function POST(request: NextRequest) {
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

    // Initialize Prisma client with comprehensive error handling
    let prisma;
    try {
      console.log('Attempting to get Prisma client...');
      prisma = getPrismaClient();
      console.log('Prisma client obtained:', !!prisma);

      if (!prisma) {
        throw new Error('Prisma client is null or undefined');
      }

      // Verify the client has the expected methods
      if (!prisma.invoice || typeof prisma.invoice.findUnique !== 'function') {
        throw new Error('Prisma client is missing invoice methods');
      }

      console.log('Testing database connection...');
      await prisma.$connect();
      console.log('Database connection successful');

    } catch (dbError) {
      console.error('Database initialization error:', dbError);
      return NextResponse.json(
        {
          error: 'Database initialization failed',
          details: dbError instanceof Error ? dbError.message : 'Unknown database error'
        },
        { status: 503 }
      );
    }
    const body = await request.json();

    // Log the received data for debugging
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
    console.log('Checking for existing invoice with number:', invoiceNumber);

    // Additional safety check
    if (!prisma || !prisma.invoice) {
      throw new Error('Prisma client or invoice model is undefined');
    }

    const existingInvoice = await prisma.invoice.findUnique({
      where: { invoiceNumber },
    });

    console.log('Existing invoice check result:', !!existingInvoice);

    if (existingInvoice) {
      return NextResponse.json(
        { error: 'Invoice number already exists' },
        { status: 400 }
      );
    }

    // Create invoice first
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
        subtotal: subtotal || 0,
        totalDiscount: totalDiscount || 0,
        printingCosts: printingCosts || 0,
        total: total || 0,
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
    let printingRecord = null;
    if (doypacks?.includePrinting) {
      console.log('Creating printing record');
      printingRecord = await prisma.invoicePrinting.create({
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

    return NextResponse.json({
      success: true,
      invoice,
      message: 'Invoice created successfully',
    });

  } catch (error) {
    console.error('Error creating invoice:', error);

    // More detailed error logging
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
  }
}
