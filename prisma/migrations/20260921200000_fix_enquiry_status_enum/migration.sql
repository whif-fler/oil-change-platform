-- Fix EnquiryStatus enum: rename DONE → COMPLETED, add CANCELLED
-- Table is empty, safe to drop and recreate enum

ALTER TABLE "Enquiry" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Enquiry" ALTER COLUMN "status" TYPE TEXT;

DROP TYPE "EnquiryStatus";

CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'SCHEDULED', 'COMPLETED', 'CANCELLED');

ALTER TABLE "Enquiry" ALTER COLUMN "status" TYPE "EnquiryStatus" USING status::"EnquiryStatus";
ALTER TABLE "Enquiry" ALTER COLUMN "status" SET DEFAULT 'NEW';
