/*
  Warnings:

  - You are about to drop the column `locationId` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `Ingredient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Ingredient` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "IngredientCategory" AS ENUM ('FRUTTA', 'VERDURA', 'ORTAGGI', 'CARNE', 'PESCE', 'LATTICINI', 'CEREALI', 'LEGUMI', 'SPEZIE', 'CONDIMENTI', 'BEVANDE', 'ALTRO');

-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_locationId_fkey";

-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_tenantId_fkey";

-- DropIndex
DROP INDEX "Ingredient_tenantId_idx";

-- DropIndex
DROP INDEX "Ingredient_tenantId_name_key";

-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "locationId",
DROP COLUMN "tenantId",
ADD COLUMN     "carbs" DOUBLE PRECISION,
ADD COLUMN     "category" "IngredientCategory" NOT NULL DEFAULT 'ALTRO',
ADD COLUMN     "fats" DOUBLE PRECISION,
ADD COLUMN     "fiber" DOUBLE PRECISION,
ADD COLUMN     "kcal" DOUBLE PRECISION,
ADD COLUMN     "proteins" DOUBLE PRECISION,
ADD COLUMN     "salt" DOUBLE PRECISION,
ADD COLUMN     "saturatedFats" DOUBLE PRECISION,
ADD COLUMN     "sugars" DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_name_key" ON "Ingredient"("name");

-- CreateIndex
CREATE INDEX "Ingredient_category_idx" ON "Ingredient"("category");
