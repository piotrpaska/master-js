/*
  Warnings:

  - Made the column `athleteId` on table `entry` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startListId` on table `entry` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startListId` on table `record` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `entry` DROP FOREIGN KEY `Entry_athleteId_fkey`;

-- DropForeignKey
ALTER TABLE `entry` DROP FOREIGN KEY `Entry_startListId_fkey`;

-- DropForeignKey
ALTER TABLE `record` DROP FOREIGN KEY `Record_startListId_fkey`;

-- DropIndex
DROP INDEX `Entry_athleteId_fkey` ON `entry`;

-- DropIndex
DROP INDEX `Entry_startListId_fkey` ON `entry`;

-- DropIndex
DROP INDEX `Record_startListId_fkey` ON `record`;

-- AlterTable
ALTER TABLE `entry` MODIFY `athleteId` VARCHAR(191) NOT NULL,
    MODIFY `startListId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `record` MODIFY `startListId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Record` ADD CONSTRAINT `Record_startListId_fkey` FOREIGN KEY (`startListId`) REFERENCES `StartList`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Entry` ADD CONSTRAINT `Entry_athleteId_fkey` FOREIGN KEY (`athleteId`) REFERENCES `Athlete`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Entry` ADD CONSTRAINT `Entry_startListId_fkey` FOREIGN KEY (`startListId`) REFERENCES `StartList`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
