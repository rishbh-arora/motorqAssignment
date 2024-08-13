/*
  Warnings:

  - You are about to drop the column `vehicleId` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Vehicle` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Driver" DROP CONSTRAINT "Driver_vehicleId_fkey";

-- DropIndex
DROP INDEX "Driver_vehicleId_key";

-- DropIndex
DROP INDEX "Vehicle_phone_key";

-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "vehicleId";

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "location",
DROP COLUMN "name",
DROP COLUMN "phone";
