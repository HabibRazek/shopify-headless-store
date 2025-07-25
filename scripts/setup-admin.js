// Quick setup script to make the first user an admin
// Usage: node scripts/setup-admin.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    console.log('🔍 Looking for users to make admin...');

    // Find the first user in the database
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, status: true },
      orderBy: { createdAt: 'asc' },
      take: 5
    });

    if (users.length === 0) {
      console.log('❌ No users found in the database');
      console.log('Please create a user account first by signing up on the website');
      process.exit(1);
    }

    console.log('\n📋 Found users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || 'No name'} (${user.email}) - Role: ${user.role}`);
    });

    // Check if any user is already an admin
    const adminUsers = users.filter(user => user.role === 'admin' || user.role === 'super_admin');
    
    if (adminUsers.length > 0) {
      console.log('\n✅ Admin users already exist:');
      adminUsers.forEach(user => {
        console.log(`   - ${user.name || 'No name'} (${user.email}) - Role: ${user.role}`);
      });
      console.log('\nYou can already access the admin panel with these accounts.');
      process.exit(0);
    }

    // Make the first user an admin
    const firstUser = users[0];
    
    console.log(`\n🔧 Making ${firstUser.name || firstUser.email} an admin...`);

    const updatedUser = await prisma.user.update({
      where: { id: firstUser.id },
      data: { 
        role: 'admin',
        status: 'active'
      },
      select: { id: true, name: true, email: true, role: true, status: true }
    });

    console.log('\n✅ Successfully created admin user:');
    console.log(`   Name: ${updatedUser.name || 'No name'}`);
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   Role: ${updatedUser.role}`);
    console.log(`   Status: ${updatedUser.status}`);
    console.log('\n🎉 You can now access the admin panel at: http://localhost:3000/admin');
    console.log('   Sign in with this user account to access admin features.');

  } catch (error) {
    console.error('❌ Error setting up admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin();
