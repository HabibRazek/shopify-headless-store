import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// POST /api/admin/invoices/test-create - Test invoice creation with direct database access
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

    const body = await request.json();
    console.log('Test create - received data:', JSON.stringify(body, null, 2));

    // Try to import Prisma dynamically
    let prisma;
    try {
      const { getPrismaClient } = await import('@/lib/prisma');
      prisma = getPrismaClient();
      console.log('✅ Prisma client loaded successfully');
    } catch (prismaError) {
      console.error('❌ Failed to load Prisma client:', prismaError);
      return NextResponse.json(
        { 
          error: 'Database client error',
          details: prismaError instanceof Error ? prismaError.message : 'Unknown Prisma error'
        },
        { status: 503 }
      );
    }

    // Test database connection
    try {
      await prisma.$connect();
      console.log('✅ Database connected successfully');
    } catch (connectionError) {
      console.error('❌ Database connection failed:', connectionError);
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: connectionError instanceof Error ? connectionError.message : 'Unknown connection error'
        },
        { status: 503 }
      );
    }

    // Extract data from request
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
      subtotal = 0,
      totalDiscount = 0,
      printingCosts = 0,
      total = 0,
    } = body;

    console.log('Creating invoice with data:', {
      invoiceNumber,
      companyName,
      matriculeFiscale,
      status,
      total
    });

    // Create the invoice
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

    console.log('✅ Invoice created successfully:', newInvoice.id);

    // Verify the invoice was saved
    const savedInvoice = await prisma.invoice.findUnique({
      where: { id: newInvoice.id },
    });

    if (!savedInvoice) {
      throw new Error('Invoice was created but could not be retrieved');
    }

    console.log('✅ Invoice verified in database');

    return NextResponse.json({
      success: true,
      invoice: savedInvoice,
      message: 'Test invoice created successfully',
    });

  } catch (error) {
    console.error('❌ Test create error:', error);
    
    return NextResponse.json(
      { 
        error: 'Test creation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
