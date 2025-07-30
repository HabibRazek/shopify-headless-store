import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getPrismaClient } from '@/lib/prisma';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET /api/admin/invoices/prisma-test - Test Prisma client functionality
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting Prisma client test...');
    
    // Test 1: Get Prisma client
    let prisma;
    try {
      prisma = getPrismaClient();
      console.log('✅ Prisma client obtained');
    } catch (error) {
      console.error('❌ Failed to get Prisma client:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to get Prisma client',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 2: Check if client is valid
    if (!prisma) {
      return NextResponse.json({
        success: false,
        error: 'Prisma client is null or undefined'
      });
    }

    // Test 3: Check if invoice model exists
    if (!prisma.invoice) {
      return NextResponse.json({
        success: false,
        error: 'Invoice model not found on Prisma client'
      });
    }

    // Test 4: Check if findUnique method exists
    if (typeof prisma.invoice.findUnique !== 'function') {
      return NextResponse.json({
        success: false,
        error: 'findUnique method not found on invoice model'
      });
    }

    // Test 5: Test database connection
    try {
      await prisma.$connect();
      console.log('✅ Database connection successful');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 6: Test a simple query
    try {
      const count = await prisma.invoice.count();
      console.log('✅ Invoice count query successful:', count);
      
      return NextResponse.json({
        success: true,
        message: 'All Prisma tests passed',
        tests: {
          clientObtained: true,
          clientValid: true,
          invoiceModelExists: true,
          findUniqueExists: true,
          databaseConnected: true,
          querySuccessful: true,
          invoiceCount: count
        }
      });
      
    } catch (error) {
      console.error('❌ Query failed:', error);
      return NextResponse.json({
        success: false,
        error: 'Database query failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

  } catch (error) {
    console.error('❌ Prisma test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Prisma test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
