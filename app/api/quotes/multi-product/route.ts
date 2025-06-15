import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface QuoteProduct {
  id: string;
  title: string;
  price: number;
  quantity: number;
  currency: string;
}

interface QuoteRequest {
  products: QuoteProduct[];
  totalQuantity: number;
  subtotal: number;
  discount: number;
  discountAmount: number;
  total: number;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const quoteData: QuoteRequest = await request.json();

    // Validate the quote data
    if (!quoteData.products || quoteData.products.length === 0) {
      return NextResponse.json(
        { error: 'At least one product is required' },
        { status: 400 }
      );
    }

    // Calculate discount tiers (same as frontend)
    const DISCOUNT_TIERS = [
      { min: 11, max: 20, discount: 5 },
      { min: 21, max: 99, discount: 10 },
      { min: 100, max: Infinity, discount: 15 },
    ];

    // Verify calculations
    const calculatedSubtotal = quoteData.products.reduce(
      (sum, product) => sum + (product.price * product.quantity), 
      0
    );
    
    const calculatedQuantity = quoteData.products.reduce(
      (sum, product) => sum + product.quantity, 
      0
    );

    let expectedDiscount = 0;
    for (const tier of DISCOUNT_TIERS) {
      if (calculatedQuantity >= tier.min && calculatedQuantity <= tier.max) {
        expectedDiscount = tier.discount;
        break;
      }
    }

    const expectedDiscountAmount = (calculatedSubtotal * expectedDiscount) / 100;
    const expectedTotal = calculatedSubtotal - expectedDiscountAmount;

    // Validate calculations (with small tolerance for floating point)
    const tolerance = 0.01;
    if (
      Math.abs(calculatedSubtotal - quoteData.subtotal) > tolerance ||
      Math.abs(calculatedQuantity - quoteData.totalQuantity) > tolerance ||
      Math.abs(expectedDiscount - quoteData.discount) > tolerance ||
      Math.abs(expectedTotal - quoteData.total) > tolerance
    ) {
      return NextResponse.json(
        { error: 'Invalid calculations detected' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notifications
    // 3. Generate quote PDF
    // 4. Create quote reference number

    // For now, we'll simulate a successful quote creation
    const quoteId = `QUOTE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Log the quote for debugging (in production, save to database)
    console.log('Multi-product quote created:', {
      quoteId,
      userId: session.user.id,
      userEmail: session.user.email,
      products: quoteData.products,
      totals: {
        quantity: calculatedQuantity,
        subtotal: calculatedSubtotal,
        discount: expectedDiscount,
        discountAmount: expectedDiscountAmount,
        total: expectedTotal,
      },
      timestamp: new Date().toISOString(),
    });

    // In a real implementation, you might:
    // - Save to Prisma database
    // - Send email to customer and admin
    // - Generate PDF quote
    // - Integrate with CRM system

    return NextResponse.json({
      success: true,
      message: 'Demande de devis multi-produits créée avec succès',
      quoteId,
      data: {
        quoteId,
        products: quoteData.products,
        totals: {
          quantity: calculatedQuantity,
          subtotal: calculatedSubtotal,
          discount: expectedDiscount,
          discountAmount: expectedDiscountAmount,
          total: expectedTotal,
        },
        estimatedDelivery: '2-3 jours ouvrables',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      },
    });

  } catch (error) {
    console.error('Error creating multi-product quote:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve quote by ID (optional)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const quoteId = searchParams.get('quoteId');

    if (!quoteId) {
      return NextResponse.json(
        { error: 'Quote ID is required' },
        { status: 400 }
      );
    }

    // In a real implementation, you would fetch from database
    // For now, return a placeholder response
    return NextResponse.json({
      success: true,
      message: 'Quote retrieved successfully',
      data: {
        quoteId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        // ... other quote data
      },
    });

  } catch (error) {
    console.error('Error retrieving quote:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
