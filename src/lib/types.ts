/**
 * Shared domain types for the oil-change platform.
 *
 * Use Prisma-generated types for database operations (server-side only).
 * These types cover client↔API boundaries and pricing engine I/O.
 */

import type { EquipmentType, OilType, AddOn, Frequency } from "@/config/catalog";

// ─── Service Configuration (client selections) ─────────────

/** What the client sends to describe a service configuration. */
export interface ServiceConfig {
  equipmentType: EquipmentType;
  oilType: OilType;
  addOns: AddOn[];
  frequency: Frequency;
}

// ─── Pricing Breakdown ─────────────────────────────────────

/** Line-item breakdown returned by the pricing engine. */
export interface PricingBreakdown {
  serviceFeeMinor: number;
  oilCostMinor: number;
  addOnCostsMinor: { addOn: AddOn; costMinor: number }[];
  subtotalMinor: number;
  discountMinor: number;
  totalMinor: number;
  currency: string;
  /** Echo back the config used for this quote. */
  config: ServiceConfig;
}

// ─── Enquiry Payloads (API request body) ───────────────────

/** Base fields shared by both enquiry kinds. */
interface EnquiryBase {
  clientRequestId: string;
  name: string;
  email: string;
  phone: string;
}

/** General question — no venue, no service config, message required. */
export interface QuestionEnquiryPayload extends EnquiryBase {
  kind: "QUESTION";
  message: string;
}

/** Service request — venue required, service required, message optional. */
export interface ServiceRequestEnquiryPayload extends EnquiryBase {
  kind: "SERVICE_REQUEST";
  message?: string;
  venueName?: string;
  venueAddress: string;
  preferredDate?: string;
  service: ServiceConfig;
}

/** Discriminated union of all enquiry payloads. */
export type EnquiryPayload =
  | QuestionEnquiryPayload
  | ServiceRequestEnquiryPayload;

// ─── API Responses ─────────────────────────────────────────

export interface ApiSuccessResponse {
  ok: true;
  data: {
    id: string;
    clientRequestId: string;
  };
}

export interface ApiErrorResponse {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;
