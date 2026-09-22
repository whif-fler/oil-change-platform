"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import type { EnquiryStatus } from "@prisma/client";
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
  const [value, setValue] = useState(currentStatus);

  function handleValueChange(newStatus: string | null) {
    if (!newStatus || newStatus === value) return;

    setError("");
    setValue(newStatus);
    startTransition(async () => {
      const result = await updateEnquiryStatus(
        enquiryId,
        newStatus as EnquiryStatus,
      );

      if (result.ok) {
        router.refresh();
      } else {
        setError(result.error);
        setValue(currentStatus);
      }
    });
  }

  return (
    <div className="space-y-3">
      <SelectPrimitive.Root
        value={value}
        onValueChange={handleValueChange}
        disabled={isPending}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <SelectPrimitive.Label className="mb-2 text-sm font-semibold text-text sm:mb-0">
            Status
          </SelectPrimitive.Label>
          <SelectPrimitive.Trigger className="flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface-raised px-3 text-sm text-text outline-none transition-colors hover:bg-surface-muted focus-visible:border-focus focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-3 focus-visible:ring-focus/50 disabled:cursor-not-allowed disabled:opacity-50 data-[open]:border-focus data-[open]:ring-3 data-[open]:ring-focus/50 sm:w-auto sm:min-w-[180px]">
            <SelectPrimitive.Value>
              {(value: string | null) =>
                STATUSES.find((s) => s.value === value)?.label ?? ""
              }
            </SelectPrimitive.Value>
            <SelectPrimitive.Icon className="shrink-0 text-text-muted">
              <ChevronDown className="size-4" aria-hidden="true" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          {isPending && (
            <span className="text-xs text-text-muted" aria-live="polite">
              Saving…
            </span>
          )}
        </div>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Positioner side="bottom" align="start" sideOffset={6}>
            <SelectPrimitive.Popup className="max-h-72 w-48 overflow-auto rounded-lg border border-border bg-surface-raised p-1 shadow-card outline-none">
              {STATUSES.map((status) => (
                <SelectPrimitive.Item
                  key={status.value}
                  value={status.value}
                  className="flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm text-text outline-none data-[highlighted]:bg-muted data-[highlighted]:text-foreground data-[selected]:font-semibold"
                >
                  <SelectPrimitive.ItemIndicator className="flex w-4 shrink-0 justify-center">
                    <Check className="size-4 text-accent" aria-hidden="true" />
                  </SelectPrimitive.ItemIndicator>
                  <SelectPrimitive.ItemText className="flex-1 truncate">
                    {status.label}
                  </SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Popup>
          </SelectPrimitive.Positioner>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {error && (
        <p className="text-sm text-destructive" role="alert" aria-live="assertive">
          {error}
        </p>
      )}
    </div>
  );
}