import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Check if we're in build time or missing database
    if (!process.env.DATABASE_URL || process.env.SKIP_ENV_VALIDATION === '1') {
      return NextResponse.json(
        { error: 'Service non disponible' },
        { status: 503 }
      );
    }

    // Dynamic import to avoid build-time issues
    const { default: prisma } = await import('@/lib/prisma');

    const userId = session.user.id;

    const formData = await request.formData();
    
    const itemsJson = formData.get('items') as string;
    const totalQuantity = parseInt(formData.get('totalQuantity') as string);
    const subtotal = parseFloat(formData.get('subtotal') as string);
    const discount = parseFloat(formData.get('discount') as string);
    const total = parseFloat(formData.get('total') as string);
    const paymentMethod = formData.get('paymentMethod') as string;
    const bankReceipt = formData.get('bankReceipt') as File | null;

    let bankReceiptPath = null;

    // Handle file upload if bank receipt is provided
    if (bankReceipt && bankReceipt.size > 0) {
      const bytes = await bankReceipt.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const timestamp = Date.now();
      const filename = `bulk_receipt_${userId}_${timestamp}_${bankReceipt.name}`;
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'receipts');
      
      // Ensure directory exists
      try {
        await writeFile(join(uploadDir, filename), buffer);
        bankReceiptPath = `/uploads/receipts/${filename}`;
      } catch (error) {
        console.error('Error saving file:', error);
        // Continue without file if upload fails
      }
    }

    // Create bulk quote request in database using BulkQuote model
    const bulkQuote = await prisma.bulkQuote.create({
      data: {
        userId: userId,
        items: itemsJson, // Store as JSON string
        totalQuantity,
        subtotal,
        discount,
        total,
        paymentMethod,
        bankReceiptPath,
        status: 'pending',
      },
    });

    // Send notification email (you can implement this later)
    // await sendBulkQuoteNotificationEmail(user, quote, items);

    return NextResponse.json({
      success: true,
      message: 'Demande de devis groupé soumise avec succès',
      quoteId: bulkQuote.id,
    });
  } catch (error) {
    console.error('Error creating bulk quote request:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Check if we're in build time or missing database
    if (!process.env.DATABASE_URL || process.env.SKIP_ENV_VALIDATION === '1') {
      return NextResponse.json(
        { error: 'Service non disponible' },
        { status: 503 }
      );
    }

    // Dynamic import to avoid build-time issues
    const { default: prisma } = await import('@/lib/prisma');

    const userId = session.user.id;

    // Fetch user bulk quotes
    const bulkQuotes = await prisma.bulkQuote.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Parse items JSON for each quote
    const quotesWithParsedItems = bulkQuotes.map((quote: any) => ({
      ...quote,
      items: JSON.parse(quote.items),
    }));

    return NextResponse.json({
      success: true,
      quotes: quotesWithParsedItems,
    });
  } catch (error) {
    console.error('Error fetching bulk quotes:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
