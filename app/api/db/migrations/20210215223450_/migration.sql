/*
  Warnings:

  - You are about to drop the column `authorId` on the `Action` table. All the data in the column will be lost.
  - Added the required column `profileId` to the `Action` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_authorId_fkey";

-- AlterTable
ALTER TABLE "Action" DROP COLUMN "authorId",
ADD COLUMN     "profileId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Action" ADD FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
