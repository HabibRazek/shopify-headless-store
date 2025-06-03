import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// API-specific schema (without confirmPassword)
const apiSignUpSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50, { message: 'Name must be less than 50 characters' }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(32, { message: 'Password must be less than 32 characters' }),
})

export async function POST(request: NextRequest) {
  try {
    // Check if database is available
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = apiSignUpSchema.parse(body);
    const { name, email, password } = validatedData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'user',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(
      {
        message: 'User created successfully',
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle Zod validation errors
    if (error && typeof error === 'object' && 'issues' in error) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      return NextResponse.json(
        { error: 'Database error occurred' },
        { status: 500 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
