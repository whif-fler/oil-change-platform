import { cn } from "cn";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  NEW: {
    label: "New",
    className: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  CONTACTED: {
    label: "Contacted",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  SCHEDULED: {
    label: "Scheduled",
    className: "bg-violet-50 text-violet-700 ring-violet-200",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700 ring-red-200",
  },
};

export function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground ring-border",
  };

  return (
    <span
      role="status"
      aria-label={`Status: ${config.label}`}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
