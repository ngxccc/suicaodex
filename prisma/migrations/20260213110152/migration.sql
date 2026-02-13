/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Manga` table. All the data in the column will be lost.
  - You are about to drop the column `latestChapterId` on the `Manga` table. All the data in the column will be lost.
  - Added the required column `mangaId` to the `Chapter` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ChapterComment` DROP FOREIGN KEY `ChapterComment_chapterId_fkey`;

-- DropForeignKey
ALTER TABLE `LibraryManga` DROP FOREIGN KEY `fk_library_manga_library_cascade`;

-- DropForeignKey
ALTER TABLE `MangaComment` DROP FOREIGN KEY `MangaComment_mangaId_fkey`;

-- DropForeignKey
ALTER TABLE `Notify` DROP FOREIGN KEY `Notify_toUserId_fkey`;

-- DropIndex
DROP INDEX `Chapter_mangadexId_idx` ON `Chapter`;

-- DropIndex
DROP INDEX `ChapterComment_chapterId_createdAt_idx` ON `ChapterComment`;

-- DropIndex
DROP INDEX `idx_library_category_time` ON `LibraryManga`;

-- DropIndex
DROP INDEX `Manga_mangadexId_idx` ON `Manga`;

-- DropIndex
DROP INDEX `MangaComment_mangaId_createdAt_idx` ON `MangaComment`;

-- DropIndex
DROP INDEX `Notify_toUserId_createdAt_idx` ON `Notify`;

-- AlterTable
ALTER TABLE `Chapter` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `mangaId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Manga` DROP COLUMN `createdAt`,
    DROP COLUMN `latestChapterId`;

-- CreateIndex
CREATE INDEX `ChapterComment_chapterId_createdAt_idx` ON `ChapterComment`(`chapterId`, `createdAt` DESC);

-- CreateIndex
CREATE INDEX `idx_library_category_time` ON `LibraryManga`(`libraryId`, `category`, `updatedAt` DESC);

-- CreateIndex
CREATE INDEX `MangaComment_mangaId_createdAt_idx` ON `MangaComment`(`mangaId`, `createdAt` DESC);

-- CreateIndex
CREATE INDEX `Notify_toUserId_createdAt_idx` ON `Notify`(`toUserId`, `createdAt` DESC);

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LibraryManga` ADD CONSTRAINT `fk_library_manga_manga_cascade` FOREIGN KEY (`mangaId`) REFERENCES `Manga`(`mangadexId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MangaComment` ADD CONSTRAINT `MangaComment_mangaId_fkey` FOREIGN KEY (`mangaId`) REFERENCES `Manga`(`mangadexId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chapter` ADD CONSTRAINT `Chapter_mangaId_fkey` FOREIGN KEY (`mangaId`) REFERENCES `Manga`(`mangadexId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChapterComment` ADD CONSTRAINT `ChapterComment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
