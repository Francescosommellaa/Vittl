-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "IngredientCategory" ADD VALUE 'SALUMI';
ALTER TYPE "IngredientCategory" ADD VALUE 'UOVA';
ALTER TYPE "IngredientCategory" ADD VALUE 'CONSERVE';
ALTER TYPE "IngredientCategory" ADD VALUE 'DOLCI';
ALTER TYPE "IngredientCategory" ADD VALUE 'OLIO_GRASSI';
