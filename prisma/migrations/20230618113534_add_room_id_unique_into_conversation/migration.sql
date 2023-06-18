/*
  Warnings:

  - A unique constraint covering the columns `[roomId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roomId` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Conversation` ADD COLUMN `roomId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Conversation_roomId_key` ON `Conversation`(`roomId`);
