import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "superadmin@remix.run";
  const firstName = "Super";
  const lastName = "Admin";

  // cleanup the existing database
  await prisma.user.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("password", 10);

  await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      role: "SUPERADMIN",
      password: { create: { hash: hashedPassword } },
    },
  });

  await prisma.user.create({
    data: {
      email: "admin@remix.run",
      firstName: "Admin",
      role: "ADMIN",
      password: { create: { hash: hashedPassword } },
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
