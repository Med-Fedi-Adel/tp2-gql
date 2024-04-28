/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Cv` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - Changed the type of `age` on the `Cv` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cv" DROP COLUMN "createdAt",
DROP COLUMN "age",
ADD COLUMN     "age" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
ADD COLUMN     "email" TEXT NOT NULL;
