import { NextRequest, NextResponse } from "next/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "@/lib/db";
import { enquiryPayloadSchema } from "@/lib/validations";
import { calculatePricing } from "@/lib/pricing";
import type {
  ApiResponse,
  QuestionEnquiryPayload,
  ServiceRequestEnquiryPayload,
} from "@/lib/types";
import type {
  EquipmentType,
  Capacity,
  OilType,
  AddOn,
  Frequency,
} from "@prisma/client";

// ─── Helpers ───────────────────────────────────────────────

function jsonError(
  status: number,
  code: string,
  message: string,
  details?: Record<string, string[]>,
): NextResponse<ApiResponse> {
  return NextResponse.json(
    { ok: false, error: { code, message, ...(details ? { details } : {}) } },
    { status },
  );
}

function jsonCreated(
  id: string,
  clientRequestId: string,
): NextResponse<ApiResponse> {
  return NextResponse.json(
    { ok: true, data: { id, clientRequestId } },
    { status: 201 },
  );
}

function jsonOk(
  id: string,
  clientRequestId: string,
): NextResponse<ApiResponse> {
  return NextResponse.json(
    { ok: true, data: { id, clientRequestId } },
    { status: 200 },
  );
}

/**
 * Convert a YYYY-MM-DD string to a UTC Date at midnight.
 * Using 'T00:00:00Z' avoids timezone-induced date shifts.
 */
function parsePreferredDate(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00Z`);
}

// ─── POST /api/enquiries ───────────────────────────────────

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  // ── 1. Content type check ──────────────────────────────
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return jsonError(
      400,
      "INVALID_CONTENT_TYPE",
      "Expected application/json.",
    );
  }

  // ── 2. Parse JSON body ─────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(
      400,
      "MALFORMED_JSON",
      "Request body is not valid JSON.",
    );
  }

  // ── 3. Zod validation ──────────────────────────────────
  const result = enquiryPayloadSchema.safeParse(body);
  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      const key = path || "_root";
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return jsonError(
      422,
      "VALIDATION_ERROR",
      "Please check the submitted fields.",
      fieldErrors,
    );
  }

  const payload = result.data;

  // ── 4. Idempotency check ───────────────────────────────
  const existing = await prisma.enquiry.findUnique({
    where: { clientRequestId: payload.clientRequestId },
    select: { id: true, clientRequestId: true },
  });
  if (existing) {
    return jsonOk(existing.id, existing.clientRequestId);
  }

  // ── 5. Persist ─────────────────────────────────────────
  try {
    if (payload.kind === "QUESTION") {
      return await createQuestionEnquiry(payload);
    }
    return await createServiceRequestEnquiry(payload);
  } catch (error) {
    // Race-safe idempotency: if another request created the same
    // clientRequestId between our check and our create, Prisma
    // will throw a unique constraint violation (P2002).
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const conflict = await prisma.enquiry.findUnique({
        where: { clientRequestId: payload.clientRequestId },
        select: { id: true, clientRequestId: true },
      });
      if (conflict) {
        return jsonOk(conflict.id, conflict.clientRequestId);
      }
    }

    console.error("[POST /api/enquiries]", error);
    return jsonError(
      500,
      "SERVER_ERROR",
      "Something went wrong. Please try again later.",
    );
  }
}

// ─── Create helpers ────────────────────────────────────────

async function createQuestionEnquiry(
  payload: QuestionEnquiryPayload,
): Promise<NextResponse<ApiResponse>> {
  const enquiry = await prisma.enquiry.create({
    data: {
      clientRequestId: payload.clientRequestId,
      kind: "QUESTION",
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      message: payload.message,
    },
    select: { id: true, clientRequestId: true },
  });
  return jsonCreated(enquiry.id, enquiry.clientRequestId);
}

async function createServiceRequestEnquiry(
  payload: ServiceRequestEnquiryPayload,
): Promise<NextResponse<ApiResponse>> {
  // Server-side pricing — never trust the client
  const pricing = calculatePricing(payload.service);

  const enquiry = await prisma.$transaction(async (tx) => {
    const quotation = await tx.quotation.create({
      data: {
        equipmentType: payload.service.equipmentType as EquipmentType,
        capacity: payload.service.capacity as Capacity,
        oilType: payload.service.oilType as OilType,
        addOns: payload.service.addOns as AddOn[],
        frequency: payload.service.frequency as Frequency,
        totalMinor: pricing.totalMinor,
        currency: pricing.currency,
        breakdown: JSON.parse(JSON.stringify(pricing)),
      },
      select: { id: true },
    });

    return tx.enquiry.create({
      data: {
        clientRequestId: payload.clientRequestId,
        kind: "SERVICE_REQUEST",
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        message: payload.message ?? null,
        venueName: payload.venueName ?? null,
        venueAddress: payload.venueAddress,
        preferredDate: payload.preferredDate
          ? parsePreferredDate(payload.preferredDate)
          : null,
        quotationId: quotation.id,
      },
      select: { id: true, clientRequestId: true },
    });
  });

  return jsonCreated(enquiry.id, enquiry.clientRequestId);
}
