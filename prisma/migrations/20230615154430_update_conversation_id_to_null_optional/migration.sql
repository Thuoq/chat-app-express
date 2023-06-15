/*
  Warnings:

  - Made the column `content` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_conversation_id_fkey`;

-- AlterTable
ALTER TABLE `Message` MODIFY `content` VARCHAR(191) NOT NULL,
    MODIFY `conversation_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_conversation_id_fkey` FOREIGN KEY (`conversation_id`) REFERENCES `Conversation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
