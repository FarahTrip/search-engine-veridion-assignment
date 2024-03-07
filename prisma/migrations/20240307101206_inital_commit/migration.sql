/*
  Warnings:

  - You are about to drop the column `name` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `socialMedia` on the `company` table. All the data in the column will be lost.
  - The `adress` column on the `company` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `blogs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contacts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `faqs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `jobs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscribers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `company_commercial_name` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_legal_name` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `domain` to the `company` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "blogs" DROP CONSTRAINT "blogs_authorId_fkey";

-- DropForeignKey
ALTER TABLE "permissions" DROP CONSTRAINT "permissions_roleId_fkey";

-- AlterTable
ALTER TABLE "company" DROP COLUMN "name",
DROP COLUMN "phone",
DROP COLUMN "socialMedia",
ADD COLUMN     "company_all_available_names" TEXT[],
ADD COLUMN     "company_commercial_name" TEXT NOT NULL,
ADD COLUMN     "company_legal_name" TEXT NOT NULL,
ADD COLUMN     "domain" TEXT NOT NULL,
ADD COLUMN     "emails" TEXT[],
ADD COLUMN     "phoneNumbers" TEXT[],
ADD COLUMN     "socialMediaLinks" TEXT[],
DROP COLUMN "adress",
ADD COLUMN     "adress" TEXT[];

-- DropTable
DROP TABLE "blogs";

-- DropTable
DROP TABLE "contacts";

-- DropTable
DROP TABLE "faqs";

-- DropTable
DROP TABLE "jobs";

-- DropTable
DROP TABLE "permissions";

-- DropTable
DROP TABLE "roles";

-- DropTable
DROP TABLE "subscribers";

-- DropTable
DROP TABLE "tokens";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "RoleType";

-- DropEnum
DROP TYPE "TokenType";

-- DropEnum
DROP TYPE "blogStatusType";
