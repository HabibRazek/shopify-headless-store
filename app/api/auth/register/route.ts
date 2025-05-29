import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { ZodError } from 'zod';
import { z } from 'zod';

// Simple registration schema without confirmPassword
const registrationSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
});

export async function POST(request: NextRequest) {
  try {
    // Check if we're in build mode (no DATABASE_URL)
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { message: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    // Dynamic imports to avoid build-time issues
    const { prisma } = await import('@/lib/prisma');
    const { createOrUpdateShopifyCustomer } = await import('@/lib/shopifyCustomer');

    const body = await request.json();

    // Validate input with simple schema
    const { name, email, password } = await registrationSchema.parseAsync(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
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
        email: email.toLowerCase(),
        password: hashedPassword,
        shopifyCustomerId: shopifyCustomerId,
        role: 'USER', // Default role
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: userWithoutPassword
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: 'Validation error',
          errors: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
