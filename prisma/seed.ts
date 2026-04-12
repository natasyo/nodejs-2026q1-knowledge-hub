import 'dotenv/config';
import { PrismaClient, Role, Status } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // साफ start (optional)
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 👤 Users
  const admin = await prisma.user.create({
    data: {
      login: 'admin',
      password: '1234',
      role: Role.ADMIN,
    },
  });

  const editor = await prisma.user.create({
    data: {
      login: 'editor',
      password: 'pass',
      role: Role.EDITOR,
    },
  });

  // 📂 Categories
  const tech = await prisma.category.create({
    data: { name: 'Technology', description: 'Desc' },
  });

  const science = await prisma.category.create({
    data: { name: 'Science', description: 'Desc' },
  });

  const lifestyle = await prisma.category.create({
    data: { name: 'Lifestyle', description: 'Desc' },
  });

  // 🏷 Tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'NestJS' } }),
    prisma.tag.create({ data: { name: 'Docker' } }),
    prisma.tag.create({ data: { name: 'Prisma' } }),
    prisma.tag.create({ data: { name: 'Health' } }),
    prisma.tag.create({ data: { name: 'Space' } }),
  ]);

  // 📝 Articles
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        title: 'Getting started with NestJS',
        content: 'NestJS is a progressive Node.js framework...',
        status: Status.PUBLISHED,
        userId: admin.id,
        categoryId: tech.id,
        tags: {
          connect: [{ id: tags[0].id }, { id: tags[2].id }],
        },
      },
    }),

    prisma.article.create({
      data: {
        title: 'Docker basics',
        content: 'Docker helps you containerize applications...',
        status: Status.PUBLISHED,
        userId: editor.id,
        categoryId: tech.id,
        tags: {
          connect: [{ id: tags[1].id }],
        },
      },
    }),

    prisma.article.create({
      data: {
        title: 'The future of space travel',
        content: 'Exploring Mars and beyond...',
        status: Status.DRAFT,
        userId: admin.id,
        categoryId: science.id,
        tags: {
          connect: [{ id: tags[4].id }],
        },
      },
    }),

    prisma.article.create({
      data: {
        title: 'Healthy lifestyle tips',
        content: 'Eat well, sleep well...',
        status: Status.PUBLISHED,
        userId: editor.id,
        categoryId: lifestyle.id,
        tags: {
          connect: [{ id: tags[3].id }],
        },
      },
    }),

    prisma.article.create({
      data: {
        title: 'Prisma ORM guide',
        content: 'Prisma makes database access easy...',
        status: Status.ARCHIVED,
        userId: admin.id,
        categoryId: tech.id,
        tags: {
          connect: [{ id: tags[2].id }],
        },
      },
    }),
  ]);

  // 💬 Comments
  await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Great article!',
        userId: editor.id,
        articleId: articles[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Very helpful, thanks!',
        userId: admin.id,
        articleId: articles[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Looking forward to more content like this.',
        userId: editor.id,
        articleId: articles[3].id,
      },
    }),
  ]);

  console.log('🌱 Seeding completed');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
