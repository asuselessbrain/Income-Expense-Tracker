-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'blocked');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'active';
