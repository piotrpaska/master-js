/*
  Warnings:

  - You are about to drop the `trackstatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `trackstatus` DROP FOREIGN KEY `TrackStatus_assignedEntryId_fkey`;

-- DropTable
DROP TABLE `trackstatus`;

-- CreateTable
CREATE TABLE `Track` (
    `id` VARCHAR(191) NOT NULL,
    `startTime` BIGINT NOT NULL DEFAULT 0,
    `prevDuration` BIGINT NOT NULL DEFAULT 0,
    `running` BOOLEAN NOT NULL DEFAULT false,
    `assignedEntryId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Track` ADD CONSTRAINT `Track_assignedEntryId_fkey` FOREIGN KEY (`assignedEntryId`) REFERENCES `Entry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
