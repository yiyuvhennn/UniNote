import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("123456", 10);

  const user = await prisma.user.upsert({
    where: { email: "test@uninotes.com" },
    update: {},
    create: {
      name: "Test User",
      email: "test@uninotes.com",
      password: hashedPassword,
    },
  });

  const tag1 = await prisma.tag.upsert({
    where: { name: "微積分" },
    update: {},
    create: { name: "微積分" },
  });

  const tag2 = await prisma.tag.upsert({
    where: { name: "期中考" },
    update: {},
    create: { name: "期中考" },
  });

  const note = await prisma.note.create({
    data: {
      title: "微積分期中考重點整理",
      description: "整理極限、微分與應用題型",
      fileUrl: "https://example.com/calculus-note.pdf",
      course: "微積分",
      authorId: user.id,
    },
  });

  await prisma.noteTag.createMany({
    data: [
      { noteId: note.id, tagId: tag1.id },
      { noteId: note.id, tagId: tag2.id },
    ],
  });

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });