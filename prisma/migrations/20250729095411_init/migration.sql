/*
  Warnings:

  - You are about to alter the column `startTime` on the `record` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `endTime` on the `record` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `duration` on the `record` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `record` MODIFY `startTime` INTEGER NOT NULL DEFAULT 0,
    MODIFY `endTime` INTEGER NULL,
    MODIFY `duration` INTEGER NULL;
