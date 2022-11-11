/*
  Warnings:

  - You are about to drop the column `endLat` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `endLon` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `startLat` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `startLon` on the `Ride` table. All the data in the column will be lost.

*/
-- create postgis extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "endLat",
DROP COLUMN "endLon",
DROP COLUMN "startLat",
DROP COLUMN "startLon",
ADD COLUMN     "coords" geometry(Point, 4326);

-- CreateIndex
CREATE INDEX "location_idx" ON "Ride" USING GIST ("coords");
