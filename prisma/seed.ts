import {
  randBoolean,
  randCity,
  randCompanyName,
  randFloat,
  randFutureDate,
  randNumber,
  randParagraph,
  randPastDate,
  randStateAbbr,
  randText,
} from "@ngneat/falso";
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

  const superAdmin = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      role: "SUPERADMIN",
      password: { create: { hash: hashedPassword } },
    },
  });

  await prisma.ride.deleteMany();

  for (let i = 0; i < 100; i++) {
    await prisma.ride.create({
      data: {
        name: randText(),
        startsAt: randBoolean() ? randFutureDate() : randPastDate(),
        distance: randFloat({ min: 10, max: 50, fraction: 1 }),
        duration: randNumber({ min: 60, max: 180 }),
        creator: {
          connect: { id: superAdmin.id },
        },
      },
    });
    await prisma.club.create({
      data: {
        name: randCompanyName(),
        description: randParagraph(),
        city: randCity(),
        state: randStateAbbr(),
        isPrivate: randBoolean(),
      },
    });
  }

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
