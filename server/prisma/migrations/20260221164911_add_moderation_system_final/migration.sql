/*
  Warnings:

  - You are about to drop the column `rejectionReason` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `reviewedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `reviewedBy` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ideas` ADD COLUMN `rejectionReason` TEXT NULL,
    ADD COLUMN `reviewedAt` DATETIME(3) NULL,
    ADD COLUMN `reviewedBy` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `users` DROP COLUMN `rejectionReason`,
    DROP COLUMN `reviewedAt`,
    DROP COLUMN `reviewedBy`,
    DROP COLUMN `status`;
