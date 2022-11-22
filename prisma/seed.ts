import {
  randBoolean,
  randCity,
  randCompanyName,
  randFloat,
  randFutureDate,
  randLatitude,
  randLongitude,
  randNumber,
  randParagraph,
  randPastDate,
  randSentence,
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
  const user = await prisma.user.delete({ where: { email } }).catch(() => {});
  console.log(user);

  await prisma.ride.deleteMany().catch(() => {});
  await prisma.club.deleteMany().catch(() => {});
  await prisma.pace.deleteMany().catch(() => {});

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

  await prisma.pace.createMany({
    data: [
      { speedRange: "10-12", actualAvgSpeed: 11 },
      { speedRange: "12-15", actualAvgSpeed: 13 },
      { speedRange: "15-17", actualAvgSpeed: 16 },
      { speedRange: "17-21", actualAvgSpeed: 19 },
      { speedRange: "21+", actualAvgSpeed: 21 },
    ],
  });

  for (let i = 0; i < 100; i++) {
    const ride = await prisma.ride.create({
      data: {
        name: randText(),
        startsAt: randBoolean() ? randFutureDate() : randPastDate(),
        distance: randFloat({ min: 10, max: 50, fraction: 1 }),
        duration: randNumber({ min: 60, max: 180 }),
        description: randSentence(),
        creator: {
          connect: { id: superAdmin.id },
        },
      },
    });

    const lon = randLongitude();
    const lat = randLatitude();
    await prisma.$queryRaw`
      UPDATE "Ride"
      SET coords = ST_MakePoint(${lon}, ${lat})
      WHERE Id = ${ride.id}
    `;
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
