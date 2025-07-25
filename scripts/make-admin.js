// Script to make a user an admin
// Usage: node scripts/make-admin.js <email>

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function makeUserAdmin(email) {
  try {
    if (!email) {
      console.error('Please provide an email address');
      console.log('Usage: node scripts/make-admin.js <email>');
      process.exit(1);
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    if (user.role === 'admin' || user.role === 'super_admin') {
      console.log(`User ${user.name} (${user.email}) is already an admin`);
      process.exit(0);
    }

    // Update user role to admin
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { 
        role: 'admin',
        status: 'active' // Ensure user is active
      },
      select: { id: true, name: true, email: true, role: true, status: true }
    });

    console.log('✅ User successfully made admin:');
    console.log(`   Name: ${updatedUser.name}`);
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   Role: ${updatedUser.role}`);
    console.log(`   Status: ${updatedUser.status}`);

  } catch (error) {
    console.error('Error making user admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line arguments
const email = process.argv[2];
makeUserAdmin(email);
