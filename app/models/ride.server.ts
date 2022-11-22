import type { Prisma, Ride, User } from "@prisma/client";
import dayjs from "dayjs";
import { prisma } from "~/lib/db.server";
import { convertMilesToKm } from "~/lib/formatters";

export function getRidesByUser(userId: User["id"]) {
  return prisma.ride.findMany({
    where: { riders: { some: { id: userId } } },
    include: { club: true },
  });
}

export function getPastRidesByUser(userId: User["id"]) {
  const today = dayjs().startOf("day").toDate();
  return prisma.ride.findMany({
    where: {
      startsAt: { lte: today },
      riders: { some: { id: userId } },
    },
    include: { club: true },
  });
}

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

type NearbyRide = { id: string; distanceAway: string };
export async function getNearbyRides(
  longitude: string,
  latitude: string,
  radius?: number
): Promise<Array<{ id: string; kmAway: number }>> {
  const radiusInMeters = radius && convertMilesToKm(radius) * 100;
  const point = `POINT(${longitude} ${latitude})`;
  const rawRides = await prisma.$queryRaw<Array<NearbyRide>>`
    SELECT r.Id,
      ST_Distance(r.coords, ${point}::geography)::text "distanceAway"
    FROM "Ride" r
    WHERE ST_DWithin(
      r.coords, ${point}::geography,
      ROUND(${radiusInMeters ? radiusInMeters : 1000000})::int)
    ORDER BY r.coords <-> ${point}::geography;
  `;

  return rawRides.map(({ id, distanceAway }) => {
    const distanceAsKm = Math.round(Number(distanceAway)) / 100;
    return { id, kmAway: distanceAsKm };
  });
}
