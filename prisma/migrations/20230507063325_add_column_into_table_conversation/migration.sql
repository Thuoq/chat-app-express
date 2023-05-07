-- AlterTable
ALTER TABLE `Conversation` ADD COLUMN `avatarUrl` VARCHAR(191) NULL,
    ADD COLUMN `is_direct_message` INTEGER NOT NULL DEFAULT 1;
