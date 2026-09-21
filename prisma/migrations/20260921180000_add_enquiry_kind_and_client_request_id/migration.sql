-- CreateEnum
CREATE TYPE "EnquiryKind" AS ENUM ('QUESTION', 'SERVICE_REQUEST');

-- AlterTable: Add kind and clientRequestId to Enquiry
ALTER TABLE "Enquiry" ADD COLUMN "kind" "EnquiryKind" NOT NULL DEFAULT 'SERVICE_REQUEST';
ALTER TABLE "Enquiry" ADD COLUMN "clientRequestId" VARCHAR(64) NOT NULL;

-- CreateIndex: Unique constraint on clientRequestId
CREATE UNIQUE INDEX "Enquiry_clientRequestId_key" ON "Enquiry"("clientRequestId");
