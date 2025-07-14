import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Fixing blog post images...');

  // Update all blog posts to remove featured images
  const result = await prisma.blogPost.updateMany({
    data: {
      featuredImage: null,
    },
  });

  console.log(`✅ Updated ${result.count} blog posts`);
}

main()
  .catch((e) => {
    console.error('❌ Error fixing blog images:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
