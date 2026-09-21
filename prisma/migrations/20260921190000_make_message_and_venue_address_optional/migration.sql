-- AlterTable: Make message and venueAddress nullable for QUESTION enquiries
ALTER TABLE "Enquiry" ALTER COLUMN "message" DROP NOT NULL;
ALTER TABLE "Enquiry" ALTER COLUMN "venueAddress" DROP NOT NULL;
