/*
  Warnings:

  - You are about to drop the column `endStamp` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `startStamp` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleId` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `assignmentId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_vehicleId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "endStamp",
DROP COLUMN "startStamp",
DROP COLUMN "vehicleId",
ADD COLUMN     "assignmentId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Assignment" (
    "id" SERIAL NOT NULL,
    "startStamp" TIMESTAMP(3) NOT NULL,
    "endStamp" TIMESTAMP(3) NOT NULL,
    "vehicleId" INTEGER NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
