-- CreateEnum
CREATE TYPE "EquipmentType" AS ENUM ('COUNTERTOP_FRYER', 'FLOOR_FRYER', 'FRYER_BANK');

-- CreateEnum
CREATE TYPE "OilType" AS ENUM ('CANOLA', 'SUNFLOWER', 'PALM', 'BLEND');

-- CreateEnum
CREATE TYPE "AddOn" AS ENUM ('FILTER_REPLACEMENT', 'DEEP_CLEAN', 'WASTE_OIL_DISPOSAL');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('ONE_TIME', 'MONTHLY');

-- CreateEnum
CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'SCHEDULED', 'DONE');

-- CreateTable
CREATE TABLE "Quotation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipmentType" "EquipmentType" NOT NULL,
    "oilType" "OilType" NOT NULL,
    "addOns" "AddOn"[],
    "frequency" "Frequency" NOT NULL,
    "totalMinor" INTEGER NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "breakdown" JSONB NOT NULL,

    CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "phone" VARCHAR(30) NOT NULL,
    "message" VARCHAR(2000) NOT NULL,
    "venueName" VARCHAR(120),
    "venueAddress" VARCHAR(300) NOT NULL,
    "preferredDate" TIMESTAMP(3),
    "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
    "quotationId" TEXT,

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Quotation_createdAt_idx" ON "Quotation"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Enquiry_quotationId_key" ON "Enquiry"("quotationId");

-- CreateIndex
CREATE INDEX "Enquiry_createdAt_idx" ON "Enquiry"("createdAt");

-- CreateIndex
CREATE INDEX "Enquiry_quotationId_idx" ON "Enquiry"("quotationId");

-- CreateIndex
CREATE INDEX "Enquiry_status_createdAt_idx" ON "Enquiry"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
