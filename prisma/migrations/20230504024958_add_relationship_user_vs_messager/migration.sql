/*
  Warnings:

  - You are about to drop the column `refreshTokenUsed` on the `KeyToken` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Message` table. All the data in the column will be lost.
  - Added the required column `from_user_id` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_user_id` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_user_id_fkey`;

-- AlterTable
ALTER TABLE `Conversation` MODIFY `name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `KeyToken` DROP COLUMN `refreshTokenUsed`,
    ADD COLUMN `refresh_token_used` JSON NOT NULL;

-- AlterTable
ALTER TABLE `Message` DROP COLUMN `user_id`,
    ADD COLUMN `from_user_id` INTEGER NOT NULL,
    ADD COLUMN `to_user_id` INTEGER NOT NULL,
    MODIFY `type` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_from_user_id_fkey` FOREIGN KEY (`from_user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_to_user_id_fkey` FOREIGN KEY (`to_user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
