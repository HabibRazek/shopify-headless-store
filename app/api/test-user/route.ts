import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    // Check if database is available
    if (!process.env.DATABASE_URL || process.env.SKIP_ENV_VALIDATION === '1') {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    // Dynamic import to avoid build-time issues
    const { default: prisma } = await import('@/lib/prisma');

    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || 'Test User',
        role: 'user',
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Error creating test user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
