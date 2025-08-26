/*
  Warnings:

  - You are about to drop the `device` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `liveagents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `track` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `track` DROP FOREIGN KEY `Track_assignedEntryId_fkey`;

-- AlterTable
ALTER TABLE `record` ADD COLUMN `startListId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `device`;

-- DropTable
DROP TABLE `liveagents`;

-- DropTable
DROP TABLE `track`;

-- AddForeignKey
ALTER TABLE `Record` ADD CONSTRAINT `Record_startListId_fkey` FOREIGN KEY (`startListId`) REFERENCES `StartList`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
