import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { sendSingleProductQuoteEmail } from '@/lib/email';

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
    
    const productId = formData.get('productId') as string;
    const quantity = parseInt(formData.get('quantity') as string);
    const basePrice = parseFloat(formData.get('basePrice') as string);
    const discount = parseFloat(formData.get('discount') as string);
    const finalPrice = parseFloat(formData.get('finalPrice') as string);
    const paymentMethod = formData.get('paymentMethod') as string;
    const bankReceipt = formData.get('bankReceipt') as File | null;

    let bankReceiptPath = null;

    // Handle file upload if bank receipt is provided
    if (bankReceipt && bankReceipt.size > 0) {
      const bytes = await bankReceipt.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const timestamp = Date.now();
      const filename = `receipt_${userId}_${timestamp}_${bankReceipt.name}`;
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

    // Create quote request in database
    const quote = await prisma.quote.create({
      data: {
        userId: userId,
        productId,
        quantity,
        basePrice,
        discount,
        finalPrice,
        paymentMethod,
        bankReceiptPath,
        status: 'pending',
        createdAt: new Date(),
      },
    });

    // Send notification email
    try {
      await sendSingleProductQuoteEmail({
        productId,
        productTitle: `Produit ${productId}`, // You might want to fetch actual product title
        quantity,
        basePrice,
        discount,
        finalPrice,
        paymentMethod,
        customer: {
          name: session.user.name || 'Non spécifié',
          email: session.user.email || 'Non spécifié',
          phone: 'Non spécifié'
        },
        quoteId: quote.id.toString()
      });
    } catch {
      // Don't fail the quote creation if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Demande de devis soumise avec succès',
      quoteId: quote.id,
    });
  } catch {
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

    // Fetch user quotes
    const quotes = await prisma.quote.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      quotes,
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
