-- DropForeignKey
ALTER TABLE "Ride" DROP CONSTRAINT "Ride_paceId_fkey";

-- AlterTable
ALTER TABLE "Ride" ALTER COLUMN "paceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_paceId_fkey" FOREIGN KEY ("paceId") REFERENCES "Pace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
