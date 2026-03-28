-- AlterTable
ALTER TABLE `ideas` ADD COLUMN `researchLink` TEXT NULL,
    ADD COLUMN `stage` ENUM('IDEA', 'PROTOTYPE', 'REVENUE') NULL;
