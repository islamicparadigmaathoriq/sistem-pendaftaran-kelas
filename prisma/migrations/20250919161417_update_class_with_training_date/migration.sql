/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Class` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Class" DROP COLUMN "imageUrl",
ADD COLUMN     "trainingDate" TIMESTAMP(3);
