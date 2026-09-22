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

function KindLabel({ kind }: { kind: string }) {
  return kind === "SERVICE_REQUEST" ? "Service request" : "Question";
}

export function EnquiryTable({ enquiries }: { enquiries: EnquiryRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs font-semibold text-text-muted">
            <th scope="col" className="px-4 py-3">
              Name
            </th>
            <th scope="col" className="px-4 py-3">
              Type
            </th>
            <th scope="col" className="px-4 py-3">
              Venue
            </th>
            <th scope="col" className="px-4 py-3">
              Created
            </th>
            <th scope="col" className="px-4 py-3">
              Preferred date
            </th>
            <th scope="col" className="px-4 py-3">
              Estimated total
            </th>
            <th scope="col" className="px-4 py-3">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map((enquiry) => (
            <tr
              key={enquiry.id}
              className="border-b border-border last:border-0 hover:bg-surface-muted/50"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/dashboard/${enquiry.id}`}
                  className="font-medium text-text underline-offset-4 hover:underline focus-visible:outline-3 focus-visible:outline-focus focus-visible:outline-offset-2"
                  aria-label={`View enquiry from ${enquiry.name}`}
                >
                  {enquiry.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-text-muted">
                <KindLabel kind={enquiry.kind} />
              </td>
              <td className="px-4 py-3 text-text-muted">
                {enquiry.venueName ? (
                  <span className="block truncate font-medium text-text" title={enquiry.venueName}>
                    {enquiry.venueName}
                  </span>
                ) : (
                  <span className="text-text-muted">—</span>
                )}
                {enquiry.venueAddress && (
                  <span
                    className="mt-0.5 block truncate text-xs text-text-muted"
                    title={enquiry.venueAddress}
                  >
                    {enquiry.venueAddress}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-text-muted">{formatDate(enquiry.createdAt)}</td>
              <td className="px-4 py-3 text-text-muted">
                {enquiry.preferredDate ? formatDate(enquiry.preferredDate) : "—"}
              </td>
              <td className="px-4 py-3 font-medium text-text">
                {enquiry.quotation
                  ? formatCurrency(enquiry.quotation.totalMinor, enquiry.quotation.currency)
                  : "—"}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={enquiry.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
