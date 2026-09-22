import Link from "next/link";
import { StatusBadge } from "./status-badge";
import { formatDate, formatCurrency } from "@/lib/formatting";

type EnquiryRow = {
  id: string;
  kind: string;
  name: string;
  email: string;
  venueName: string | null;
  venueAddress: string | null;
  preferredDate: Date | null;
  status: string;
  createdAt: Date;
  quotation: {
    totalMinor: number;
    currency: string;
    equipmentType: string;
    frequency: string;
  } | null;
};

function KindBadge({ kind }: { kind: string }) {
  const isServiceRequest = kind === "SERVICE_REQUEST";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
        isServiceRequest
          ? "bg-accent/10 text-accent"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {isServiceRequest ? "Service request" : "Question"}
    </span>
  );
}

export function EnquiryCard({ enquiry }: { enquiry: EnquiryRow }) {
  const { id, kind, name, venueName, venueAddress, preferredDate, status, createdAt, quotation } =
    enquiry;

  return (
    <article className="block rounded-xl bg-surface-raised ring-1 ring-border">
      <Link
        href={`/dashboard/${id}`}
        className="flex flex-col gap-3 p-4 focus-visible:outline-3 focus-visible:outline-focus focus-visible:outline-offset-2"
        aria-label={`View enquiry from ${name}, status: ${status}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-body font-semibold text-text">{name}</h3>
            <p className="mt-0.5 text-xs text-text-muted">{formatDate(createdAt)}</p>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <KindBadge kind={kind} />
          {quotation && (
            <span className="text-xs font-medium text-text">
              {formatCurrency(quotation.totalMinor, quotation.currency)}
            </span>
          )}
        </div>

        {(venueName || venueAddress) && (
          <div className="min-w-0 text-xs text-text-muted">
            {venueName && <p className="truncate font-medium text-text">{venueName}</p>}
            {venueAddress && (
              <p className="mt-0.5 line-clamp-2 leading-relaxed">{venueAddress}</p>
            )}
          </div>
        )}

        {preferredDate && (
          <p className="text-xs text-text-muted">
            Preferred:{" "}
            <span className="font-medium text-text">{formatDate(preferredDate)}</span>
          </p>
        )}
      </Link>
    </article>
  );
}
