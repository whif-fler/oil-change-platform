/**
 * Zod validation schemas for the API boundary.
 *
 * Uses a discriminated union on `kind` so QUESTION and SERVICE_REQUEST
 * enforce their respective required/optional fields.
 */

import { z } from "zod";
import { EQUIPMENT, OIL, ADD_ONS, FREQUENCY } from "@/config/catalog";

// ─── Catalog enum schemas ──────────────────────────────────

const equipmentTypeEnum = z.enum(
  Object.keys(EQUIPMENT) as [string, ...string[]],
);
const oilTypeEnum = z.enum(Object.keys(OIL) as [string, ...string[]]);
const addOnEnum = z.enum(Object.keys(ADD_ONS) as [string, ...string[]]);
const frequencyEnum = z.enum(Object.keys(FREQUENCY) as [string, ...string[]]);

// ─── Service config schema ─────────────────────────────────

const serviceConfigSchema = z.object({
  equipmentType: equipmentTypeEnum,
  oilType: oilTypeEnum,
  addOns: z.array(addOnEnum).default([]),
  frequency: frequencyEnum,
});

// ─── Base fields (shared) ──────────────────────────────────

const baseFields = {
  clientRequestId: z
    .string()
    .min(1, "clientRequestId is required")
    .max(64, "clientRequestId must be 64 characters or fewer"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(254, "Email must be 254 characters or fewer"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .max(30, "Phone must be 30 characters or fewer"),
};

// ─── QUESTION enquiry ──────────────────────────────────────

const questionEnquirySchema = z.object({
  ...baseFields,
  kind: z.literal("QUESTION"),
  message: z
    .string()
    .min(1, "Message is required for questions")
    .max(2000, "Message must be 2000 characters or fewer"),
});

// ─── SERVICE_REQUEST enquiry ────────────────────────────────

const serviceRequestEnquirySchema = z.object({
  ...baseFields,
  kind: z.literal("SERVICE_REQUEST"),
  message: z
    .string()
    .max(2000, "Message must be 2000 characters or fewer")
    .optional(),
  venueName: z
    .string()
    .max(120, "Venue name must be 120 characters or fewer")
    .optional(),
  venueAddress: z
    .string()
    .min(1, "Venue address is required for service requests")
    .max(300, "Venue address must be 300 characters or fewer"),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Preferred date must be YYYY-MM-DD")
    .optional(),
  service: serviceConfigSchema,
});

// ─── Discriminated union ───────────────────────────────────

export const enquiryPayloadSchema = z.discriminatedUnion("kind", [
  questionEnquirySchema,
  serviceRequestEnquirySchema,
]);

// ─── Enquiry status update ────────────────────────────────

export const updateStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "SCHEDULED", "COMPLETED", "CANCELLED"]),
});

// ─── Persisted quotation breakdown ────────────────────────

const addOnCostSchema = z.object({
  addOn: addOnEnum,
  costMinor: z.number(),
});

export const quotationBreakdownSchema = z.object({
  serviceFeeMinor: z.number(),
  oilCostMinor: z.number(),
  addOnCostsMinor: z.array(addOnCostSchema),
  subtotalMinor: z.number(),
  discountMinor: z.number(),
  totalMinor: z.number(),
  currency: z.string(),
  config: z.object({
    equipmentType: equipmentTypeEnum,
    oilType: oilTypeEnum,
    addOns: z.array(addOnEnum),
    frequency: frequencyEnum,
  }),
});

// ─── Inferred types ────────────────────────────────────────

export type EnquiryPayloadInput = z.infer<typeof enquiryPayloadSchema>;
