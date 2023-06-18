/*
  Warnings:

  - You are about to drop the column `is_direct_message` on the `Conversation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Conversation` DROP COLUMN `is_direct_message`;
