import type { Prisma, Ride, User } from "@prisma/client";
import { prisma } from "~/db.server";
import { convertMilesToKm } from "~/lib/formatters";

export function createRide({
  creatorId,
  ...rest
}: Prisma.RideUncheckedCreateInput) {
  return prisma.ride.create({
    data: {
      ...rest,
      creatorId,
    },
  });
}

export function joinRide(userId: User["id"], rideId: Ride["id"]) {
  return prisma.ride.update({
    where: { id: rideId },
    data: {
      riders: { connect: { id: userId } },
    },
  });
}

export function leaveRide(userId: User["id"], rideId: Ride["id"]) {
  return prisma.ride.update({
    where: { id: rideId },
    data: {
      riders: { disconnect: { id: userId } },
    },
  });
}

export async function getNearbyRides(
  longitude: string,
  latitude: string,
  radius: string | null
): Promise<Array<{ id: string; kmAway: number }>> {
  const radiusInMeters = radius && convertMilesToKm(+radius) * 100;
  const point = `POINT(${longitude} ${latitude})`;
  const rawRides = await prisma.$queryRaw<
    { id: string; distanceAway: string }[]
  >`
    SELECT r.Id,
      ST_Distance(r.coords, ${point}::geography)::text "distanceAway"
    FROM "Ride" r
    WHERE ST_DWithin(r.coords, ${point}::geography, ${
    radiusInMeters ? radiusInMeters : 1000000
  })
    ORDER BY r.coords <-> ${point}::geography;
  `;

  return rawRides.map(({ id, distanceAway }) => {
    const distanceAsKm = Math.round(+distanceAway) / 100;
    return { id, kmAway: distanceAsKm };
  });
}
