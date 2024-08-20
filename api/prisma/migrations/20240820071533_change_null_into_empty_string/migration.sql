/*
  Warnings:

  - Made the column `message` on table `GroupChat` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mediaUrl` on table `GroupChat` required. This step will fail if there are existing NULL values in that column.
  - Made the column `message` on table `RoomChat` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mediaUrl` on table `RoomChat` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "GroupChat" ALTER COLUMN "message" SET NOT NULL,
ALTER COLUMN "mediaUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "RoomChat" ALTER COLUMN "message" SET NOT NULL,
ALTER COLUMN "mediaUrl" SET NOT NULL;
