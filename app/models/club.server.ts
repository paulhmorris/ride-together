import type { Club, Prisma, User } from "@prisma/client";
import { prisma } from "~/lib/db.server";

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

export function getClubsByUser(userId: User["id"]) {
  return prisma.club.findMany({
    where: {
      members: { some: { id: userId } },
    },
    include: {
      joinRequests: {
        where: { userId },
      },
      rides: {
        where: {
          riders: {
            some: { id: userId },
          },
        },
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

// Club Join Requests
export function getJoinRequestsByUser(userId: User["id"]) {
  return prisma.clubJoinRequest.findMany({
    where: { userId },
    include: { club: true },
  });
}

export function getJoinRequestsByClub(clubId: Club["id"]) {
  return prisma.clubJoinRequest.findMany({
    where: { clubId },
    include: { club: true },
  });
}

export function sendJoinRequest(userId: User["id"], clubId: Club["id"]) {
  return prisma.clubJoinRequest.create({
    data: { userId, clubId, status: "SENT" },
  });
}

export function cancelJoinRequest(userId: User["id"], clubId: Club["id"]) {
  return prisma.clubJoinRequest.updateMany({
    where: { userId, clubId },
    data: { status: "RESCINDED", closedOn: new Date() },
  });
}

export function acceptJoinRequest(userId: User["id"], clubId: Club["id"]) {
  return prisma.clubJoinRequest.updateMany({
    where: { userId, clubId },
    data: { status: "APPROVED", closedOn: new Date() },
  });
}

export function rejectJoinRequest(userId: User["id"], clubId: Club["id"]) {
  return prisma.clubJoinRequest.updateMany({
    where: { userId, clubId },
    data: { status: "REJECTED", closedOn: new Date() },
  });
}
