/*
  Warnings:

  - You are about to drop the column `longDesc` on the `Project` table. All the data in the column will be lost.
  - Added the required column `description` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `h1Title` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "longDesc",
ADD COLUMN     "colorPalette" TEXT,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "h1Title" TEXT NOT NULL,
ADD COLUMN     "h2Title" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "techSpecs" JSONB;

-- AlterTable
ALTER TABLE "ProjectImage" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
