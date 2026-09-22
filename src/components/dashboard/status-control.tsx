"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateEnquiryStatus } from "@/lib/actions/enquiry";

const STATUSES = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

export function StatusControl({
  enquiryId,
  currentStatus,
}: {
  enquiryId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const selectRef = useRef<HTMLSelectElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;

    setError("");
    startTransition(async () => {
      const result = await updateEnquiryStatus(
        enquiryId,
        newStatus as "NEW" | "CONTACTED" | "SCHEDULED" | "COMPLETED" | "CANCELLED",
      );

      if (result.ok) {
        router.refresh();
      } else {
        setError(result.error);
        if (selectRef.current) {
          selectRef.current.value = currentStatus;
        }
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label
          htmlFor="status-select"
          className="text-sm font-semibold text-text"
        >
          Status
        </label>
        <select
          ref={selectRef}
          id="status-select"
          defaultValue={currentStatus}
          onChange={handleChange}
          disabled={isPending}
          className="h-9 rounded-lg border border-border bg-surface-raised px-3 text-sm text-text outline-none focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus/50 disabled:opacity-50"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        {isPending && (
          <span className="text-xs text-text-muted" aria-live="polite">
            Saving…
          </span>
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert" aria-live="assertive">
          {error}
        </p>
      )}
    </div>
  );
}
