-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "readingTime" INTEGER NOT NULL DEFAULT 1;
