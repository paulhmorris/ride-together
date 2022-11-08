import type { Prisma, Ride, User } from "@prisma/client";
import { prisma } from "~/db.server";

export async function createRide({
  creatorId,
  ...rest
}: Prisma.RideUncheckedCreateInput) {
  return await prisma.ride.create({
    data: {
      ...rest,
      creatorId,
    },
  });
}

export async function joinRide(userId: User["id"], rideId: Ride["id"]) {
  return await prisma.ride.update({
    where: { id: rideId },
    data: {
      riders: { connect: { id: userId } },
    },
  });
}

export async function leaveRide(userId: User["id"], rideId: Ride["id"]) {
  return await prisma.ride.update({
    where: { id: rideId },
    data: {
      riders: { disconnect: { id: userId } },
    },
  });
}
