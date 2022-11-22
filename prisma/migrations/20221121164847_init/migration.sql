-- Add PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('Metric', 'Imperial');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "ClubJoinRequestStatus" AS ENUM ('SENT', 'APPROVED', 'REJECTED', 'RESCINDED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "nickname" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "unit" "Unit" NOT NULL DEFAULT 'Imperial',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Password" (
    "hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PasswordReset" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "sentOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PasswordReset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ride" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "creatorId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3),
    "duration" INTEGER,
    "distance" DOUBLE PRECISION,
    "paceId" INTEGER NOT NULL,
    "clubId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coords" geometry(Point, 4326),

    CONSTRAINT "Ride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pace" (
    "id" SERIAL NOT NULL,
    "speedRange" TEXT NOT NULL,
    "actualAvgSpeed" INTEGER NOT NULL,

    CONSTRAINT "Pace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "city" TEXT,
    "state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubJoinRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "status" "ClubJoinRequestStatus" NOT NULL,
    "closedOn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubJoinRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_joinedRides" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ClubToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Password_userId_key" ON "Password"("userId");

-- CreateIndex
CREATE INDEX "location_idx" ON "Ride" USING GIST ("coords");

-- CreateIndex
CREATE UNIQUE INDEX "ClubJoinRequest_userId_clubId_key" ON "ClubJoinRequest"("userId", "clubId");

-- CreateIndex
CREATE UNIQUE INDEX "_joinedRides_AB_unique" ON "_joinedRides"("A", "B");

-- CreateIndex
CREATE INDEX "_joinedRides_B_index" ON "_joinedRides"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ClubToUser_AB_unique" ON "_ClubToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ClubToUser_B_index" ON "_ClubToUser"("B");

-- AddForeignKey
ALTER TABLE "Password" ADD CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordReset" ADD CONSTRAINT "PasswordReset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_paceId_fkey" FOREIGN KEY ("paceId") REFERENCES "Pace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubJoinRequest" ADD CONSTRAINT "ClubJoinRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubJoinRequest" ADD CONSTRAINT "ClubJoinRequest_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_joinedRides" ADD CONSTRAINT "_joinedRides_A_fkey" FOREIGN KEY ("A") REFERENCES "Ride"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_joinedRides" ADD CONSTRAINT "_joinedRides_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClubToUser" ADD CONSTRAINT "_ClubToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClubToUser" ADD CONSTRAINT "_ClubToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
