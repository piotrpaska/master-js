/*
  Warnings:

  - You are about to drop the column `startListId` on the `record` table. All the data in the column will be lost.
  - Added the required column `sessionId` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `record` DROP FOREIGN KEY `Record_startListId_fkey`;

-- AlterTable
ALTER TABLE `record` DROP COLUMN `startListId`,
    ADD COLUMN `sessionId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `startListId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Record` ADD CONSTRAINT `Record_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Session`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_startListId_fkey` FOREIGN KEY (`startListId`) REFERENCES `StartList`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
