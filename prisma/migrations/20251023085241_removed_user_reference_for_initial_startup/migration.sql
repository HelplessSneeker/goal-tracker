/*
  Warnings:

  - You are about to drop the column `userId` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Region` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Goal" DROP CONSTRAINT "Goal_userId_fkey";

-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Region" DROP COLUMN "userId";
