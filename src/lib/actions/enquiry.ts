"use server";

import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateStatusSchema } from "@/lib/validations";
import type { EnquiryStatus } from "@prisma/client";

type StatusResult =
  | { ok: true }
  | { ok: false; error: string };

export async function updateEnquiryStatus(
  enquiryId: string,
  newStatus: EnquiryStatus,
): Promise<StatusResult> {
  // 1. Verify authentication
  const user = await getSessionUser();
  if (!user) {
    return { ok: false, error: "You must be signed in to update status." };
  }

  // 2. Validate inputs
  const idResult = updateStatusSchema.safeParse({ status: newStatus });
  if (!idResult.success) {
    return { ok: false, error: "Invalid status value." };
  }

  if (!enquiryId || typeof enquiryId !== "string") {
    return { ok: false, error: "Invalid enquiry ID." };
  }

  // 3. Update the enquiry
  try {
    await prisma.enquiry.update({
      where: { id: enquiryId },
      data: { status: idResult.data.status },
    });
  } catch (error: unknown) {
    if (
      error instanceof Object &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return { ok: false, error: "Enquiry not found." };
    }
    console.error("[updateEnquiryStatus]", error);
    return { ok: false, error: "Failed to update status. Please try again." };
  }

  return { ok: true };
}
