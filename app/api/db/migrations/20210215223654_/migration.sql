/*
  Warnings:

  - Added the required column `computed` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `computed` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "computed" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "computed" JSONB NOT NULL;
