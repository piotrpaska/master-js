-- DropForeignKey
ALTER TABLE `record` DROP FOREIGN KEY `Record_entryId_fkey`;

-- DropForeignKey
ALTER TABLE `record` DROP FOREIGN KEY `Record_startListId_fkey`;

-- DropIndex
DROP INDEX `Record_entryId_fkey` ON `record`;

-- DropIndex
DROP INDEX `Record_startListId_fkey` ON `record`;

-- AlterTable
ALTER TABLE `record` MODIFY `startTime` BIGINT NOT NULL DEFAULT 0,
    MODIFY `endTime` BIGINT NULL,
    MODIFY `duration` BIGINT NULL;

-- AddForeignKey
ALTER TABLE `Record` ADD CONSTRAINT `Record_startListId_fkey` FOREIGN KEY (`startListId`) REFERENCES `StartList`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Record` ADD CONSTRAINT `Record_entryId_fkey` FOREIGN KEY (`entryId`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
