import type { Club, Prisma, User } from "@prisma/client";
import { NotFoundError } from "@prisma/client/runtime";
import { prisma } from "~/db.server";

export async function getClubById(id: Club["id"]) {
  return await prisma.club.findFirst({
    where: { id },
    include: {
      members: true,
      rides: true,
    },
  });
}

export async function getAllClubs() {
  return await prisma.club.findMany({
    where: { isPrivate: false },
    include: {
      members: true,
      joinRequests: {
        where: { status: "SENT" },
      },
    },
  });
}

export async function createClub(
  userId: User["id"],
  { ...rest }: Prisma.ClubUncheckedCreateInput
) {
  return await prisma.club.create({
    data: {
      ...rest,
      members: {
        connect: { id: userId },
      },
    },
  });
}

export async function sendJoinRequest(userId: User["id"], clubId: Club["id"]) {
  return await prisma.clubJoinRequest.create({
    data: { userId, clubId, status: "SENT" },
  });
}

export async function cancelJoinRequest(
  userId: User["id"],
  clubId: Club["id"]
) {
  return await prisma.clubJoinRequest.deleteMany({
    where: { userId, clubId },
  });
}

export async function acceptJoinRequest(
  userId: User["id"],
  clubId: Club["id"]
) {
  await prisma.clubJoinRequest.updateMany({
    where: { userId, clubId },
    data: { status: "APPROVED", closedOn: new Date() },
  });

  return await prisma.club.update({
    where: { id: clubId },
    data: {
      members: { connect: { id: userId } },
    },
  });
}

export async function rejectJoinRequest(
  userId: User["id"],
  clubId: Club["id"]
) {
  const request = await prisma.clubJoinRequest.findFirst({
    where: { userId, clubId },
  });
  if (!request) throw new NotFoundError("ClubJoinRequest not found");

  return await prisma.clubJoinRequest.update({
    where: { id: request?.id },
    data: { status: "REJECTED", closedOn: new Date() },
  });
}
