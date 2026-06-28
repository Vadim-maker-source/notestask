import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const flag = process.env.FLAG ?? "flag{placeholder}";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin-admin-admin";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@notes.ctf" },
    update: { password: passwordHash },
    create: {
      email: "admin@notes.ctf",
      name: "admin",
      password: passwordHash,
      settings: { theme: "dark", fontSize: 14 },
    },
  });

  const seeds = [
    {
      title: "Welcome to notes",
      content: "Thanks for trying notes! Everything you write here stays private — only you can read it.",
      metadata: Prisma.DbNull,  // ← вот исправление
    },
    {
      title: "Roadmap",
      content: "- Public feed of titles\n- Sharing via metadata\n- Better search",
      metadata: Prisma.DbNull,
    },
    {
      title: "Flag",
      content: flag,
      metadata: Prisma.DbNull,
    },
  ];

  for (const s of seeds) {
    const existing = await prisma.note.findFirst({
      where: { ownerId: admin.id, title: s.title },
    });
    if (existing) {
      await prisma.note.update({ where: { id: existing.id }, data: s });
    } else {
      await prisma.note.create({ data: { ...s, ownerId: admin.id } });
    }
  }

  console.log("Seed complete: admin@notes.ctf created/updated.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });