import type { Club, Prisma, User } from "@prisma/client";
import { prisma } from "~/db.server";

export function getClubById(id: Club["id"]) {
  return prisma.club.findFirst({
    where: { id },
    include: {
      members: true,
      rides: true,
    },
  });
}

export function getAllClubs() {
  return prisma.club.findMany({
    where: { isPrivate: false },
    include: {
      members: true,
      joinRequests: {
        where: { status: "SENT" },
      },
    },
  });
}

export function createClub(
  userId: User["id"],
  { ...rest }: Prisma.ClubUncheckedCreateInput
) {
  return prisma.club.create({
    data: {
      ...rest,
      members: {
        connect: { id: userId },
      },
    },
  });
}

export function sendJoinRequest(userId: User["id"], clubId: Club["id"]) {
  return prisma.clubJoinRequest.create({
    data: { userId, clubId, status: "SENT" },
  });
}

export function cancelJoinRequest(userId: User["id"], clubId: Club["id"]) {
  return prisma.clubJoinRequest.deleteMany({
    where: { userId, clubId },
  });
}

export function acceptJoinRequest(userId: User["id"], clubId: Club["id"]) {
  return prisma.club.update({
    where: { id: clubId },
    data: {
      members: { connect: { id: userId } },
      joinRequests: {
        updateMany: {
          where: { userId, clubId },
          data: { status: "APPROVED", closedOn: new Date() },
        },
      },
    },
  });
}

export function rejectJoinRequest(userId: User["id"], clubId: Club["id"]) {
  return prisma.clubJoinRequest.updateMany({
    where: { userId, clubId },
    data: { status: "REJECTED", closedOn: new Date() },
  });
}
