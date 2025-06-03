import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Dynamic import to avoid build-time issues
    const { default: prisma } = await import('@/lib/prisma');

    console.log('🔍 Checking if user exists:', session.user.id);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (existingUser) {
      console.log('✅ User already exists in database');
      return NextResponse.json({
        success: true,
        message: 'User already exists',
        user: existingUser
      });
    }

    console.log('👤 Creating/updating user in database:', session.user.id);

    // First try to find user by email to handle existing users
    const userEmail = session.user.email || `user-${session.user.id}@example.com`;

    try {
      // Try to find existing user by email
      const existingUserByEmail = await prisma.user.findUnique({
        where: { email: userEmail }
      });

      if (existingUserByEmail) {
        // Update existing user with new ID if needed
        const updatedUser = await prisma.user.update({
          where: { email: userEmail },
          data: {
            id: session.user.id, // Update to current session ID
            name: session.user.name || existingUserByEmail.name,
            image: session.user.image || existingUserByEmail.image,
          }
        });

        console.log('✅ Updated existing user with new ID:', updatedUser.id);
        return NextResponse.json({
          success: true,
          message: 'User updated successfully',
          user: updatedUser
        });
      }

      // Create new user if no existing user found
      const newUser = await prisma.user.create({
        data: {
          id: session.user.id,
          email: userEmail,
          name: session.user.name || 'Unknown User',
          emailVerified: null,
          image: session.user.image || null,
        }
      });

      console.log('✅ Created new user:', newUser.id);
      return NextResponse.json({
        success: true,
        message: 'User created successfully',
        user: newUser
      });

    } catch (createError) {
      console.error('❌ Error in user creation/update:', createError);

      // If there's still a constraint error, try to find the user by ID and return it
      try {
        const userById = await prisma.user.findUnique({
          where: { id: session.user.id }
        });

        if (userById) {
          console.log('✅ Found existing user by ID:', userById.id);
          return NextResponse.json({
            success: true,
            message: 'User already exists',
            user: userById
          });
        }
      } catch (findError) {
        console.error('❌ Error finding user:', findError);
      }

      throw createError; // Re-throw the original error
    }
  } catch (error) {
    console.error('❌ Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
