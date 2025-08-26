-- AlterTable
ALTER TABLE `record` ADD COLUMN `status` ENUM('OK', 'DNF', 'DNS', 'DSQ') NOT NULL DEFAULT 'OK';
