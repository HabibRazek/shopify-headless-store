import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// POST /api/admin/invoices/simple - Create a new invoice (simplified version)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Log the received data for debugging
    console.log('Received invoice data (simple):', JSON.stringify(body, null, 2));
    
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

    if (!companyName || !matriculeFiscale || !contactPerson || !email || !phone || !address) {
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

    // For now, just return success without actually saving to database
    // This allows us to test the form submission flow
    const mockInvoice = {
      id: `mock-${Date.now()}`,
      invoiceNumber,
      companyName,
      matriculeFiscale,
      contactPerson,
      email,
      phone,
      address,
      invoiceDate,
      dueDate,
      status: status.toUpperCase(),
      subtotal: subtotal || 0,
      totalDiscount: totalDiscount || 0,
      printingCosts: printingCosts || 0,
      total: total || 0,
      items: items || [],
      doypacks: doypacks || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Mock invoice created:', mockInvoice);

    return NextResponse.json({
      success: true,
      invoice: mockInvoice,
      message: 'Invoice created successfully (mock mode)',
    });

  } catch (error) {
    console.error('Error creating invoice (simple):', error);
    
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
