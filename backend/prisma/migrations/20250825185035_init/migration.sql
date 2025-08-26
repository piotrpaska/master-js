/*
  Warnings:

  - Added the required column `trackId` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `record` ADD COLUMN `trackId` VARCHAR(191) NOT NULL;
