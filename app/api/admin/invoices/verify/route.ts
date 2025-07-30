import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getPrismaClient } from '@/lib/prisma';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET /api/admin/invoices/verify - Verify invoice data in database
export async function GET() {
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
    
    // Get invoice counts
    const invoiceCount = await prisma.invoice.count();
    const itemCount = await prisma.invoiceItem.count();
    const printingCount = await prisma.invoicePrinting.count();
    
    // Get latest invoices
    const latestInvoices = await prisma.invoice.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        printing: true,
      },
    });

    return NextResponse.json({
      success: true,
      counts: {
        invoices: invoiceCount,
        items: itemCount,
        printing: printingCount,
      },
      latestInvoices,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error verifying invoices:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
