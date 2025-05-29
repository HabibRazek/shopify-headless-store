import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Check if we're in build time or missing database
    if (!process.env.DATABASE_URL || process.env.SKIP_ENV_VALIDATION === '1') {
      return NextResponse.json(
        { message: 'Registration not available during build' },
        { status: 503 }
      );
    }

    // Dynamic imports to avoid build-time issues
    const { default: prisma } = await import('@/lib/prisma');
    const { hash } = await import('bcrypt');
    const { createOrUpdateShopifyCustomer } = await import('@/lib/shopifyCustomer');

    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create Shopify customer
    let shopifyCustomerId = null;
    try {
      // Split name into first and last name
      const nameParts = name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      const shopifyCustomer = await createOrUpdateShopifyCustomer({
        email,
        firstName,
        lastName
      });

      if (shopifyCustomer && shopifyCustomer.id) {
        shopifyCustomerId = shopifyCustomer.id;
        console.log('Created Shopify customer:', shopifyCustomerId);
      }
    } catch (shopifyError) {
      // Log the error but continue with user creation
      console.error('Error creating Shopify customer:', shopifyError);
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        shopifyCustomerId: shopifyCustomerId
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: 'User created successfully', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
