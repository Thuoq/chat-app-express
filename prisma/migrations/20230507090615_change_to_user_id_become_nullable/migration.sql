-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_to_user_id_fkey`;

-- AlterTable
ALTER TABLE `Message` MODIFY `to_user_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_to_user_id_fkey` FOREIGN KEY (`to_user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
