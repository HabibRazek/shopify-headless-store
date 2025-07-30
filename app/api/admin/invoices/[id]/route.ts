import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getPrismaClient } from '@/lib/prisma';
import { InvoiceStatus } from '@prisma/client';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET /api/admin/invoices/[id] - Get a specific invoice
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        items: true,
        printing: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ invoice });

  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/invoices/[id] - Update a specific invoice
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const body = await request.json();
    
    // Check if invoice exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        items: true,
        printing: true,
      },
    });

    if (!existingInvoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

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
      status,
      items = [],
      doypacks,
      subtotal,
      totalDiscount,
      printingCosts,
      total,
    } = body;

    // If invoice number is being changed, check for duplicates
    if (invoiceNumber && invoiceNumber !== existingInvoice.invoiceNumber) {
      const duplicateInvoice = await prisma.invoice.findUnique({
        where: { invoiceNumber },
      });

      if (duplicateInvoice) {
        return NextResponse.json(
          { error: 'Invoice number already exists' },
          { status: 400 }
        );
      }
    }

    // Update invoice with transaction to ensure data consistency
    const updatedInvoice = await prisma.$transaction(async (tx) => {
      // Delete existing items and printing
      await tx.invoiceItem.deleteMany({
        where: { invoiceId: params.id },
      });

      if (existingInvoice.printing) {
        await tx.invoicePrinting.delete({
          where: { invoiceId: params.id },
        });
      }

      // Update the invoice
      return await tx.invoice.update({
        where: { id: params.id },
        data: {
          ...(companyName && { companyName }),
          ...(matriculeFiscale && { matriculeFiscale }),
          ...(contactPerson && { contactPerson }),
          ...(email && { email }),
          ...(phone && { phone }),
          ...(address && { address }),
          ...(invoiceNumber && { invoiceNumber }),
          ...(invoiceDate && { invoiceDate: new Date(invoiceDate) }),
          ...(dueDate && { dueDate: new Date(dueDate) }),
          ...(status && { status: status.toUpperCase() as InvoiceStatus }),
          ...(subtotal !== undefined && { subtotal }),
          ...(totalDiscount !== undefined && { totalDiscount }),
          ...(printingCosts !== undefined && { printingCosts }),
          ...(total !== undefined && { total }),
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              productName: item.productName,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discount: item.discount || 0,
              total: item.total || 0,
            })),
          },
          ...(doypacks?.includePrinting && {
            printing: {
              create: {
                includePrinting: doypacks.includePrinting,
                dimensions: doypacks.dimensions || '',
                printingPricePerUnit: doypacks.printingPricePerUnit || 0,
                quantity: doypacks.quantity || 0,
                total: doypacks.total || 0,
              },
            },
          }),
        },
        include: {
          items: true,
          printing: true,
        },
      });
    });

    return NextResponse.json({
      success: true,
      invoice: updatedInvoice,
      message: 'Invoice updated successfully',
    });

  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/invoices/[id] - Delete a specific invoice
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Check if invoice exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id: params.id },
    });

    if (!existingInvoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Delete the invoice (cascade will handle related items and printing)
    await prisma.invoice.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Invoice deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
