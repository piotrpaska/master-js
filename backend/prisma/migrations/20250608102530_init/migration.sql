-- AlterTable
ALTER TABLE `athlete` ALTER COLUMN `name` DROP DEFAULT;

-- AlterTable
ALTER TABLE `device` ALTER COLUMN `name` DROP DEFAULT,
    ALTER COLUMN `type` DROP DEFAULT;

-- AlterTable
ALTER TABLE `liveagents` ALTER COLUMN `deviceName` DROP DEFAULT;

-- AlterTable
ALTER TABLE `record` ALTER COLUMN `track` DROP DEFAULT;

-- AlterTable
ALTER TABLE `startlist` ALTER COLUMN `title` DROP DEFAULT;
