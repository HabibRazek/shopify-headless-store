import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding blog data...');

  // Create admin user if it doesn't exist
  const adminEmail = 'admin@packedin.tn';
  let adminUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!adminUser) {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    adminUser = await prisma.user.create({
      data: {
        name: 'Admin Packedin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      },
    });
    console.log('✅ Admin user created');
  } else {
    // Update existing user to admin role
    adminUser = await prisma.user.update({
      where: { email: adminEmail },
      data: { role: 'admin' },
    });
    console.log('✅ Admin user role updated');
  }

  // Create blog categories
  const categories = [
    {
      name: 'Actualités',
      slug: 'actualites',
      description: 'Les dernières nouvelles de Packedin et du secteur de l\'emballage',
    },
    {
      name: 'Conseils',
      slug: 'conseils',
      description: 'Conseils et astuces pour optimiser vos emballages',
    },
    {
      name: 'Innovation',
      slug: 'innovation',
      description: 'Les dernières innovations dans le domaine de l\'emballage',
    },
    {
      name: 'Événements',
      slug: 'evenements',
      description: 'Nos participations aux salons et événements',
    },
  ];

  const createdCategories = [];
  for (const category of categories) {
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { slug: category.slug },
    });

    if (!existingCategory) {
      const newCategory = await prisma.blogCategory.create({
        data: category,
      });
      createdCategories.push(newCategory);
      console.log(`✅ Category created: ${category.name}`);
    } else {
      createdCategories.push(existingCategory);
      console.log(`ℹ️ Category already exists: ${category.name}`);
    }
  }

  // Create blog tags
  const tags = [
    { name: 'Emballage', slug: 'emballage' },
    { name: 'Doypack', slug: 'doypack' },
    { name: 'Écologique', slug: 'ecologique' },
    { name: 'Innovation', slug: 'innovation' },
    { name: 'Alimentaire', slug: 'alimentaire' },
    { name: 'Cosmétique', slug: 'cosmetique' },
    { name: 'Personnalisation', slug: 'personnalisation' },
    { name: 'Qualité', slug: 'qualite' },
    { name: 'Salon', slug: 'salon' },
    { name: 'Tendances', slug: 'tendances' },
  ];

  const createdTags = [];
  for (const tag of tags) {
    const existingTag = await prisma.blogTag.findUnique({
      where: { slug: tag.slug },
    });

    if (!existingTag) {
      const newTag = await prisma.blogTag.create({
        data: tag,
      });
      createdTags.push(newTag);
      console.log(`✅ Tag created: ${tag.name}`);
    } else {
      createdTags.push(existingTag);
      console.log(`ℹ️ Tag already exists: ${tag.name}`);
    }
  }

  // Create sample blog posts
  const posts = [
    {
      title: 'Notre participation au salon international Gulfood Manufacturing 2023 à Dubaï',
      slug: 'participation-salon-gulfood-manufacturing-2023-dubai',
      excerpt: 'Découvrez notre expérience enrichissante au salon Gulfood Manufacturing 2023 à Dubaï, où nous avons présenté nos dernières innovations en matière d\'emballage.',
      content: `
        <h2>Une expérience enrichissante au cœur de l'innovation</h2>
        <p>Notre équipe a eu l'honneur de participer au prestigieux salon international Gulfood Manufacturing 2023 à Dubaï. Cet événement majeur de l'industrie alimentaire nous a permis de présenter nos dernières innovations et de rencontrer des professionnels du monde entier.</p>
        
        <h3>Nos innovations présentées</h3>
        <p>Nous avons présenté notre gamme complète de doypacks, incluant :</p>
        <ul>
          <li>Doypacks kraft personnalisables</li>
          <li>Emballages écologiques</li>
          <li>Solutions d'emballage pour l'industrie alimentaire</li>
          <li>Innovations en matière de fermeture zip</li>
        </ul>
        
        <h3>Rencontres et partenariats</h3>
        <p>Ce salon nous a permis de nouer de nouveaux partenariats stratégiques et de renforcer nos relations avec nos clients existants. Les échanges ont été particulièrement fructueux concernant les tendances du marché et les besoins futurs en matière d'emballage.</p>
        
        <p>Nous remercions tous les visiteurs qui ont manifesté leur intérêt pour nos produits et nous nous réjouissons de concrétiser les opportunités identifiées lors de cet événement.</p>
      `,
      featuredImage: null,
      published: true,
      categoryId: createdCategories.find(c => c.slug === 'evenements')?.id,
      tagIds: [
        createdTags.find(t => t.slug === 'salon')?.id,
        createdTags.find(t => t.slug === 'innovation')?.id,
        createdTags.find(t => t.slug === 'emballage')?.id,
      ].filter(Boolean),
    },
    {
      title: 'Le Guide Complet de l\'Emballage Flexible',
      slug: 'guide-complet-emballage-flexible',
      excerpt: 'Tout ce que vous devez savoir sur l\'emballage flexible : avantages, applications et tendances du marché.',
      content: `
        <h2>Qu'est-ce que l'emballage flexible ?</h2>
        <p>L'emballage flexible est un type d'emballage fabriqué à partir de matériaux souples comme le plastique, l'aluminium ou des films composites. Contrairement aux emballages rigides, il s'adapte à la forme du produit qu'il contient.</p>
        
        <h3>Avantages de l'emballage flexible</h3>
        <ul>
          <li><strong>Économique :</strong> Coûts de production et de transport réduits</li>
          <li><strong>Léger :</strong> Moins de matière première utilisée</li>
          <li><strong>Polyvalent :</strong> Adaptable à de nombreux produits</li>
          <li><strong>Pratique :</strong> Facile à ouvrir et à refermer</li>
          <li><strong>Écologique :</strong> Moins d'impact environnemental</li>
        </ul>
        
        <h3>Applications principales</h3>
        <p>L'emballage flexible trouve ses applications dans de nombreux secteurs :</p>
        <ul>
          <li>Industrie alimentaire (snacks, café, épices)</li>
          <li>Cosmétiques et soins personnels</li>
          <li>Produits pharmaceutiques</li>
          <li>Produits ménagers</li>
        </ul>
        
        <h3>Tendances du marché</h3>
        <p>Le marché de l'emballage flexible connaît une croissance constante, portée par la demande croissante de solutions d'emballage durables et pratiques. Les innovations se concentrent sur l'amélioration des propriétés barrières et la recyclabilité.</p>
      `,
      featuredImage: null,
      published: true,
      categoryId: createdCategories.find(c => c.slug === 'conseils')?.id,
      tagIds: [
        createdTags.find(t => t.slug === 'emballage')?.id,
        createdTags.find(t => t.slug === 'tendances')?.id,
        createdTags.find(t => t.slug === 'qualite')?.id,
      ].filter(Boolean),
    },
    {
      title: 'Sustainability & Flexible Packaging : L\'engagement de Packedin pour un avenir plus vert',
      slug: 'sustainability-flexible-packaging-engagement-packedin',
      excerpt: 'Découvrez comment Packedin s\'engage pour un emballage plus durable et respectueux de l\'environnement.',
      content: `
        <h2>Notre engagement environnemental</h2>
        <p>Chez Packedin, nous croyons que l'innovation et la durabilité vont de pair. C'est pourquoi nous nous engageons à développer des solutions d'emballage qui réduisent l'impact environnemental tout en maintenant la qualité et la performance.</p>
        
        <h3>Nos initiatives écologiques</h3>
        <ul>
          <li><strong>Matériaux recyclables :</strong> Utilisation de matériaux 100% recyclables</li>
          <li><strong>Réduction des déchets :</strong> Optimisation des processus de production</li>
          <li><strong>Emballages compostables :</strong> Développement de solutions biodégradables</li>
          <li><strong>Économie circulaire :</strong> Promotion du recyclage et de la réutilisation</li>
        </ul>
        
        <h3>Innovation durable</h3>
        <p>Nos équipes de R&D travaillent constamment sur de nouvelles solutions qui allient performance et respect de l'environnement. Nous investissons dans des technologies de pointe pour créer des emballages qui protègent vos produits tout en préservant notre planète.</p>
        
        <h3>Partenariat pour l'avenir</h3>
        <p>Nous collaborons avec nos clients pour les accompagner dans leur transition vers des emballages plus durables. Ensemble, nous construisons un avenir où l'emballage rime avec responsabilité environnementale.</p>
      `,
      featuredImage: null,
      published: true,
      categoryId: createdCategories.find(c => c.slug === 'innovation')?.id,
      tagIds: [
        createdTags.find(t => t.slug === 'ecologique')?.id,
        createdTags.find(t => t.slug === 'innovation')?.id,
        createdTags.find(t => t.slug === 'emballage')?.id,
      ].filter(Boolean),
    },
  ];

  for (const post of posts) {
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: post.slug },
    });

    if (!existingPost) {
      const { tagIds, ...postData } = post;
      await prisma.blogPost.create({
        data: {
          ...postData,
          authorId: adminUser.id,
          tags: {
            connect: tagIds.map(id => ({ id })),
          },
        },
      });
      console.log(`✅ Blog post created: ${post.title}`);
    } else {
      console.log(`ℹ️ Blog post already exists: ${post.title}`);
    }
  }

  console.log('🎉 Blog seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding blog data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
