/*
  Warnings:

  - Added the required column `imageUrl` to the `Tweet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tweet" ADD COLUMN     "imageUrl" TEXT NOT NULL;
