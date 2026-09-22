-- AlterEnum: extend EquipmentType with custom-quote equipment types.
-- Existing rows are unaffected — ADD VALUE only appends to the enum.
ALTER TYPE "EquipmentType" ADD VALUE IF NOT EXISTS 'BUILT_IN';
ALTER TYPE "EquipmentType" ADD VALUE IF NOT EXISTS 'OTHER';

-- CreateEnum: capacity tiers in gallons (equipment type is now separate from capacity).
CREATE TYPE "Capacity" AS ENUM ('UP_TO_5', 'RANGE_5_10', 'RANGE_10_15', 'RANGE_15_20', 'OVER_20');

-- AlterTable: nullable capacity column preserves existing rows (NULL for pre-migration quotations).
ALTER TABLE "Quotation" ADD COLUMN "capacity" "Capacity";
